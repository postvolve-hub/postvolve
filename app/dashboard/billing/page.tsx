"use client";

import { useState } from "react";
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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChangePlanModal } from "@/components/dashboard/ChangePlanModal";
import { UpdatePaymentModal } from "@/components/dashboard/UpdatePaymentModal";
import { ConfirmationModal } from "@/components/dashboard/ConfirmationModal";
import { toast } from "@/hooks/use-toast";

// Custom Icons
const IconCrown = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M4 16v4h16v-4" />
  </svg>
);

// Mock data
const CURRENT_PLAN = {
  name: "Professional",
  price: 199,
  period: "month",
  features: [
    "3 posts per day",
    "All 4 categories",
    "5 social accounts",
    "Advanced analytics",
    "Priority support"
  ]
};

const USAGE = {
  postsUsed: 45,
  postsLimit: 90,
  accountsUsed: 3,
  accountsLimit: 5,
  categoriesUsed: 4,
  categoriesLimit: 4
};

const BILLING_HISTORY = [
  { id: 1, date: "Dec 4, 2024", amount: 199, status: "paid", invoice: "INV-2024-012" },
  { id: 2, date: "Nov 4, 2024", amount: 199, status: "paid", invoice: "INV-2024-011" },
  { id: 3, date: "Oct 4, 2024", amount: 199, status: "paid", invoice: "INV-2024-010" },
  { id: 4, date: "Sep 4, 2024", amount: 199, status: "paid", invoice: "INV-2024-009" },
];

const PLANS = [
  {
    name: "Starter",
    price: 50,
    description: "For consistent content creators",
    features: ["1 post per day", "2 categories", "1 social account", "Basic analytics"],
    popular: false
  },
  {
    name: "Professional",
    price: 199,
    description: "For scaling influence",
    features: ["3 posts per day", "All 4 categories", "5 social accounts", "Advanced analytics", "Priority support"],
    popular: true
  },
  {
    name: "Enterprise",
    price: null,
    description: "For teams & agencies",
    features: ["Unlimited posts", "Custom categories", "Unlimited accounts", "Team collaboration", "Dedicated manager"],
    popular: false
  }
];

export default function BillingPage() {
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false);
  const [updatePaymentModalOpen, setUpdatePaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const postsPercentage = (USAGE.postsUsed / USAGE.postsLimit) * 100;
  const accountsPercentage = (USAGE.accountsUsed / USAGE.accountsLimit) * 100;

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

        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] rounded-2xl p-6 text-white shadow-xl shadow-primary/20 animate-in slide-in-from-bottom-2 duration-500 delay-75">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IconCrown className="h-5 w-5 text-yellow-300" />
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  Current Plan
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{CURRENT_PLAN.name} Plan</h3>
              <p className="text-white/80 text-sm">
                <span className="text-3xl font-bold text-white">${CURRENT_PLAN.price}</span>
                <span className="text-white/60">/{CURRENT_PLAN.period}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                onClick={() => setChangePlanModalOpen(true)}
              >
                Change Plan
              </Button>
              <Button 
                className="bg-white text-[#6D28D9] hover:bg-white/90 rounded-xl font-medium"
                onClick={() => setUpdatePaymentModalOpen(true)}
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
              <span className="text-white/80">Next billing: <strong className="text-white">Jan 4, 2025</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-white/80">Auto-renewal enabled</span>
            </div>
          </div>
        </div>

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
              <span className="text-2xl font-bold text-gray-900">{USAGE.postsUsed}</span>
              <span className="text-gray-500 text-sm"> / {USAGE.postsLimit}</span>
            </div>
            <Progress value={postsPercentage} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 mt-2">{USAGE.postsLimit - USAGE.postsUsed} posts remaining</p>
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
              <span className="text-2xl font-bold text-gray-900">{USAGE.accountsUsed}</span>
              <span className="text-gray-500 text-sm"> / {USAGE.accountsLimit}</span>
            </div>
            <Progress value={accountsPercentage} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 mt-2">{USAGE.accountsLimit - USAGE.accountsUsed} slots available</p>
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
              <span className="text-2xl font-bold text-gray-900">{USAGE.categoriesUsed}</span>
              <span className="text-gray-500 text-sm"> / {USAGE.categoriesLimit}</span>
            </div>
            <Progress value={100} className="h-2 bg-gray-100" />
            <p className="text-xs text-gray-500 mt-2">All categories unlocked</p>
          </div>
        </div>

        {/* Upgrade Prompt (shown if not on highest plan) */}
        {CURRENT_PLAN.name !== "Enterprise" && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5 animate-in slide-in-from-bottom-2 duration-500 delay-150">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need more power?</h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Upgrade to Enterprise for unlimited posts, team collaboration, and dedicated support.
                  </p>
                </div>
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-sm whitespace-nowrap">
                Explore Enterprise
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
            {BILLING_HISTORY.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.invoice}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">${item.amount}</span>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 capitalize">
                    {item.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
          currentPlan="professional"
          onConfirm={(newPlan) => {
            toast({
              title: "Plan Changed",
              description: `Your subscription has been updated to the ${newPlan} plan.`,
            });
          }}
        />

        {/* Update Payment Modal */}
        <UpdatePaymentModal
          isOpen={updatePaymentModalOpen}
          onClose={() => setUpdatePaymentModalOpen(false)}
          onSuccess={() => {
            toast({
              title: "Payment Method Updated",
              description: "Your new payment method has been saved.",
            });
          }}
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

