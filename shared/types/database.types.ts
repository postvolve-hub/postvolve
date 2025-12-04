// =====================================================
// PostVolve Database Types
// =====================================================
// Auto-generated TypeScript types for Supabase database
// Version: 1.0.0
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// ENUMS
// =====================================================

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused';
export type PlanType = 'starter' | 'plus' | 'pro';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
export type PlatformType = 'linkedin' | 'twitter' | 'facebook' | 'instagram';
export type ConnectionStatus = 'connected' | 'disconnected' | 'expired' | 'error';
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'posted' | 'failed' | 'skipped';
export type GenerationLane = 'auto' | 'url' | 'custom';
export type ContentCategory = 'tech' | 'ai' | 'business' | 'motivation';
export type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'password_changed' 
  | 'profile_updated'
  | 'post_created' 
  | 'post_edited' 
  | 'post_published' 
  | 'post_deleted'
  | 'account_connected' 
  | 'account_disconnected'
  | 'subscription_upgraded' 
  | 'subscription_canceled'
  | 'settings_updated' 
  | 'schedule_created' 
  | 'schedule_updated';

// =====================================================
// TABLE TYPES
// =====================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          account_code: string;
          timezone: string;
          email_verified: boolean;
          two_factor_enabled: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          account_code?: string;
          timezone?: string;
          email_verified?: boolean;
          two_factor_enabled?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          account_code?: string;
          timezone?: string;
          email_verified?: boolean;
          two_factor_enabled?: boolean;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: PlanType;
          status: SubscriptionStatus;
          posts_per_day: number;
          social_accounts_limit: number;
          categories_limit: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          trial_start: string | null;
          trial_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type?: PlanType;
          status?: SubscriptionStatus;
          posts_per_day?: number;
          social_accounts_limit?: number;
          categories_limit?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: PlanType;
          status?: SubscriptionStatus;
          posts_per_day?: number;
          social_accounts_limit?: number;
          categories_limit?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          trial_start?: string | null;
          trial_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          invoice_number: string;
          amount_cents: number;
          currency: string;
          status: InvoiceStatus;
          stripe_invoice_id: string | null;
          stripe_payment_intent_id: string | null;
          hosted_invoice_url: string | null;
          invoice_pdf_url: string | null;
          invoice_date: string;
          due_date: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          invoice_number: string;
          amount_cents: number;
          currency?: string;
          status?: InvoiceStatus;
          stripe_invoice_id?: string | null;
          stripe_payment_intent_id?: string | null;
          hosted_invoice_url?: string | null;
          invoice_pdf_url?: string | null;
          invoice_date: string;
          due_date?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          invoice_number?: string;
          amount_cents?: number;
          currency?: string;
          status?: InvoiceStatus;
          stripe_invoice_id?: string | null;
          stripe_payment_intent_id?: string | null;
          hosted_invoice_url?: string | null;
          invoice_pdf_url?: string | null;
          invoice_date?: string;
          due_date?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          auto_posting_enabled: boolean;
          selected_categories: string[];
          email_notifications: boolean;
          push_notifications: boolean;
          weekly_digest: boolean;
          default_platforms: string[];
          preferred_draft_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          auto_posting_enabled?: boolean;
          selected_categories?: string[];
          email_notifications?: boolean;
          push_notifications?: boolean;
          weekly_digest?: boolean;
          default_platforms?: string[];
          preferred_draft_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          auto_posting_enabled?: boolean;
          selected_categories?: string[];
          email_notifications?: boolean;
          push_notifications?: boolean;
          weekly_digest?: boolean;
          default_platforms?: string[];
          preferred_draft_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      posting_schedules: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          time: string;
          days_of_week: string[];
          platforms: string[];
          categories: string[] | null;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          time: string;
          days_of_week: string[];
          platforms: string[];
          categories?: string[] | null;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          time?: string;
          days_of_week?: string[];
          platforms?: string[];
          categories?: string[] | null;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      connected_accounts: {
        Row: {
          id: string;
          user_id: string;
          platform: PlatformType;
          platform_user_id: string;
          platform_username: string | null;
          platform_display_name: string | null;
          platform_avatar_url: string | null;
          access_token: string;
          refresh_token: string | null;
          token_expires_at: string | null;
          status: ConnectionStatus;
          last_error: string | null;
          connected_at: string;
          last_used_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: PlatformType;
          platform_user_id: string;
          platform_username?: string | null;
          platform_display_name?: string | null;
          platform_avatar_url?: string | null;
          access_token: string;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          status?: ConnectionStatus;
          last_error?: string | null;
          connected_at?: string;
          last_used_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: PlatformType;
          platform_user_id?: string;
          platform_username?: string | null;
          platform_display_name?: string | null;
          platform_avatar_url?: string | null;
          access_token?: string;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          status?: ConnectionStatus;
          last_error?: string | null;
          connected_at?: string;
          last_used_at?: string | null;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          image_url: string | null;
          image_prompt: string | null;
          category: ContentCategory;
          generation_lane: GenerationLane;
          source_url: string | null;
          source_prompt: string | null;
          source_file_url: string | null;
          status: PostStatus;
          scheduled_at: string | null;
          posted_at: string | null;
          last_error: string | null;
          retry_count: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          image_url?: string | null;
          image_prompt?: string | null;
          category: ContentCategory;
          generation_lane: GenerationLane;
          source_url?: string | null;
          source_prompt?: string | null;
          source_file_url?: string | null;
          status?: PostStatus;
          scheduled_at?: string | null;
          posted_at?: string | null;
          last_error?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          image_url?: string | null;
          image_prompt?: string | null;
          category?: ContentCategory;
          generation_lane?: GenerationLane;
          source_url?: string | null;
          source_prompt?: string | null;
          source_file_url?: string | null;
          status?: PostStatus;
          scheduled_at?: string | null;
          posted_at?: string | null;
          last_error?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      post_platforms: {
        Row: {
          id: string;
          post_id: string;
          connected_account_id: string | null;
          platform: PlatformType;
          content: string;
          character_count: number | null;
          hashtags: string[] | null;
          status: PostStatus;
          platform_post_id: string | null;
          posted_at: string | null;
          last_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          connected_account_id?: string | null;
          platform: PlatformType;
          content: string;
          character_count?: number | null;
          hashtags?: string[] | null;
          status?: PostStatus;
          platform_post_id?: string | null;
          posted_at?: string | null;
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          connected_account_id?: string | null;
          platform?: PlatformType;
          content?: string;
          character_count?: number | null;
          hashtags?: string[] | null;
          status?: PostStatus;
          platform_post_id?: string | null;
          posted_at?: string | null;
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_analytics: {
        Row: {
          id: string;
          post_platform_id: string;
          impressions: number;
          engagements: number;
          clicks: number;
          shares: number;
          comments: number;
          likes: number;
          engagement_rate: number | null;
          click_through_rate: number | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          post_platform_id: string;
          impressions?: number;
          engagements?: number;
          clicks?: number;
          shares?: number;
          comments?: number;
          likes?: number;
          engagement_rate?: number | null;
          click_through_rate?: number | null;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          post_platform_id?: string;
          impressions?: number;
          engagements?: number;
          clicks?: number;
          shares?: number;
          comments?: number;
          likes?: number;
          engagement_rate?: number | null;
          click_through_rate?: number | null;
          recorded_at?: string;
        };
      };
      daily_analytics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          total_impressions: number;
          total_engagements: number;
          total_clicks: number;
          total_shares: number;
          posts_drafted: number;
          posts_scheduled: number;
          posts_published: number;
          posts_failed: number;
          ai_generations_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          total_impressions?: number;
          total_engagements?: number;
          total_clicks?: number;
          total_shares?: number;
          posts_drafted?: number;
          posts_scheduled?: number;
          posts_published?: number;
          posts_failed?: number;
          ai_generations_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          total_impressions?: number;
          total_engagements?: number;
          total_clicks?: number;
          total_shares?: number;
          posts_drafted?: number;
          posts_scheduled?: number;
          posts_published?: number;
          posts_failed?: number;
          ai_generations_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          period_end: string;
          posts_generated: number;
          posts_published: number;
          ai_image_generations: number;
          url_extractions: number;
          posts_limit: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_start: string;
          period_end: string;
          posts_generated?: number;
          posts_published?: number;
          ai_image_generations?: number;
          url_extractions?: number;
          posts_limit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          period_start?: string;
          period_end?: string;
          posts_generated?: number;
          posts_published?: number;
          ai_image_generations?: number;
          url_extractions?: number;
          posts_limit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string;
          activity_type: ActivityType;
          description: string | null;
          metadata: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: ActivityType;
          description?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: ActivityType;
          description?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_username_available: {
        Args: {
          username_to_check: string;
        };
        Returns: boolean;
      };
      get_user_limits: {
        Args: {
          user_uuid: string;
        };
        Returns: {
          posts_per_day: number;
          social_accounts_limit: number;
          categories_limit: number;
          plan_type: PlanType;
        }[];
      };
    };
    Enums: {
      subscription_status: SubscriptionStatus;
      plan_type: PlanType;
      invoice_status: InvoiceStatus;
      platform_type: PlatformType;
      connection_status: ConnectionStatus;
      post_status: PostStatus;
      generation_lane: GenerationLane;
      content_category: ContentCategory;
      activity_type: ActivityType;
    };
  };
}

// =====================================================
// HELPER TYPES
// =====================================================

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Individual table types for convenience
export type User = Tables<'users'>;
export type Subscription = Tables<'subscriptions'>;
export type Invoice = Tables<'invoices'>;
export type UserSettings = Tables<'user_settings'>;
export type PostingSchedule = Tables<'posting_schedules'>;
export type ConnectedAccount = Tables<'connected_accounts'>;
export type Post = Tables<'posts'>;
export type PostPlatform = Tables<'post_platforms'>;
export type PostAnalytics = Tables<'post_analytics'>;
export type DailyAnalytics = Tables<'daily_analytics'>;
export type UsageTracking = Tables<'usage_tracking'>;
export type ActivityLog = Tables<'activity_log'>;

// Insert types
export type UserInsert = Inserts<'users'>;
export type SubscriptionInsert = Inserts<'subscriptions'>;
export type PostInsert = Inserts<'posts'>;
export type PostPlatformInsert = Inserts<'post_platforms'>;

// Update types
export type UserUpdate = Updates<'users'>;
export type SubscriptionUpdate = Updates<'subscriptions'>;
export type PostUpdate = Updates<'posts'>;

// =====================================================
// COMBINED TYPES (for joins and complex queries)
// =====================================================

export interface PostWithPlatforms extends Post {
  post_platforms: PostPlatform[];
}

export interface PostWithAnalytics extends Post {
  post_platforms: (PostPlatform & {
    post_analytics: PostAnalytics[];
  })[];
}

export interface UserWithSubscription extends User {
  subscriptions: Subscription | null;
}

export interface UserWithSettings extends User {
  user_settings: UserSettings | null;
}

export interface ScheduleWithUser extends PostingSchedule {
  users: Pick<User, 'id' | 'username' | 'email'>;
}

// =====================================================
// RESPONSE TYPES (for API endpoints)
// =====================================================

export interface UserProfile {
  user: User;
  subscription: Subscription | null;
  settings: UserSettings | null;
  connectedAccounts: ConnectedAccount[];
}

export interface DashboardData {
  user: User;
  subscription: Subscription | null;
  recentPosts: Post[];
  scheduledPosts: Post[];
  analytics: DailyAnalytics | null;
  usage: UsageTracking | null;
}

export interface AnalyticsOverview {
  dailyStats: DailyAnalytics[];
  topPosts: PostWithAnalytics[];
  totalImpressions: number;
  totalEngagements: number;
  averageEngagementRate: number;
}


