"use client";

import { useState } from "react";
import { 
  X, 
  Check, 
  Zap, 
  Building2, 
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PlanId = "starter" | "plus" | "pro";

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 39,
    billing: "/month",
    description: "Perfect for getting started",
    icon: <Sparkles className="h-5 w-5" />,
    features: [
      "1 post per day",
      "2 categories",
      "1 social account",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 99,
    billing: "/month",
    description: "For growing professionals",
    icon: <Zap className="h-5 w-5" />,
    popular: true,
    features: [
      "3 posts per day",
      "All 4 categories",
      "5 social accounts",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    billing: "/month",
    description: "For teams and agencies",
    icon: <Building2 className="h-5 w-5" />,
    features: [
      "Unlimited posts",
      "All 4 + Custom categories",
      "Unlimited accounts",
      "Full analytics suite",
      "Team collaboration",
      "Dedicated support",
    ],
  },
];

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanId;
  onConfirm?: (newPlan: PlanId) => void;
}

export function ChangePlanModal({
  isOpen,
  onClose,
  currentPlan,
  onConfirm,
}: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"select" | "confirm">("select");

  if (!isOpen) return null;

  const currentPlanData = PLANS.find((p) => p.id === currentPlan);
  const selectedPlanData = selectedPlan ? PLANS.find((p) => p.id === selectedPlan) : null;
  const isDowngrade = selectedPlanData && currentPlanData && selectedPlanData.price < currentPlanData.price;
  const isUpgrade = selectedPlanData && currentPlanData && selectedPlanData.price > currentPlanData.price;

  const handlePlanSelect = (planId: PlanId) => {
    if (planId !== currentPlan) {
      setSelectedPlan(planId);
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    
    // Call the onConfirm callback which will handle Stripe checkout
    onConfirm?.(selectedPlan);
    
    // Don't close modal here - let the redirect happen
    // The modal will close when user returns from Stripe
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setStep("select");
    setIsProcessing(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {step === "select" ? "Change Your Plan" : "Confirm Plan Change"}
              </h2>
              <p className="text-sm text-gray-500">
                {step === "select" 
                  ? `You're currently on the ${currentPlanData?.name} plan`
                  : "Review your plan change details"
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Plan Selection */}
            {step === "select" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = plan.id === currentPlan;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={isCurrent}
                      className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isCurrent
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-[#6D28D9]/50 hover:shadow-lg"
                      } ${plan.popular && !isCurrent ? "ring-2 ring-[#6D28D9]/20" : ""}`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#6D28D9] text-white text-[10px]">
                          Most Popular
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge className="absolute -top-2.5 right-4 bg-emerald-500 text-white text-[10px]">
                          Current
                        </Badge>
                      )}
                      
                      <div className={`p-2 rounded-xl w-fit mb-3 ${isCurrent ? "bg-gray-200" : "bg-[#6D28D9]/10"}`}>
                        <div className={isCurrent ? "text-gray-500" : "text-[#6D28D9]"}>
                          {plan.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{plan.description}</p>
                      
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {plan.price === 0 ? "Free" : `$${plan.price}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-sm text-gray-500">{plan.billing}</span>
                        )}
                      </div>
                      
                      <ul className="space-y-2">
                        {plan.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <Check className={`h-3.5 w-3.5 ${isCurrent ? "text-gray-400" : "text-emerald-500"}`} />
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 4 && (
                          <li className="text-xs text-gray-400">
                            +{plan.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Confirmation */}
            {step === "confirm" && selectedPlanData && currentPlanData && (
              <div className="space-y-6">
                {/* Downgrade Warning */}
                {isDowngrade && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Downgrading Plan</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        You'll lose access to premium features at the end of your current billing period.
                        Any unused posts will not carry over.
                      </p>
                    </div>
                  </div>
                )}

                {/* Plan Comparison */}
                <div className="flex items-center justify-center gap-4">
                  {/* Current Plan */}
                  <div className="p-4 bg-gray-50 rounded-xl text-center flex-1 max-w-[200px]">
                    <p className="text-xs text-gray-500 mb-1">Current Plan</p>
                    <h4 className="text-lg font-semibold text-gray-900">{currentPlanData.name}</h4>
                    <p className="text-sm text-gray-600">
                      {currentPlanData.price === 0 ? "Free" : `$${currentPlanData.price}/mo`}
                    </p>
                  </div>

                  <ArrowRight className="h-6 w-6 text-gray-400" />

                  {/* New Plan */}
                  <div className={`p-4 rounded-xl text-center flex-1 max-w-[200px] ${
                    isUpgrade ? "bg-[#6D28D9]/10 border border-[#6D28D9]/20" : "bg-gray-100"
                  }`}>
                    <p className="text-xs text-gray-500 mb-1">New Plan</p>
                    <h4 className={`text-lg font-semibold ${isUpgrade ? "text-[#6D28D9]" : "text-gray-900"}`}>
                      {selectedPlanData.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedPlanData.price === 0 ? "Free" : `$${selectedPlanData.price}/mo`}
                    </p>
                  </div>
                </div>

                {/* Price Difference */}
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  {isUpgrade && (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Your new monthly total</p>
                      <p className="text-3xl font-bold text-gray-900">${selectedPlanData.price}/mo</p>
                      <p className="text-xs text-gray-500 mt-1">
                        +${selectedPlanData.price - currentPlanData.price}/mo from current plan
                      </p>
                    </>
                  )}
                  {isDowngrade && (
                    <>
                      <p className="text-sm text-gray-600 mb-1">Your new monthly total</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {selectedPlanData.price === 0 ? "Free" : `$${selectedPlanData.price}/mo`}
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        -${currentPlanData.price - selectedPlanData.price}/mo savings
                      </p>
                    </>
                  )}
                </div>

                {/* New Features */}
                {isUpgrade && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">What you'll get:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedPlanData.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div>
              {step === "confirm" && (
                <button
                  onClick={() => setStep("select")}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Back to plans
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="rounded-xl">
                Cancel
              </Button>
              {step === "confirm" && (
                <Button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className={`rounded-xl ${
                    isDowngrade 
                      ? "bg-amber-600 hover:bg-amber-700" 
                      : "bg-[#6D28D9] hover:bg-[#5B21B6]"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isDowngrade ? "Confirm Downgrade" : "Confirm Upgrade"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

