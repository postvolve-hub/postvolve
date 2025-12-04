"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/Motion";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const Pricing = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handlePlanSelect = async (planId: "starter" | "plus" | "pro") => {
    // If not logged in, store selected plan and go to signup
    if (!user) {
      // Store selected plan in localStorage and pass in URL
      localStorage.setItem("postvolve_selected_plan", planId);
      router.push(`/signup?plan=${planId}`);
      return;
    }

    // If logged in, initiate checkout
    setProcessingPlan(planId);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: planId,
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
        description: error.message || "Failed to initiate checkout",
        variant: "destructive",
      });
      setProcessingPlan(null);
    }
  };
  return (
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden bg-background">
      {/* Smooth Wavy Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.08) 0%, rgba(236, 233, 250, 0.5) 25%, rgba(250, 245, 255, 0.7) 50%, rgba(236, 233, 250, 0.5) 75%, rgba(147, 51, 234, 0.08) 100%)'
          }}
        />
        {/* Wavy Pattern Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 800"
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(109, 40, 217, 0.15)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.08)" />
              <stop offset="100%" stopColor="rgba(109, 40, 217, 0.15)" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient1)"
            d="M0,200 Q300,100 600,200 T1200,200 L1200,0 L0,0 Z"
          />
          <path
            fill="url(#waveGradient1)"
            opacity="0.6"
            d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z"
          />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <FadeIn>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
              Find the Right Plan for You
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Take as long as you need. No trial, no fees, no risk. Upgrade on your own time and create top-notch content with ease.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Tier 1 */}
          <StaggerItem className="h-full">
            <Card className="border-border/60 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30 bg-background h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-muted-foreground">Starter Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">$39</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2 font-medium text-foreground">Consistent Authority</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Daily Auto-Posts</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> 2 Categories</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Basic Analytics</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> 1 Social Account</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" /> Email Support</li>
                </ul>
              </CardContent>
              <CardFooter>
                {authLoading ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary/5 transition-colors"
                    onClick={() => handlePlanSelect("starter")}
                    disabled={processingPlan === "starter"}
                  >
                    {processingPlan === "starter" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : user ? (
                      "Subscribe to Starter"
                    ) : (
                      "Start Free Trial"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </StaggerItem>

          {/* Tier 2 - Highlighted */}
          <StaggerItem className="h-full">
            <Card className="relative border-primary shadow-2xl shadow-primary/10 z-10 bg-background transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col">
               <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-gradient-to-r from-primary to-blue-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-medium text-primary">Plus Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight">$99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2 font-medium text-foreground">Scaling Influence</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4 text-sm text-foreground">
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Multiple Schedules</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> All 4 Categories</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Post Customization</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> 5 Social Accounts</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Advanced Analytics</li>
                  <li className="flex items-center"><div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2"><Check className="h-3 w-3 text-primary" /></div> Priority Support</li>
                </ul>
              </CardContent>
              <CardFooter>
                {authLoading ? (
                  <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 transition-all duration-300 hover:shadow-primary/40" disabled>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 transition-all duration-300 hover:shadow-primary/40"
                    onClick={() => handlePlanSelect("plus")}
                    disabled={processingPlan === "plus"}
                  >
                    {processingPlan === "plus" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : user ? (
                      "Upgrade to Plus"
                    ) : (
                      "Choose Plus"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </StaggerItem>

          {/* Tier 3 */}
          <StaggerItem className="h-full">
            <Card className="border-border/60 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30 bg-background h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-muted-foreground">Pro Plan</CardTitle>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">$299</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2 font-medium text-foreground">Full Automation & Collaboration</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> All Plus Features</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Unlimited Accounts</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Future Team Collaboration</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Brand Voice Tuning</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Custom Integrations</li>
                  <li className="flex items-center"><Check className="h-4 w-4 text-blue-500 mr-2" /> Dedicated Account Manager</li>
                </ul>
              </CardContent>
              <CardFooter>
                {authLoading ? (
                  <Button variant="outline" className="w-full" disabled>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary/5 transition-colors"
                    onClick={() => handlePlanSelect("pro")}
                    disabled={processingPlan === "pro"}
                  >
                    {processingPlan === "pro" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : user ? (
                      "Upgrade to Pro"
                    ) : (
                      "Get Pro"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </StaggerItem>

        </StaggerContainer>

        {/* Trust Badges */}
        <FadeIn delay={0.4}>
          <div className="mt-16 pt-8 border-t border-border/40 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>No hidden fees</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const CompareAllPlans = () => {
  const { user } = useAuth();
  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Daily Auto-Posts", starter: "1 per day", plus: "3 per day", pro: "Unlimited" },
        { name: "Content Categories", starter: "2", plus: "All 4", pro: "All 4 + Custom" },
        { name: "Social Accounts", starter: "1", plus: "5", pro: "Unlimited" },
        { name: "Post Scheduling", starter: true, plus: true, pro: true },
        { name: "Content Customization", starter: false, plus: true, pro: true },
      ]
    },
    {
      category: "Analytics & Insights",
      items: [
        { name: "Basic Analytics", starter: true, plus: true, pro: true },
        { name: "Advanced Analytics", starter: false, plus: true, pro: true },
        { name: "Performance Reports", starter: false, plus: true, pro: true },
        { name: "Competitor Analysis", starter: false, plus: false, pro: true },
        { name: "Custom Dashboards", starter: false, plus: false, pro: true },
      ]
    },
    {
      category: "Support & Priority",
      items: [
        { name: "Email Support", starter: true, plus: true, pro: true },
        { name: "Priority Support", starter: false, plus: true, pro: true },
        { name: "Dedicated Account Manager", starter: false, plus: false, pro: true },
        { name: "Onboarding Call", starter: false, plus: false, pro: true },
        { name: "24/7 Phone Support", starter: false, plus: false, pro: true },
      ]
    },
    {
      category: "Advanced Features",
      items: [
        { name: "Multiple Schedules", starter: false, plus: true, pro: true },
        { name: "Brand Voice Tuning", starter: false, plus: false, pro: true },
        { name: "Team Collaboration", starter: false, plus: false, pro: true },
        { name: "Custom Integrations", starter: false, plus: false, pro: true },
        { name: "API Access", starter: false, plus: false, pro: true },
      ]
    },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <span className="text-muted-foreground text-2xl">−</span>
      );
    }
    return <span className="text-sm font-medium text-foreground">{value}</span>;
  };

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Detailed Comparison
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Compare All Plans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Find the perfect plan with all the features you need to scale your content automation.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl border border-border/40 bg-background shadow-xl">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/30">
                    <th className="text-left py-6 px-6 font-semibold text-foreground">Features</th>
                    <th className="text-center py-6 px-6 font-semibold text-muted-foreground">Starter</th>
                    <th className="text-center py-6 px-6 font-semibold text-primary bg-primary/5">Plus</th>
                    <th className="text-center py-6 px-6 font-semibold text-muted-foreground">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((section, sectionIdx) => (
                    <React.Fragment key={sectionIdx}>
                      <tr className="bg-secondary/20">
                        <td colSpan={4} className="py-4 px-6 font-bold text-sm uppercase tracking-wide text-primary">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((item, itemIdx) => (
                        <tr key={itemIdx} className="border-b border-border/20 hover:bg-secondary/10 transition-colors">
                          <td className="py-4 px-6 text-sm text-foreground">{item.name}</td>
                          <td className="py-4 px-6 text-center">{renderCell(item.starter)}</td>
                          <td className="py-4 px-6 text-center bg-primary/5">{renderCell(item.plus)}</td>
                          <td className="py-4 px-6 text-center">{renderCell(item.pro)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden">
              {features.map((section, sectionIdx) => (
                <div key={sectionIdx} className="border-b border-border/40">
                  <div className="py-4 px-4 font-bold text-sm uppercase tracking-wide text-primary bg-secondary/20">
                    {section.category}
                  </div>
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="border-b border-border/20 last:border-b-0">
                      <div className="py-3 px-4 font-medium text-sm text-foreground">{item.name}</div>
                      <div className="grid grid-cols-3 gap-2 px-4 pb-3">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Starter</div>
                          <div className="flex justify-center">{renderCell(item.starter)}</div>
                        </div>
                        <div className="text-center bg-primary/5 rounded-lg py-2">
                          <div className="text-xs text-primary font-semibold mb-1">Plus</div>
                          <div className="flex justify-center">{renderCell(item.plus)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Pro</div>
                          <div className="flex justify-center">{renderCell(item.pro)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* CTA Below Table */}
        <FadeIn delay={0.3}>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">Still have questions about which plan is right for you?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button variant="outline" className="h-11 px-8">
                  Contact Sales
                </Button>
              </Link>
              {user ? (
                <Link href="/dashboard/billing">
                  <Button className="h-11 px-8 bg-primary hover:bg-primary/90">
                    Manage Subscription
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="h-11 px-8 bg-primary hover:bg-primary/90">
                    Start Free Trial
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How does the news card generation work?",
      answer:
        "PostVolve uses AI to pull the latest news and trends from your selected categories (Tech, AI, Business, Motivation, or a Custom content voice), then automatically generates visually compelling news cards with engaging captions. The entire process takes under 6 seconds, and you can review and customize before posting.",
    },
    {
      question: "Can I customize the generated news cards?",
      answer: "Absolutely! Every generated news card can be reviewed and edited. You can modify the caption, adjust the visual design, change the posting schedule, or regenerate if it doesn't match your style. Full control while maintaining automation."
    },
    {
      question: "Which social media platforms are supported?",
      answer: "Currently, PostVolve supports LinkedIn and Twitter/X, with more platforms coming soon. You can connect multiple accounts and schedule posts across all of them simultaneously."
    },
    {
      question: "What happens during the free trial?",
      answer: "The 7-day free trial gives you full access to all features. You can generate unlimited news cards, connect your social accounts, schedule posts, and access analytics. No credit card required, and you can cancel anytime."
    },
    {
      question: "How does the auto-posting scheduler work?",
      answer: "Once enabled, PostVolve automatically generates fresh news cards daily and posts them at your preferred time. You can set different schedules for different categories, pause anytime, or review posts before they go live. You're always in control."
    },
    {
      question: "Is there a limit on how many posts I can generate?",
      answer: "Post generation limits depend on your plan. Starter plans include daily auto-posts, while Professional and Enterprise plans offer multiple posts per day and custom generation limits. Check our pricing details above for specific information."
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits to ensure you only pay for what you use."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with PostVolve for any reason within the first 30 days, contact our support team for a full refund."
    }
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <FadeIn>
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Frequently Asked
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Got questions? We've got answers. Here's everything you need to know about PostVolve.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.2}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/40 rounded-lg px-6 bg-background hover:bg-secondary/20 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const { user } = useAuth();
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-blue-600 text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Build Your <span className="whitespace-nowrap inline-block"><span className="text-white font-extrabold">Automated</span> <span className="text-white/70 font-bold">Authority</span></span>?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Join hundreds of thought leaders who've transformed their social media presence with viral news cards. Start your free 7-day trial today.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {user ? (
                <Link href="/dashboard/billing">
                  <Button 
                    className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-black/30"
                  >
                    Manage Subscription
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button 
                    className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-black/30"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  className="h-12 px-8 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold transition-all duration-300"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-white" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <Pricing />
        <CompareAllPlans />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

