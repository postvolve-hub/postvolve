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

    // Calculate previous period metrics for comparison
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;
    
    if (startDate && endDate) {
      const currentStart = new Date(startDate);
      const currentEnd = new Date(endDate);
      const periodLength = currentEnd.getTime() - currentStart.getTime();
      previousPeriodEnd = new Date(currentStart.getTime() - 1);
      previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodLength);
    } else {
      // Default: Last 30 days vs previous 30 days
      const endDateObj = endDate ? new Date(endDate) : new Date();
      const startDateObj = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const periodLength = endDateObj.getTime() - startDateObj.getTime();
      previousPeriodEnd = new Date(startDateObj.getTime() - 1);
      previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodLength);
    }

    // Get previous period data
    const { data: previousPosts } = await supabaseAdmin
      .from('posts')
      .select(`
        id,
        post_platforms (
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
      .gte('posted_at', previousPeriodStart.toISOString())
      .lte('posted_at', previousPeriodEnd.toISOString())
      .limit(100);

    let prevImpressions = 0;
    let prevEngagements = 0;
    let prevClicks = 0;
    let prevShares = 0;
    let prevEngagementRate = 0;

    (previousPosts || []).forEach((post) => {
      const platforms = (post.post_platforms as any[]) || [];
      platforms.forEach((platform) => {
        const analytics = (platform.post_analytics as any[]) || [];
        analytics.forEach((analytics) => {
          prevImpressions += analytics.impressions || 0;
          prevEngagements += (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0);
          prevClicks += analytics.clicks || 0;
          prevShares += analytics.shares || 0;
        });
      });
    });

    const prevPostCount = previousPosts?.length || 0;
    if (prevPostCount > 0 && prevImpressions > 0) {
      prevEngagementRate = (prevEngagements / prevImpressions) * 100;
    }

    // Calculate rates first
    const avgEngagementRate = totalPosts > 0 && totalImpressions > 0
      ? ((totalEngagements / totalImpressions) * 100).toFixed(1)
      : '0';
    
    const clickThroughRate = totalPosts > 0 && totalImpressions > 0
      ? ((totalClicks / totalImpressions) * 100).toFixed(1)
      : '0';

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): { change: string; trend: 'up' | 'down' } => {
      if (previous === 0) {
        return current > 0 ? { change: '+100%', trend: 'up' } : { change: '0%', trend: 'up' };
      }
      const percentChange = ((current - previous) / previous) * 100;
      const sign = percentChange >= 0 ? '+' : '';
      return {
        change: `${sign}${percentChange.toFixed(1)}%`,
        trend: percentChange >= 0 ? 'up' : 'down',
      };
    };

    const impressionsChange = calculateChange(totalImpressions, prevImpressions);
    const engagementsChange = calculateChange(totalEngagements, prevEngagements);
    const clicksChange = calculateChange(totalClicks, prevClicks);
    const sharesChange = calculateChange(totalShares, prevShares);
    const engagementRateChange = calculateChange(
      parseFloat(avgEngagementRate),
      prevEngagementRate
    );

    // Format metrics for display
    const metrics = [
      {
        id: 1,
        label: 'Total Impressions',
        value: totalImpressions > 0 ? `${(totalImpressions / 1000).toFixed(1)}K` : '0',
        change: impressionsChange.change,
        trend: impressionsChange.trend,
      },
      {
        id: 2,
        label: 'Total Engagements',
        value: totalEngagements > 0 ? `${(totalEngagements / 1000).toFixed(1)}K` : '0',
        change: engagementsChange.change,
        trend: engagementsChange.trend,
      },
      {
        id: 3,
        label: 'Click-through Rate',
        value: `${clickThroughRate}%`,
        change: clicksChange.change,
        trend: clicksChange.trend,
      },
      {
        id: 4,
        label: 'Total Shares',
        value: totalShares > 0 ? `${(totalShares / 1000).toFixed(1)}K` : '0',
        change: sharesChange.change,
        trend: sharesChange.trend,
      },
      {
        id: 5,
        label: 'Avg. Engagement Rate',
        value: `${avgEngagementRate}%`,
        change: engagementRateChange.change,
        trend: engagementRateChange.trend,
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

