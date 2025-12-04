"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Search, 
  Book, 
  MessageSquare, 
  Mail,
  ChevronRight,
  ExternalLink,
  Zap,
  Calendar,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  HelpCircle,
  FileText,
  PlayCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of PostVolve",
    icon: <PlayCircle className="h-5 w-5" />,
    articles: [
      { title: "Quick Start Guide", time: "3 min read" },
      { title: "Understanding Your Dashboard", time: "2 min read" },
      { title: "Connecting Social Accounts", time: "4 min read" },
    ],
  },
  {
    id: "content-generation",
    title: "Content Generation",
    description: "Create AI-powered content",
    icon: <Zap className="h-5 w-5" />,
    articles: [
      { title: "How AI Content Generation Works", time: "5 min read" },
      { title: "Using URL-Based Generation", time: "3 min read" },
      { title: "Custom Prompts & Uploads", time: "4 min read" },
    ],
  },
  {
    id: "scheduling",
    title: "Scheduling & Posting",
    description: "Schedule and automate posts",
    icon: <Calendar className="h-5 w-5" />,
    articles: [
      { title: "Setting Up Auto-Posting", time: "4 min read" },
      { title: "Managing Your Schedule", time: "3 min read" },
      { title: "Best Times to Post", time: "2 min read" },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Insights",
    description: "Track your performance",
    icon: <BarChart3 className="h-5 w-5" />,
    articles: [
      { title: "Understanding Your Metrics", time: "4 min read" },
      { title: "Engagement Analytics", time: "3 min read" },
      { title: "Exporting Reports", time: "2 min read" },
    ],
  },
  {
    id: "account",
    title: "Account & Settings",
    description: "Manage your account",
    icon: <Settings className="h-5 w-5" />,
    articles: [
      { title: "Account Security", time: "3 min read" },
      { title: "Notification Preferences", time: "2 min read" },
      { title: "Managing Connected Apps", time: "3 min read" },
    ],
  },
  {
    id: "billing",
    title: "Billing & Plans",
    description: "Subscription and payments",
    icon: <CreditCard className="h-5 w-5" />,
    articles: [
      { title: "Understanding Your Plan", time: "2 min read" },
      { title: "Upgrading or Downgrading", time: "3 min read" },
      { title: "Payment Methods", time: "2 min read" },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "How does the AI content generation work?",
    answer: "PostVolve uses advanced AI models to generate engaging social media content. You can provide a URL, custom prompt, or upload content, and our AI will create optimized posts for your selected platforms. The AI considers platform-specific requirements like character limits and image dimensions."
  },
  {
    question: "Can I edit the AI-generated content before posting?",
    answer: "Absolutely! All AI-generated content goes to your drafts first. You can review, edit, and customize every post before scheduling or publishing. We encourage you to add your personal touch to make the content authentically yours."
  },
  {
    question: "How do I connect my social media accounts?",
    answer: "Go to Settings > Connected Accounts and click 'Connect' next to the platform you want to add. You'll be redirected to authorize PostVolve through the platform's official OAuth process. Your credentials are never stored - we only keep the access tokens needed to post on your behalf."
  },
  {
    question: "What happens if I exceed my monthly post limit?",
    answer: "If you reach your plan's post limit, you can either wait for the next billing cycle or upgrade to a higher plan for more posts. We'll notify you when you're approaching your limit so you can plan accordingly."
  },
  {
    question: "Can I schedule posts for multiple platforms at once?",
    answer: "Yes! When creating or editing a post, you can select multiple platforms. PostVolve will optimize the content for each platform's requirements and schedule them to post simultaneously or at different times based on your preferences."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from Billing > Manage Subscription. Your access will continue until the end of your current billing period. We don't offer refunds for partial months, but you can downgrade to our free Starter plan instead of canceling completely."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, security is our top priority. We use industry-standard encryption for all data in transit and at rest. We never store your social media passwords, and all OAuth tokens are securely encrypted. You can revoke access anytime from your settings."
  },
  {
    question: "What's the difference between Auto and Manual posting?",
    answer: "Auto-posting publishes your approved content automatically at scheduled times. Manual posting keeps everything in drafts for you to publish when you're ready. You can mix both - some posts auto-published while others wait for manual review."
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = HELP_CATEGORIES.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.articles.some((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFAQs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center animate-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">How can we help?</h1>
          <p className="text-gray-500 mb-6">Search our knowledge base or browse categories below</p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl border-gray-200 focus:border-[#6D28D9] focus:ring-[#6D28D9]/20"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 animate-in slide-in-from-bottom-2 duration-500 delay-75">
          <Button variant="outline" className="rounded-full gap-2">
            <Book className="h-4 w-4" />
            Documentation
            <ExternalLink className="h-3 w-3" />
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <MessageSquare className="h-4 w-4" />
            Live Chat
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <Mail className="h-4 w-4" />
            Email Support
          </Button>
        </div>

        {/* Help Categories */}
        <div className="animate-in slide-in-from-bottom-2 duration-500 delay-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "border-[#6D28D9] bg-[#6D28D9]/5 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    selectedCategory === category.id
                      ? "bg-[#6D28D9]/10 text-[#6D28D9]"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{category.description}</p>
                    <p className="text-xs text-[#6D28D9] font-medium">
                      {category.articles.length} articles
                    </p>
                  </div>
                </div>

                {/* Expanded Articles */}
                {selectedCategory === category.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {category.articles.map((article, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700 group-hover:text-[#6D28D9]">
                            {article.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{article.time}</span>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#6D28D9]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#6D28D9]/10 rounded-xl">
              <HelpCircle className="h-5 w-5 text-[#6D28D9]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500">Quick answers to common questions</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-gray-100 rounded-xl px-4 data-[state=open]:bg-[#6D28D9]/5 data-[state=open]:border-[#6D28D9]/20"
              >
                <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] rounded-2xl p-8 text-center text-white animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Our support team is here to help you with any questions or issues you might have.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="bg-white text-[#6D28D9] hover:bg-white/90 rounded-xl">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
          </div>
          <p className="text-xs text-white/60 mt-4">
            Average response time: &lt;2 hours during business hours
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

