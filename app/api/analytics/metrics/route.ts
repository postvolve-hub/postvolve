/**
 * GET /api/analytics/metrics
 * Get analytics metrics for the authenticated user
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'missing_params', message: 'userId is required' },
        { status: 400 }
      );
    }

    // Build date filter
    let dateFilter = '';
    if (startDate) {
      dateFilter = `AND posted_at >= '${startDate}'`;
    }
    if (endDate) {
      dateFilter += ` AND posted_at <= '${endDate}'`;
    }

    // Get posted posts with analytics
    const { data: postedPosts, error: postsError } = await supabaseAdmin
      .from('posts')
      .select(`
        id,
        title,
        category,
        posted_at,
        post_platforms (
          platform,
          platform_post_id,
          posted_at,
          post_analytics (
            impressions,
            engagements,
            clicks,
            shares,
            likes,
            comments
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'posted')
      .order('posted_at', { ascending: false })
      .limit(100);

    if (postsError) {
      console.error('[Analytics Metrics] Error fetching posts:', postsError);
    }

    // Calculate aggregate metrics
    let totalImpressions = 0;
    let totalEngagements = 0;
    let totalClicks = 0;
    let totalShares = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalPosts = 0;

    const postHistory: Array<{
      id: string;
      title: string;
      date: string;
      category: string;
      impressions: string;
      engagement: string;
      status: string;
    }> = [];

    (postedPosts || []).forEach((post) => {
      const platforms = (post.post_platforms as any[]) || [];
      let postImpressions = 0;
      let postEngagements = 0;

      platforms.forEach((platform) => {
        const analytics = (platform.post_analytics as any[]) || [];
        analytics.forEach((analytics) => {
          postImpressions += analytics.impressions || 0;
          postEngagements += (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0);
          totalImpressions += analytics.impressions || 0;
          totalEngagements += (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0);
          totalClicks += analytics.clicks || 0;
          totalShares += analytics.shares || 0;
          totalLikes += analytics.likes || 0;
          totalComments += analytics.comments || 0;
        });
      });

      if (post.posted_at) {
        totalPosts++;
        postHistory.push({
          id: post.id,
          title: post.title || 'Untitled Post',
          date: new Date(post.posted_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          category: post.category || 'uncategorized',
          impressions: postImpressions > 0 ? `${(postImpressions / 1000).toFixed(1)}K` : '0',
          engagement: postEngagements > 0 ? postEngagements.toString() : '0',
          status: 'posted',
        });
      }
    });

    // Calculate rates
    const avgEngagementRate = totalPosts > 0 && totalImpressions > 0
      ? ((totalEngagements / totalImpressions) * 100).toFixed(1)
      : '0';
    
    const clickThroughRate = totalPosts > 0 && totalImpressions > 0
      ? ((totalClicks / totalImpressions) * 100).toFixed(1)
      : '0';

    // Format metrics for display
    const metrics = [
      {
        id: 1,
        label: 'Total Impressions',
        value: totalImpressions > 0 ? `${(totalImpressions / 1000).toFixed(1)}K` : '0',
        change: '+0%', // TODO: Calculate from previous period
        trend: 'up' as const,
      },
      {
        id: 2,
        label: 'Total Engagements',
        value: totalEngagements > 0 ? `${(totalEngagements / 1000).toFixed(1)}K` : '0',
        change: '+0%', // TODO: Calculate from previous period
        trend: 'up' as const,
      },
      {
        id: 3,
        label: 'Click-through Rate',
        value: `${clickThroughRate}%`,
        change: '+0%', // TODO: Calculate from previous period
        trend: 'up' as const,
      },
      {
        id: 4,
        label: 'Total Shares',
        value: totalShares > 0 ? `${(totalShares / 1000).toFixed(1)}K` : '0',
        change: '+0%', // TODO: Calculate from previous period
        trend: 'up' as const,
      },
      {
        id: 5,
        label: 'Avg. Engagement Rate',
        value: `${avgEngagementRate}%`,
        change: '+0%', // TODO: Calculate from previous period
        trend: 'up' as const,
      },
    ];

    return NextResponse.json({
      success: true,
      metrics,
      postHistory: postHistory.slice(0, 20), // Limit to 20 most recent
      summary: {
        totalImpressions,
        totalEngagements,
        totalClicks,
        totalShares,
        totalLikes,
        totalComments,
        totalPosts,
        avgEngagementRate: parseFloat(avgEngagementRate),
        clickThroughRate: parseFloat(clickThroughRate),
      },
    });
  } catch (error: any) {
    console.error('[Analytics Metrics] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}

