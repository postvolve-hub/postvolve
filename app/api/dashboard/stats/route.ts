/**
 * GET /api/dashboard/stats
 * Get dashboard statistics for the authenticated user
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
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    // Get draft posts (status = 'draft')
    const { data: draftPosts, error: draftError } = await supabaseAdmin
      .from('posts')
      .select('id, title, status, category, created_at')
      .eq('user_id', userId)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(10);

    if (draftError) {
      console.error('[Dashboard Stats] Error fetching drafts:', draftError);
    }

    // Get active/scheduled posts (status = 'scheduled' or 'publishing')
    const { data: activePosts, error: activeError } = await supabaseAdmin
      .from('posts')
      .select('id, title, status, category, scheduled_at, created_at')
      .eq('user_id', userId)
      .in('status', ['scheduled', 'publishing'])
      .order('scheduled_at', { ascending: true })
      .limit(10);

    if (activeError) {
      console.error('[Dashboard Stats] Error fetching active posts:', activeError);
    }

    // Get total counts
    const { count: totalPosts } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: totalDrafts } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'draft');

    const { count: totalScheduled } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'scheduled');

    const { count: totalPosted } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'posted');

    // Get category breakdown
    const { data: categoryData } = await supabaseAdmin
      .from('posts')
      .select('category')
      .eq('user_id', userId);

    const categoryBreakdown: Record<string, number> = {};
    categoryData?.forEach((post) => {
      const cat = post.category || 'uncategorized';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalPosts: totalPosts || 0,
        totalDrafts: totalDrafts || 0,
        totalScheduled: totalScheduled || 0,
        totalPosted: totalPosted || 0,
        categoryBreakdown,
      },
      draftPosts: draftPosts || [],
      activePosts: activePosts || [],
    });
  } catch (error: any) {
    console.error('[Dashboard Stats] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

