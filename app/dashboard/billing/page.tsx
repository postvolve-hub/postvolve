"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  CreditCard, 
  Check, 
  Download, 
  ArrowUpRight,
  Calendar,
  Zap,
  Users,
  BarChart3,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChangePlanModal } from "@/components/dashboard/ChangePlanModal";
import { UpdatePaymentModal } from "@/components/dashboard/UpdatePaymentModal";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";

// Custom Icons
const IconCrown = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M4 16v4h16v-4" />
  </svg>
);

const PLAN_NAMES: Record<string, string> = {
  starter: "Starter",
  plus: "Plus",
  pro: "Pro",
};

const PLAN_PRICES: Record<string, number> = {
  starter: 39,
  plus: 99,
  pro: 299,
};

const PLANS = [
  {
    name: "Starter",
    price: 39,
    description: "For consistent content creators",
    features: ["1 post per day", "All 4 categories", "1 social account", "Basic analytics"],
    popular: false
  },
  {
    name: "Plus",
    price: 99,
    description: "For scaling influence",
    features: ["3 posts per day", "All 4 categories", "5 social accounts", "Advanced analytics", "Priority support"],
    popular: true
  },
  {
    name: "Pro",
    price: 299,
    description: "For teams & agencies",
    features: ["Unlimited posts", "Custom categories", "Unlimited accounts", "Team collaboration", "Dedicated manager"],
    popular: false
  }
];

function BillingPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false);
  const [updatePaymentModalOpen, setUpdatePaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  // Check for success/cancel from Stripe
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    
    if (success) {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been successfully updated.",
      });
      router.replace("/dashboard/billing");
    }
    if (canceled) {
      toast({
        title: "Checkout Canceled",
        description: "Your subscription was not changed.",
        variant: "destructive",
      });
      router.replace("/dashboard/billing");
    }
  }, [searchParams, router]);

  // Fetch subscription data
  useEffect(() => {
    async function loadBillingData() {
      if (!user) return;

      try {
        // Fetch subscription
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (subError && subError.code !== "PGRST116") {
          console.error("Error fetching subscription:", subError);
        }

        if (subData) {
          setSubscription(subData);
        }

        // Fetch usage (mock for now - will be calculated from posts table later)
        setUsage({
          postsUsed: 45,
          postsLimit: subData?.posts_per_day === -1 ? 999 : (subData?.posts_per_day || 1) * 30,
          accountsUsed: 3,
          accountsLimit: subData?.social_accounts_limit === -1 ? 999 : (subData?.social_accounts_limit || 1),
          categoriesUsed: 4,
          categoriesLimit: subData?.categories_limit === -1 ? 999 : (subData?.categories_limit || 999), // Default to unlimited if not set
        });

        // Fetch invoices
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!invoiceError && invoiceData) {
          setInvoices(invoiceData);
        }
      } catch (error) {
        console.error("Error loading billing data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBillingData();
  }, [user]);

  const handleChangePlan = async (newPlan: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to change your plan",
        variant: "destructive",
      });
      return;
    }

    // Check if user is already on this plan (only if they have a real Stripe subscription)
    if (subscription?.plan_type === newPlan && subscription?.stripe_subscription_id) {
      toast({
        title: "Already on this plan",
        description: `You are already subscribed to the ${PLAN_NAMES[newPlan] || newPlan} plan`,
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: newPlan,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate plan change",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const handleManagePayment = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open payment portal",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D28D9]" />
        </div>
      </DashboardLayout>
    );
  }

  const currentPlan = subscription?.plan_type || "starter";
  const planName = PLAN_NAMES[currentPlan] || "Starter";
  const planPrice = PLAN_PRICES[currentPlan] || 39;
  
  // Calculate next billing date based on subscription status
  let nextBillingDate = "N/A";
  let nextBillingLabel = "Next billing";
  
  if (subscription) {
    if (subscription.status === "trialing" && subscription.trial_end) {
      // For trialing subscriptions, show when trial ends
      nextBillingDate = new Date(subscription.trial_end).toLocaleDateString();
      nextBillingLabel = "Trial ends";
    } else if (subscription.status === "active" && subscription.current_period_end) {
      // For active subscriptions, show next billing date
      nextBillingDate = new Date(subscription.current_period_end).toLocaleDateString();
      nextBillingLabel = "Next billing";
    } else if (subscription.current_period_end) {
      // Fallback to current_period_end if available
      nextBillingDate = new Date(subscription.current_period_end).toLocaleDateString();
      nextBillingLabel = "Next billing";
    }
  }

  // Check if subscription is incomplete (placeholder - no Stripe subscription ID)
  const isIncompleteSubscription = subscription && !subscription.stripe_subscription_id;

  const postsPercentage = usage
    ? (usage.postsUsed / usage.postsLimit) * 100
    : 0;
  const accountsPercentage = usage
    ? (usage.accountsUsed / usage.accountsLimit) * 100
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Billing & Subscription</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your plan and payment details.</p>
          </div>
        </div>

        {/* Current Plan Card or Incomplete Subscription Card */}
        {isIncompleteSubscription ? (
          // Incomplete Subscription Card (Placeholder - checkout not completed)
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/20 animate-in slide-in-from-bottom-2 duration-500 delay-75">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Subscription Pending</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{planName} Plan</h3>
                <p className="text-white/90 text-sm mb-2">
                  Your subscription is pending. Complete checkout to activate your plan and access all features.
                </p>
                <p className="text-white/80 text-sm">
                  <span className="text-2xl font-bold text-white">${planPrice}</span>
                  <span className="text-white/60">/month</span>
                  {currentPlan !== "starter" && (
                    <span className="text-white/60 ml-2">(billed immediately)</span>
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/20">
                <Button 
                  className="flex-1 bg-white text-amber-600 hover:bg-white/90 rounded-xl font-medium h-11"
                  onClick={async () => {
                    if (!user) return;
                    setProcessing(true);
                    try {
                      const response = await fetch("/api/stripe/create-checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          planId: currentPlan,
                          userId: user.id,
                        }),
                      });
                      const data = await response.json();
                      if (response.ok && data.url) {
                        window.location.href = data.url;
                      } else {
                        throw new Error(data.error || "Failed to create checkout session");
                      }
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error.message || "Failed to initiate checkout",
                        variant: "destructive",
                      });
                      setProcessing(false);
                    }
                  }}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Complete Checkout
                    </>
                  )}
                </Button>
                
                {currentPlan !== "starter" && (
                  <Button 
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl font-medium h-11"
                    onClick={async () => {
                      if (!user) return;
                      setProcessing(true);
                      try {
                        const response = await fetch("/api/stripe/create-checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            planId: "starter",
                            userId: user.id,
                          }),
                        });
                        const data = await response.json();
                        if (response.ok && data.url) {
                          window.location.href = data.url;
                        } else {
                          throw new Error(data.error || "Failed to create checkout session");
                        }
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to initiate checkout",
                          variant: "destructive",
                        });
                        setProcessing(false);
                      }
                    }}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Switch to Starter (7-day trial)
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Active Subscription Card
          <div className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] rounded-2xl p-6 text-white shadow-xl shadow-primary/20 animate-in slide-in-from-bottom-2 duration-500 delay-75">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">Current Plan</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{planName} Plan</h3>
                <p className="text-white/80 text-sm">
                  <span className="text-3xl font-bold text-white">${planPrice}</span>
                  <span className="text-white/60">/month</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                  onClick={() => setChangePlanModalOpen(true)}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Change Plan"
                  )}
                </Button>
                <Button 
                  className="bg-white text-[#6D28D9] hover:bg-white/90 rounded-xl font-medium"
                  onClick={handleManagePayment}
                  disabled={processing || !subscription?.stripe_customer_id}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Payment
                </Button>
              </div>
            </div>

            {/* Next billing info */}
            <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/60" />
                <span className="text-white/80">
                  {nextBillingLabel}: <strong className="text-white">{nextBillingDate}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-white/80">Auto-renewal enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-100">
          {/* Posts Usage */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-xl">
                  <Zap className="h-4 w-4 text-[#6D28D9]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Posts This Month</span>
              </div>
              <span className="text-xs text-gray-500">{Math.round(postsPercentage)}%</span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{usage?.postsUsed || 0}</span>
              <span className="text-gray-500 text-sm"> / {usage?.postsLimit === 999 ? "∞" : usage?.postsLimit || 0}</span>
            </div>
            <Progress value={postsPercentage} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 mt-2">
              {usage?.postsLimit === 999 ? "Unlimited" : `${(usage?.postsLimit || 0) - (usage?.postsUsed || 0)} posts remaining`}
            </p>
          </div>

          {/* Social Accounts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Social Accounts</span>
              </div>
              <span className="text-xs text-gray-500">{Math.round(accountsPercentage)}%</span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{usage?.accountsUsed || 0}</span>
              <span className="text-gray-500 text-sm"> / {usage?.accountsLimit === 999 ? "∞" : usage?.accountsLimit || 0}</span>
            </div>
            <Progress value={accountsPercentage} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 mt-2">
              {usage?.accountsLimit === 999 ? "Unlimited" : `${(usage?.accountsLimit || 0) - (usage?.accountsUsed || 0)} slots available`}
            </p>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Categories Active</span>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs">
                Max
              </Badge>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-gray-900">{usage?.categoriesUsed || 0}</span>
              <span className="text-gray-500 text-sm"> / {usage?.categoriesLimit === 999 ? "∞" : usage?.categoriesLimit || 0}</span>
            </div>
            <Progress value={usage && usage.categoriesLimit !== 999 ? (usage.categoriesUsed / usage.categoriesLimit) * 100 : 0} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 mt-2">
              {usage?.categoriesLimit === 999 ? "Unlimited" : usage?.categoriesUsed === usage?.categoriesLimit ? "All categories unlocked" : `${(usage?.categoriesLimit || 0) - (usage?.categoriesUsed || 0)} available`}
            </p>
          </div>
        </div>

        {/* Upgrade Prompt (shown if not on highest plan) */}
        {currentPlan !== "pro" && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5 animate-in slide-in-from-bottom-2 duration-500 delay-150">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need more power?</h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Upgrade to Pro for unlimited posts, team collaboration, and dedicated support.
                  </p>
                </div>
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm whitespace-nowrap">
                Explore Pro
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Payment Method</h3>
            <Button variant="ghost" size="sm" className="text-[#6D28D9] hover:bg-[#6D28D9]/5 rounded-xl h-8 text-xs">
              Update
            </Button>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2026</p>
              </div>
              <Badge variant="outline" className="ml-auto text-xs text-green-600 border-green-200 bg-green-50">
                Default
              </Badge>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-300">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Billing History</h3>
            <Button variant="ghost" size="sm" className="text-[#6D28D9] hover:bg-[#6D28D9]/5 rounded-xl h-8 text-xs">
              View All
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div key={invoice.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.stripe_invoice_id || `INV-${invoice.id}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ${invoice.amount} {invoice.currency?.toUpperCase()}
                    </span>
                    <Badge variant="outline" className={`text-xs capitalize ${
                      invoice.status === "paid" 
                        ? "text-green-600 border-green-200 bg-green-50"
                        : "text-gray-600 border-gray-200 bg-gray-50"
                    }`}>
                      {invoice.status}
                    </Badge>
                    {invoice.invoice_url && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                        onClick={() => window.open(invoice.invoice_url, "_blank")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-500">
                No billing history yet
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500 delay-400">
          <div className="px-5 py-4 border-b border-red-100 bg-red-50/50">
            <h3 className="text-sm font-semibold text-red-700">Cancel Subscription</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-600 mb-4">
              If you cancel your subscription, you'll lose access to premium features at the end of your billing period. 
              Your data will be retained for 30 days.
            </p>
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              onClick={() => setCancelModalOpen(true)}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>

        {/* Change Plan Modal */}
        <ChangePlanModal
          isOpen={changePlanModalOpen}
          onClose={() => setChangePlanModalOpen(false)}
          currentPlan={currentPlan as any}
          onConfirm={handleChangePlan}
        />

        {/* Update Payment Modal - Redirects to Stripe Portal */}
        <UpdatePaymentModal
          isOpen={updatePaymentModalOpen}
          onClose={() => setUpdatePaymentModalOpen(false)}
          onSuccess={handleManagePayment}
        />

        {/* Cancel Subscription Modal */}
        <ConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={() => {
            toast({
              title: "Subscription Cancelled",
              description: "Your subscription will end at the end of the current billing period.",
            });
            setCancelModalOpen(false);
          }}
          title="Cancel Subscription"
          description="Are you sure you want to cancel your subscription? You'll lose access to all premium features at the end of your current billing period."
          confirmText="Yes, Cancel Subscription"
          cancelText="Keep Subscription"
          variant="danger"
        />
      </div>
    </DashboardLayout>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D28D9]" />
        </div>
      </DashboardLayout>
    }>
      <BillingPageContent />
    </Suspense>
  );
}


