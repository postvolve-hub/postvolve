/**
 * GET /api/cron/generate-daily
 * POST /api/cron/generate-daily
 * 
 * Cron job for Lane 1: Automated daily content generation
 * Runs daily at configured times via Supabase pg_cron
 * 
 * For each user with auto_posting_enabled = true:
 * - Check their posting_schedules
 * - Generate content based on their selected categories
 * - Create draft posts in the database
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateContent } from '@/lib/generation-orchestrator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function handleCronRequest(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Generate Daily] Starting automated daily content generation...');
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // Find users with auto-posting enabled
    const { data: userSettings, error: settingsError } = await supabaseAdmin
      .from('user_settings')
      .select(`
        user_id,
        auto_posting_enabled,
        selected_categories,
        default_platforms,
        users!inner (
          id,
          email
        )
      `)
      .eq('auto_posting_enabled', true);

    if (settingsError) {
      console.error('[Generate Daily] Error fetching user settings:', settingsError);
      throw settingsError;
    }

    if (!userSettings || userSettings.length === 0) {
      console.log('[Generate Daily] No users with auto-posting enabled');
      return NextResponse.json({
        success: true,
        generated: 0,
        usersProcessed: 0,
        message: 'No users with auto-posting enabled',
      });
    }

    console.log(`[Generate Daily] Found ${userSettings.length} users with auto-posting enabled`);

    const results: Array<{ userId: string; success: boolean; postsGenerated: number; errors: string[] }> = [];

    // Process each user
    for (const setting of userSettings) {
      const userId = setting.user_id;
      const categories = (setting.selected_categories as string[]) || ['tech'];
      const platforms = (setting.default_platforms as string[]) || ['linkedin', 'x', 'facebook', 'instagram'];

      try {
        // Check if user has active schedules for current time
        const { data: schedules, error: scheduleError } = await supabaseAdmin
          .from('posting_schedules')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (scheduleError) {
          throw new Error(`Failed to fetch schedules: ${scheduleError.message}`);
        }

        if (!schedules || schedules.length === 0) {
          console.log(`[Generate Daily] User ${userId} has no active schedules, skipping`);
          continue;
        }

        // Check if any schedule matches current time (within 5 minute window)
        const matchingSchedule = schedules.find((schedule: any) => {
          if (!schedule.preferred_draft_time) return false;
          const scheduleTime = schedule.preferred_draft_time.split(':');
          const scheduleHour = parseInt(scheduleTime[0]);
          const scheduleMinute = parseInt(scheduleTime[1]);
          
          // Allow 5-minute window
          const timeDiff = Math.abs(
            (currentHour * 60 + currentMinute) - (scheduleHour * 60 + scheduleMinute)
          );
          return timeDiff <= 5;
        });

        if (!matchingSchedule) {
          console.log(`[Generate Daily] No matching schedule for user ${userId} at ${currentTime}`);
          continue;
        }

        // Check if we already generated a post today for this user
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const { count: todayPosts } = await supabaseAdmin
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('generation_lane', 'auto')
          .gte('created_at', todayStart);

        // Respect daily limits (check subscription)
        const { data: subscription } = await supabaseAdmin
          .from('subscriptions')
          .select('posts_per_day')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const dailyLimit = subscription?.posts_per_day === -1 ? 999 : (subscription?.posts_per_day || 1);
        
        if ((todayPosts || 0) >= dailyLimit) {
          console.log(`[Generate Daily] User ${userId} has reached daily limit (${dailyLimit}), skipping`);
          continue;
        }

        // Select a random category for this generation
        const selectedCategory = categories[Math.floor(Math.random() * categories.length)] as 'tech' | 'ai' | 'business' | 'motivation';

        console.log(`[Generate Daily] Generating content for user ${userId}, category: ${selectedCategory}`);

        // Generate content using the orchestrator
        const generationResult = await generateContent({
          lane: 'auto',
          category: selectedCategory,
          platforms: platforms as any,
        });

        // Save to database
        const { data: post, error: postError } = await supabaseAdmin
          .from('posts')
          .insert({
            user_id: userId,
            title: generationResult.title,
            content: generationResult.content[0]?.content || '',
            category: selectedCategory,
            generation_lane: 'auto',
            status: 'draft',
            image_url: generationResult.image?.imageUrl || null,
            image_prompt: generationResult.image?.prompt || null,
          })
          .select()
          .single();

        if (postError) {
          throw new Error(`Failed to save post: ${postError.message}`);
        }

        // Create platform-specific content entries
        const platformInserts = generationResult.content.map((content: any) => ({
          post_id: post.id,
          platform: content.platform === 'x' ? 'twitter' : content.platform,
          content: content.content,
          status: 'draft',
        }));

        const { error: platformError } = await supabaseAdmin
          .from('post_platforms')
          .insert(platformInserts);

        if (platformError) {
          console.error(`[Generate Daily] Error saving platform content for post ${post.id}:`, platformError);
          // Continue anyway - post is created
        }

        console.log(`[Generate Daily] Successfully generated post ${post.id} for user ${userId}`);
        results.push({
          userId,
          success: true,
          postsGenerated: 1,
          errors: [],
        });
      } catch (error: any) {
        console.error(`[Generate Daily] Error processing user ${userId}:`, error);
        results.push({
          userId,
          success: false,
          postsGenerated: 0,
          errors: [error.message || 'Unknown error'],
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalGenerated = results.reduce((sum, r) => sum + r.postsGenerated, 0);

    console.log(`[Generate Daily] Completed: ${successCount} users processed, ${totalGenerated} posts generated`);

    return NextResponse.json({
      success: true,
      usersProcessed: successCount,
      totalUsers: userSettings.length,
      postsGenerated: totalGenerated,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Generate Daily] Cron job error:', error);
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

export async function GET(request: NextRequest) {
  return handleCronRequest(request);
}

export async function POST(request: NextRequest) {
  return handleCronRequest(request);
}

