/**
 * GET /api/billing/usage
 * Get real usage statistics for the authenticated user
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

    // Get subscription to determine limits
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Calculate posts used (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: postsUsed } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    const postsLimit = subscription?.posts_per_day === -1 
      ? 999 
      : (subscription?.posts_per_day || 1) * 30;

    // Count connected accounts
    const { count: accountsUsed } = await supabaseAdmin
      .from('connected_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'connected');

    const accountsLimit = subscription?.social_accounts_limit === -1
      ? 999
      : (subscription?.social_accounts_limit || 1);

    // Count categories used (from posts)
    const { data: posts } = await supabaseAdmin
      .from('posts')
      .select('category')
      .eq('user_id', userId);

    const uniqueCategories = new Set(
      (posts || []).map((p) => p.category).filter(Boolean)
    );

    const categoriesUsed = uniqueCategories.size;
    const categoriesLimit = subscription?.categories_limit === -1
      ? 999
      : (subscription?.categories_limit || 999);

    return NextResponse.json({
      success: true,
      usage: {
        postsUsed: postsUsed || 0,
        postsLimit,
        accountsUsed: accountsUsed || 0,
        accountsLimit,
        categoriesUsed,
        categoriesLimit,
      },
    });
  } catch (error: any) {
    console.error('[Billing Usage] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: error.message },
      { status: 500 }
    );
  }
}





