/**
 * GET /api/cron/test-publish
 * Manual trigger endpoint for testing the publish-scheduled cron job
 * Useful for debugging why scheduled posts aren't being published
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication check for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Test Publish] Manual trigger - checking scheduled posts...');
    const now = new Date().toISOString();

    // Get all scheduled posts with detailed info
    const { data: scheduledPosts, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select(`
        id,
        user_id,
        title,
        status,
        scheduled_at,
        created_at,
        post_platforms (
          id,
          platform,
          status,
          content
        )
      `)
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)
      .is('deleted_at', null)
      .order('scheduled_at', { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error('[Test Publish] Error fetching scheduled posts:', fetchError);
      return NextResponse.json(
        { error: 'database_error', message: fetchError.message },
        { status: 500 }
      );
    }

    // Analyze each post
    const analysis = (scheduledPosts || []).map((post: any) => {
      const platforms = (post.post_platforms || []) as any[];
      const scheduledPlatforms = platforms.filter((pp: any) => pp.status === 'scheduled');
      const draftPlatforms = platforms.filter((pp: any) => pp.status === 'draft' || pp.status === 'pending');
      
      return {
        postId: post.id,
        userId: post.user_id,
        title: post.title,
        scheduledAt: post.scheduled_at,
        status: post.status,
        totalPlatforms: platforms.length,
        scheduledPlatforms: scheduledPlatforms.length,
        draftPlatforms: draftPlatforms.length,
        platforms: platforms.map((pp: any) => ({
          platform: pp.platform,
          status: pp.status,
        })),
        canPublish: scheduledPlatforms.length > 0 || draftPlatforms.length > 0,
        issue: scheduledPlatforms.length === 0 && draftPlatforms.length === 0 
          ? 'No platforms found' 
          : scheduledPlatforms.length === 0 && draftPlatforms.length > 0
          ? 'Platforms not set to scheduled status'
          : 'OK',
      };
    });

    // Call the actual publish endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const publishResponse = await fetch(`${baseUrl}/api/cron/publish-scheduled`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret || ''}`,
      },
    });

    const publishResult = await publishResponse.json().catch(() => ({ error: 'Failed to parse response' }));

    return NextResponse.json({
      success: true,
      timestamp: now,
      analysis: {
        totalScheduledPosts: scheduledPosts?.length || 0,
        posts: analysis,
        summary: {
          canPublish: analysis.filter(p => p.canPublish).length,
          hasIssues: analysis.filter(p => p.issue !== 'OK').length,
          noPlatforms: analysis.filter(p => p.issue === 'No platforms found').length,
          platformsNotScheduled: analysis.filter(p => p.issue === 'Platforms not set to scheduled status').length,
        },
      },
      publishResult,
    });
  } catch (error: any) {
    console.error('[Test Publish] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

