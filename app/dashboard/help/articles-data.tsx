import Link from "next/link";
import React from "react";

export interface Article {
  title: string;
  category: string;
  description: string;
  content: React.ReactNode;
  relatedArticles?: string[];
  metaKeywords?: string[];
}

export const ARTICLES: Record<string, Article> = {
  "quick-start-guide": {
    title: "Quick Start Guide: Get Started with PostVolve in 5 Minutes",
    category: "Getting Started",
    description: "Learn how to set up your PostVolve account, connect social media accounts, and generate your first AI-powered news card in under 5 minutes.",
    metaKeywords: ["postvolve quick start", "how to use postvolve", "postvolve tutorial", "ai content generation", "social media automation"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Welcome to PostVolve! This comprehensive guide will walk you through everything you need to know to start creating viral news cards and automating your social media presence. Whether you're a content creator, marketer, or business owner, PostVolve makes it easy to generate engaging content that drives real engagement.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Complete Your Onboarding</h2>
        <p className="text-gray-700 mb-4">
          When you first sign up for PostVolve, you'll go through a quick onboarding process that helps us personalize your experience:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Choose Your Username:</strong> Pick a unique username that will be your identifier on PostVolve</li>
          <li><strong>Select Platforms:</strong> Choose which social media platforms you want to post to (LinkedIn, X/Twitter, Facebook, Instagram)</li>
          <li><strong>Define Your Content Voice:</strong> Select the categories that align with your brand (Tech, AI, Business, Motivation, or Custom). All plans include access to all 4 standard categories.</li>
          <li><strong>Set Your Schedule:</strong> Choose when you want fresh drafts delivered and whether to enable auto-posting</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Connect Your Social Media Accounts</h2>
        <p className="text-gray-700 mb-4">
          Before you can start posting, you need to connect your social media accounts. This is a secure OAuth process that doesn't require sharing your passwords:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Navigate to <strong>Settings → Connected Accounts</strong></li>
          <li>Click <strong>"Connect"</strong> next to the platform you want to add</li>
          <li>You'll be redirected to the platform's official authorization page</li>
          <li>Grant PostVolve permission to post on your behalf</li>
          <li>You'll be redirected back to PostVolve with your account connected</li>
        </ol>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Security Note:</strong> PostVolve never stores your passwords. We only keep secure OAuth tokens that you can revoke at any time from your settings or directly from the social platform.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 3: Generate Your First Content</h2>
        <p className="text-gray-700 mb-4">
          PostVolve offers three powerful ways to generate content:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Lane 1: Auto-Generation from Categories</h3>
        <p className="text-gray-700 mb-4">
          The simplest way to get started. PostVolve automatically generates content based on your selected categories and current trends. Perfect for maintaining a consistent posting schedule without manual input.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Lane 2: URL-Based Generation</h3>
        <p className="text-gray-700 mb-4">
          Found an interesting article or blog post? Paste the URL and PostVolve will:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Extract the key content from the URL</li>
          <li>Summarize it into engaging social media copy</li>
          <li>Generate a visually compelling news card</li>
          <li>Optimize it for your selected platforms</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Lane 3: Custom Prompts</h3>
        <p className="text-gray-700 mb-4">
          Have a specific idea? Write a custom prompt and optionally upload an image. PostVolve's AI will create content tailored to your exact requirements.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 4: Review and Customize</h2>
        <p className="text-gray-700 mb-4">
          All generated content goes to your <strong>Drafts</strong> first. This gives you complete control:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Review the AI-generated caption and make edits</li>
          <li>Regenerate the image if needed</li>
          <li>Select which platforms to post to</li>
          <li>Adjust character counts for each platform</li>
          <li>Preview how it will look on each platform</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 5: Schedule or Publish</h2>
        <p className="text-gray-700 mb-4">
          Once you're happy with your content, you can:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Schedule for Later:</strong> Pick a specific date and time</li>
          <li><strong>Publish Now:</strong> Post immediately to your selected platforms</li>
          <li><strong>Save as Draft:</strong> Keep it for later editing</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pro Tips for Success</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Start with Auto-Generation:</strong> Let PostVolve handle the heavy lifting while you focus on customization</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Review Before Posting:</strong> Always check drafts to ensure they match your brand voice</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Use Multiple Categories:</strong> Diversify your content to reach broader audiences</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Enable Auto-Posting Gradually:</strong> Start with manual review, then enable auto-posting once you're comfortable</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Questions</h2>
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-[#6D28D9] pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">How long does it take to generate content?</h3>
            <p className="text-gray-700">PostVolve generates complete news cards (text + image) in under 6 seconds on average.</p>
          </div>
          <div className="border-l-4 border-[#6D28D9] pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Can I edit AI-generated content?</h3>
            <p className="text-gray-700">Absolutely! All content is fully editable. You can modify captions, regenerate images, and customize everything before posting.</p>
          </div>
          <div className="border-l-4 border-[#6D28D9] pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">What if I don't like the generated content?</h3>
            <p className="text-gray-700">You can regenerate content as many times as you want, or skip it and move to the next draft. You're always in control.</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Steps</h3>
          <p className="text-gray-700 mb-4">
            Now that you've created your first post, explore these resources to get the most out of PostVolve:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/understanding-your-dashboard" className="text-[#6D28D9] hover:underline">Understanding Your Dashboard</Link></li>
            <li>• <Link href="/dashboard/help/how-ai-content-generation-works" className="text-[#6D28D9] hover:underline">How AI Content Generation Works</Link></li>
            <li>• <Link href="/dashboard/help/setting-up-auto-posting" className="text-[#6D28D9] hover:underline">Setting Up Auto-Posting</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["understanding-your-dashboard", "connecting-social-accounts", "how-ai-content-generation-works"]
  },

  "understanding-your-dashboard": {
    title: "Understanding Your PostVolve Dashboard: A Complete Guide",
    category: "Getting Started",
    description: "Master your PostVolve dashboard with this comprehensive guide. Learn about all sections, features, and how to navigate efficiently.",
    metaKeywords: ["postvolve dashboard", "dashboard guide", "postvolve features", "content management", "social media dashboard"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Your PostVolve dashboard is your command center for creating, managing, and analyzing your social media content. This guide will help you understand every section and feature, so you can maximize your productivity and results.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dashboard Overview</h2>
        <p className="text-gray-700 mb-4">
          The main dashboard provides a high-level view of your content pipeline and recent activity. Here's what you'll see:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Category Cards</h3>
        <p className="text-gray-700 mb-4">
          At the top of your dashboard, you'll see cards for each content category you've selected (Tech, AI, Business, Motivation, or Custom). Each card shows:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>The number of active drafts in that category</li>
          <li>Quick access to generate new content for that category</li>
          <li>Visual indicators for your content pipeline status</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Drafts Section</h3>
        <p className="text-gray-700 mb-4">
          Your drafts are organized by status and category. Each draft card displays:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Content Preview:</strong> See the caption and image thumbnail</li>
          <li><strong>Lane Indicator:</strong> Shows which generation method was used (Auto, URL, or Custom)</li>
          <li><strong>Platform Badges:</strong> Visual indicators for selected platforms</li>
          <li><strong>Quick Actions:</strong> Edit, Schedule, Publish, or Delete</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Active Projects</h3>
        <p className="text-gray-700 mb-4">
          Track your scheduled and published content in one place. This section helps you:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Monitor upcoming scheduled posts</li>
          <li>View recently published content</li>
          <li>Quickly access posts that need attention</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Navigation Sidebar</h2>
        <p className="text-gray-700 mb-4">
          The left sidebar provides quick access to all major sections:
        </p>

        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Dashboard</h4>
            <p className="text-gray-700 text-sm">Your main hub for viewing drafts and active projects</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Content Generation</h4>
            <p className="text-gray-700 text-sm">Create new content using all three generation lanes</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Scheduler</h4>
            <p className="text-gray-700 text-sm">Calendar view and schedule management for your posts</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Analytics</h4>
            <p className="text-gray-700 text-sm">Track performance metrics and engagement data</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Billing</h4>
            <p className="text-gray-700 text-sm">Manage your subscription and payment methods</p>
          </div>
          <div className="border-l-4 border-gray-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Account</h4>
            <p className="text-gray-700 text-sm">Profile settings, timezone, and security</p>
          </div>
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">Settings</h4>
            <p className="text-gray-700 text-sm">Connected accounts, posting schedules, and preferences</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Top Header Features</h2>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Search Bar</h3>
        <p className="text-gray-700 mb-4">
          The global search allows you to quickly find:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Specific drafts or posts</li>
          <li>Quick navigation to any dashboard section</li>
          <li>Recent activity and history</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Notifications</h3>
        <p className="text-gray-700 mb-4">
          Stay updated with real-time notifications for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>New drafts ready for review</li>
          <li>Post publishing confirmations</li>
          <li>Account connection status</li>
          <li>System updates and announcements</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">User Profile</h3>
        <p className="text-gray-700 mb-4">
          Click your profile avatar to quickly access your account settings or log out.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Keyboard Shortcuts</h2>
        <p className="text-gray-700 mb-4">
          Speed up your workflow with these keyboard shortcuts:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">⌘/Ctrl + K</kbd>
              <span className="ml-2 text-sm text-gray-700">Open search</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">G + D</kbd>
              <span className="ml-2 text-sm text-gray-700">Go to Dashboard</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">G + G</kbd>
              <span className="ml-2 text-sm text-gray-700">Go to Generate</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">G + S</kbd>
              <span className="ml-2 text-sm text-gray-700">Go to Scheduler</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Review Drafts Daily:</strong> Check your drafts section regularly to maintain a steady content flow</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Use Categories Strategically:</strong> Organize content by category to maintain brand consistency</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Monitor Active Projects:</strong> Keep track of scheduled posts to avoid conflicts or gaps</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Leverage Search:</strong> Use the search function to quickly find specific content or navigate sections</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/quick-start-guide" className="text-[#6D28D9] hover:underline">Quick Start Guide</Link></li>
            <li>• <Link href="/dashboard/help/how-ai-content-generation-works" className="text-[#6D28D9] hover:underline">How AI Content Generation Works</Link></li>
            <li>• <Link href="/dashboard/help/understanding-your-metrics" className="text-[#6D28D9] hover:underline">Understanding Your Metrics</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["quick-start-guide", "how-ai-content-generation-works", "understanding-your-metrics"]
  },

  "connecting-social-accounts": {
    title: "How to Connect Your Social Media Accounts to PostVolve",
    category: "Getting Started",
    description: "Step-by-step guide to securely connect LinkedIn, Twitter/X, Facebook, and Instagram to PostVolve using OAuth authentication.",
    metaKeywords: ["connect social media", "oauth authentication", "link social accounts", "postvolve setup", "social media integration"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Connecting your social media accounts to PostVolve is the first step to automating your content distribution. This guide will walk you through the secure OAuth process for each platform, ensuring your accounts are properly linked and ready for automated posting.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Connect Your Accounts?</h2>
        <p className="text-gray-700 mb-4">
          Once connected, PostVolve can:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Automatically publish your approved content to multiple platforms simultaneously</li>
          <li>Optimize content for each platform's specific requirements (character limits, image dimensions, hashtags)</li>
          <li>Schedule posts at optimal times for maximum engagement</li>
          <li>Track performance metrics across all your connected platforms</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security & Privacy</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How OAuth Works</h3>
          <p className="text-blue-800 text-sm mb-3">
            PostVolve uses industry-standard OAuth 2.0 authentication. This means:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-blue-800 text-sm">
            <li><strong>We never see or store your passwords</strong> - You authorize PostVolve through the platform's official login page</li>
            <li><strong>Limited permissions</strong> - We only request permission to post content on your behalf</li>
            <li><strong>Revocable access</strong> - You can disconnect your accounts anytime from PostVolve or directly from the platform</li>
            <li><strong>Encrypted tokens</strong> - All access tokens are encrypted and stored securely</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Connect Accounts</h2>
        <p className="text-gray-700 mb-4">
          Follow these steps to connect any social media platform:
        </p>

        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Navigate to Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Go to <strong>Dashboard → Settings → Connected Accounts</strong></p>
          </li>
          <li>
            <strong>Click "Connect"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Find the platform you want to connect and click the <strong>"Connect"</strong> button</p>
          </li>
          <li>
            <strong>Authorize on Platform</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">You'll be redirected to the platform's official authorization page (e.g., LinkedIn, Twitter, Facebook)</p>
          </li>
          <li>
            <strong>Grant Permissions</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Review and approve the permissions requested by PostVolve</p>
          </li>
          <li>
            <strong>Return to PostVolve</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">You'll be automatically redirected back to PostVolve with your account connected</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Platform-Specific Guides</h2>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">LinkedIn</h3>
        <p className="text-gray-700 mb-4">
          Connecting LinkedIn allows PostVolve to post to your LinkedIn profile or company page:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>You'll be asked to log in to your LinkedIn account</li>
          <li>Review the permissions (typically "Share content on your behalf")</li>
          <li>Select which LinkedIn profile or page to connect</li>
          <li>Confirm the connection</li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> LinkedIn may require you to verify your connection periodically. If you see a "Reconnect" button, simply click it and re-authorize.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">X (Twitter)</h3>
        <p className="text-gray-700 mb-4">
          Connecting your X/Twitter account enables automated posting:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Log in to your Twitter/X account when prompted</li>
          <li>Authorize PostVolve to read and write tweets</li>
          <li>Twitter will show you what permissions are being requested</li>
          <li>Confirm to complete the connection</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Facebook</h3>
        <p className="text-gray-700 mb-4">
          Facebook connection allows posting to both your personal profile and pages:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>Log in to your Facebook account</li>
          <li>Select which pages you want to connect (if you manage multiple)</li>
          <li>Grant publishing permissions</li>
          <li>Confirm the connection</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Instagram</h3>
        <p className="text-gray-700 mb-4">
          Instagram connection is done through Facebook's Business API:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li>First connect your Facebook account</li>
          <li>If your Instagram is linked to a Facebook Page, it will be available automatically</li>
          <li>Select the Instagram account you want to connect</li>
          <li>Grant necessary permissions</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Instagram requires a Facebook Page connection. If you don't have one, you'll need to create a Facebook Page and link it to your Instagram account first.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Connected Accounts</h2>
        <p className="text-gray-700 mb-4">
          Once connected, you can manage your accounts from the Settings page:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>View Connection Status:</strong> See which accounts are connected and when they were last used</li>
          <li><strong>Disconnect:</strong> Remove an account connection at any time</li>
          <li><strong>Reconnect:</strong> If a connection expires or fails, click "Reconnect" to re-authorize</li>
          <li><strong>Test Connection:</strong> Verify that your account is working properly</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Connection Failed</h3>
            <p className="text-gray-700 text-sm">If the connection fails, try clearing your browser cache and cookies, then attempt the connection again. Make sure you're using a supported browser.</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Token Expired</h3>
            <p className="text-gray-700 text-sm">OAuth tokens can expire. If you see a "Reconnect" button, simply click it and re-authorize. This usually takes less than 30 seconds.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Permission Denied</h3>
            <p className="text-gray-700 text-sm">If a platform denies permission, check that you're logged into the correct account and that you haven't blocked PostVolve's access from the platform's settings.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Connect All Platforms:</strong> The more platforms you connect, the more reach you get from each piece of content</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Regular Checks:</strong> Periodically verify your connections are still active, especially after platform updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Secure Your Accounts:</strong> Use strong passwords and two-factor authentication on your social accounts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Test Before Auto-Posting:</strong> Publish a test post manually before enabling auto-posting to ensure everything works</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/quick-start-guide" className="text-[#6D28D9] hover:underline">Quick Start Guide</Link></li>
            <li>• <Link href="/dashboard/help/setting-up-auto-posting" className="text-[#6D28D9] hover:underline">Setting Up Auto-Posting</Link></li>
            <li>• <Link href="/dashboard/help/account-security" className="text-[#6D28D9] hover:underline">Account Security</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["quick-start-guide", "setting-up-auto-posting", "account-security"]
  },

  "how-ai-content-generation-works": {
    title: "How AI Content Generation Works: Complete Guide to PostVolve's AI Engine",
    category: "Content Generation",
    description: "Discover how PostVolve's AI generates viral news cards in seconds. Learn about the technology, three generation lanes, and how to get the best results.",
    metaKeywords: ["ai content generation", "postvolve ai", "automated content creation", "ai social media", "content automation"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          PostVolve uses cutting-edge AI technology to generate engaging social media content in under 6 seconds. This guide explains how our AI engine works, the three different generation methods, and how you can optimize your results for maximum engagement.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Technology Behind PostVolve</h2>
        <p className="text-gray-700 mb-4">
          PostVolve leverages Google's Gemini AI model, one of the most advanced multimodal AI systems available. This allows us to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Generate Text:</strong> Create engaging captions optimized for each social platform</li>
          <li><strong>Create Images:</strong> Generate visually compelling news card graphics that match your content</li>
          <li><strong>Understand Context:</strong> Analyze URLs, prompts, and trends to create relevant content</li>
          <li><strong>Platform Optimization:</strong> Automatically adjust content for LinkedIn, Twitter, Facebook, and Instagram</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Three Generation Lanes</h2>
        <p className="text-gray-700 mb-4">
          PostVolve offers three distinct ways to generate content, each designed for different use cases:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Lane 1: Auto-Generation (Category-Based)</h3>
        <p className="text-gray-700 mb-4">
          <strong>Best for:</strong> Maintaining a consistent posting schedule with minimal effort
        </p>
        <p className="text-gray-700 mb-4">
          Auto-generation works by:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Analyzing current trends in your selected categories (Tech, AI, Business, Motivation, or Custom)</li>
          <li>Identifying trending topics and news stories relevant to your niche</li>
          <li>Generating engaging captions that add value to the conversation</li>
          <li>Creating matching visuals that capture attention</li>
          <li>Optimizing everything for your selected platforms</li>
        </ol>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-purple-800">
            <strong>Pro Tip:</strong> The more specific your categories, the more targeted your auto-generated content will be. Consider using the "Custom" category to define your unique niche.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Lane 2: URL-Based Generation</h3>
        <p className="text-gray-700 mb-4">
          <strong>Best for:</strong> Sharing articles, blog posts, or news stories with your unique perspective
        </p>
        <p className="text-gray-700 mb-4">
          When you provide a URL, PostVolve:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Extracts Content:</strong> Reads and understands the article's main points</li>
          <li><strong>Summarizes:</strong> Creates a concise summary that captures the essence</li>
          <li><strong>Adds Value:</strong> Generates engaging commentary or insights</li>
          <li><strong>Creates Visual:</strong> Designs a news card that represents the content</li>
          <li><strong>Optimizes:</strong> Formats everything for your selected platforms</li>
        </ol>
        <p className="text-gray-700 mb-6">
          This method positions you as a curator and thought leader, sharing valuable content with your unique perspective.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Lane 3: Custom Prompts</h3>
        <p className="text-gray-700 mb-4">
          <strong>Best for:</strong> Specific ideas, announcements, or content that requires your exact vision
        </p>
        <p className="text-gray-700 mb-4">
          Custom prompts give you complete control:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Write exactly what you want the AI to create</li>
          <li>Optionally upload an image to use as a base or reference</li>
          <li>The AI interprets your prompt and generates matching content</li>
          <li>You can iterate and refine until you get the perfect result</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Writing Effective Prompts</h4>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Be Specific:</strong> "Create a post about AI in healthcare" is better than "AI post"</li>
            <li>• <strong>Include Context:</strong> Mention your target audience or goal</li>
            <li>• <strong>Set the Tone:</strong> Specify if you want it professional, casual, motivational, etc.</li>
            <li>• <strong>Mention Platforms:</strong> If you have specific requirements for certain platforms</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Content Gets Optimized</h2>
        <p className="text-gray-700 mb-4">
          PostVolve automatically optimizes every piece of content for each platform:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">LinkedIn</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Professional tone</li>
              <li>• 3,000 character limit</li>
              <li>• Industry-relevant hashtags</li>
              <li>• Business-focused visuals</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">X (Twitter)</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Concise, punchy copy</li>
              <li>• 280 character limit</li>
              <li>• Trending hashtags</li>
              <li>• Eye-catching visuals</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Facebook</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Conversational tone</li>
              <li>• 63,206 character limit</li>
              <li>• Community-focused</li>
              <li>• Shareable visuals</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Instagram</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Visual-first approach</li>
              <li>• 2,200 character limit</li>
              <li>• Hashtag optimization</li>
              <li>• Square/portrait formats</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Image Generation</h2>
        <p className="text-gray-700 mb-4">
          PostVolve's AI doesn't just generate text—it creates complete visual news cards:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Brand Consistency:</strong> Images follow your selected categories and style</li>
          <li><strong>Platform Optimization:</strong> Automatically sized for each platform's requirements</li>
          <li><strong>Visual Appeal:</strong> Designed to stop the scroll and drive engagement</li>
          <li><strong>Regeneration:</strong> Don't like an image? Regenerate it instantly with one click</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting the Best Results</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Best Practices</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Review and Edit:</strong> Always review AI-generated content and add your personal touch</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Use Multiple Lanes:</strong> Mix auto-generation, URL-based, and custom prompts for variety</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Iterate:</strong> Don't hesitate to regenerate content if it doesn't match your vision</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Customize:</strong> Adjust captions, images, and platform selections before posting</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Questions</h2>
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-[#6D28D9] pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">How accurate is the AI content?</h3>
            <p className="text-gray-700">PostVolve's AI is highly accurate, but we always recommend reviewing content before posting. The AI is trained on current trends and best practices, but your unique voice is what makes content authentic.</p>
          </div>
          <div className="border-l-4 border-[#6D28D9] pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Can I use AI-generated content commercially?</h3>
            <p className="text-gray-700">Yes! All content generated by PostVolve is yours to use commercially. You own the rights to everything created through our platform.</p>
          </div>
          <div className="border-l-4 border-[#6D28D9] pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">What if the AI makes a mistake?</h3>
            <p className="text-gray-700">That's why all content goes to drafts first. You can review, edit, or regenerate anything before it goes live. You're always in control.</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/using-url-based-generation" className="text-[#6D28D9] hover:underline">Using URL-Based Generation</Link></li>
            <li>• <Link href="/dashboard/help/custom-prompts-and-uploads" className="text-[#6D28D9] hover:underline">Custom Prompts & Uploads</Link></li>
            <li>• <Link href="/dashboard/help/quick-start-guide" className="text-[#6D28D9] hover:underline">Quick Start Guide</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["using-url-based-generation", "custom-prompts-and-uploads", "quick-start-guide"]
  },

  "using-url-based-generation": {
    title: "Using URL-Based Content Generation: Share Articles with Your Unique Perspective",
    category: "Content Generation",
    description: "Learn how to use PostVolve's URL-based generation to create engaging social media posts from articles, blog posts, and news stories.",
    metaKeywords: ["url content generation", "article to social media", "content curation", "share articles", "social media automation"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          URL-based generation is one of PostVolve's most powerful features. It allows you to transform any article, blog post, or news story into engaging social media content with your unique perspective. This guide will show you how to use it effectively.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is URL-Based Generation?</h2>
        <p className="text-gray-700 mb-4">
          URL-based generation takes any web URL and:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Extracts the main content and key points from the article</li>
          <li>Summarizes it into engaging social media copy</li>
          <li>Adds your unique perspective or commentary</li>
          <li>Creates a visually compelling news card</li>
          <li>Optimizes everything for your selected platforms</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Use URL-Based Generation</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Navigate to Content Generation</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Go to <strong>Dashboard → Content Generation</strong></p>
          </li>
          <li>
            <strong>Select "Quick Generate" or "Full Pipeline"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Both options support URL-based generation</p>
          </li>
          <li>
            <strong>Choose "URL" as Your Source</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">You'll see options for Auto, URL, or Custom Prompt</p>
          </li>
          <li>
            <strong>Paste Your URL</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Copy and paste the URL of the article you want to share</p>
          </li>
          <li>
            <strong>Select Platforms</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose which social media platforms to post to</p>
          </li>
          <li>
            <strong>Generate</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Click generate and wait about 6 seconds for your content</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What URLs Work Best?</h2>
        <p className="text-gray-700 mb-4">
          PostVolve works with most web content, but some sources work better than others:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-green-900 mb-3">✓ Best Sources</h3>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• News articles (TechCrunch, The Verge, Wired, etc.)</li>
            <li>• Blog posts (Medium, Substack, personal blogs)</li>
            <li>• Industry publications</li>
            <li>• Research papers and studies</li>
            <li>• Product announcements</li>
            <li>• Company blog posts</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-amber-900 mb-3">⚠ May Require Manual Input</h3>
          <ul className="space-y-2 text-amber-800 text-sm">
            <li>• Paywalled content (may need to paste text manually)</li>
            <li>• PDFs (extract text first or use Custom Prompt)</li>
            <li>• Video content (use Custom Prompt with description)</li>
            <li>• Social media posts (use Custom Prompt instead)</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adding Your Unique Perspective</h2>
        <p className="text-gray-700 mb-4">
          After PostVolve generates content from a URL, you can:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Edit the Caption:</strong> Add your thoughts, opinions, or insights</li>
          <li><strong>Ask Questions:</strong> Engage your audience with thought-provoking questions</li>
          <li><strong>Share Experiences:</strong> Relate the content to your personal or professional experience</li>
          <li><strong>Add Context:</strong> Explain why this matters to your audience</li>
          <li><strong>Create Discussion:</strong> Encourage comments and engagement</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Always Add Value:</strong> Don't just share—add your unique perspective or insights</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Credit Sources:</strong> The generated content typically includes source attribution, but you can add more context</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Review Before Posting:</strong> Ensure the summary accurately represents the article</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Mix Sources:</strong> Use a variety of sources to keep your content diverse and interesting</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Use Cases</h2>
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Industry News Sharing</h3>
            <p className="text-gray-700 text-sm">Share breaking news in your industry with your expert commentary</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Content Curation</h3>
            <p className="text-gray-700 text-sm">Position yourself as a thought leader by curating valuable content</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Research Sharing</h3>
            <p className="text-gray-700 text-sm">Share research papers or studies with simplified explanations</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Product Announcements</h3>
            <p className="text-gray-700 text-sm">Share product launches or updates with your perspective</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/how-ai-content-generation-works" className="text-[#6D28D9] hover:underline">How AI Content Generation Works</Link></li>
            <li>• <Link href="/dashboard/help/custom-prompts-and-uploads" className="text-[#6D28D9] hover:underline">Custom Prompts & Uploads</Link></li>
            <li>• <Link href="/dashboard/help/best-times-to-post" className="text-[#6D28D9] hover:underline">Best Times to Post</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["how-ai-content-generation-works", "custom-prompts-and-uploads", "best-times-to-post"]
  },

  "custom-prompts-and-uploads": {
    title: "Custom Prompts & Image Uploads: Create Exactly What You Want",
    category: "Content Generation",
    description: "Master custom prompts and image uploads to create personalized social media content that matches your exact vision and brand.",
    metaKeywords: ["custom prompts", "ai prompts", "image upload", "personalized content", "content customization"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Custom prompts give you complete control over your content creation. Whether you have a specific idea, want to announce something, or need content that matches your exact brand voice, custom prompts let you create exactly what you envision.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Are Custom Prompts?</h2>
        <p className="text-gray-700 mb-4">
          Custom prompts allow you to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Write exactly what you want the AI to create</li>
          <li>Specify tone, style, and messaging</li>
          <li>Optionally upload an image to use as reference or base</li>
          <li>Generate content that matches your unique requirements</li>
          <li>Iterate and refine until you get perfect results</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Use Custom Prompts</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Content Generation</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Content Generation</strong></p>
          </li>
          <li>
            <strong>Select "Custom Prompt"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose the Custom Prompt option</p>
          </li>
          <li>
            <strong>Write Your Prompt</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Describe what you want to create in detail</p>
          </li>
          <li>
            <strong>Upload Image (Optional)</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">If you have a specific image, upload it here</p>
          </li>
          <li>
            <strong>Select Platforms</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose where you want to post</p>
          </li>
          <li>
            <strong>Generate</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Click generate and review the results</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Writing Effective Prompts</h2>
        <p className="text-gray-700 mb-4">
          The quality of your prompt directly affects the quality of the generated content. Here's how to write great prompts:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Be Specific</h3>
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2"><strong>❌ Vague:</strong></p>
          <p className="text-sm text-gray-700 mb-4 italic">"Create a post about AI"</p>
          <p className="text-sm text-gray-600 mb-2"><strong>✓ Specific:</strong></p>
          <p className="text-sm text-gray-700 italic">"Create a professional LinkedIn post about how AI is transforming healthcare, focusing on diagnostic accuracy improvements. Use a motivational tone and include a call-to-action asking readers to share their experiences."</p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Include Context</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Target Audience:</strong> "For software engineers interested in AI"</li>
          <li><strong>Purpose:</strong> "To announce our new product launch"</li>
          <li><strong>Goal:</strong> "To drive engagement and start a discussion"</li>
          <li><strong>Platform:</strong> "Optimized for LinkedIn's professional audience"</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Set the Tone</h3>
        <p className="text-gray-700 mb-4">
          Specify the tone you want:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Professional</p>
            <p className="text-xs text-gray-600">Formal, business-focused</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Casual</p>
            <p className="text-xs text-gray-600">Friendly, conversational</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Motivational</p>
            <p className="text-xs text-gray-600">Inspiring, uplifting</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">Educational</p>
            <p className="text-xs text-gray-600">Informative, teaching</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Image Uploads</h2>
        <p className="text-gray-700 mb-4">
          You can upload images in two ways:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Option 1: Use as Reference</h3>
        <p className="text-gray-700 mb-4">
          Upload an image and let the AI create a similar style or incorporate elements from it:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>AI analyzes the style, colors, and composition</li>
          <li>Creates new content inspired by your image</li>
          <li>Maintains brand consistency</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Option 2: Use Directly</h3>
        <p className="text-gray-700 mb-4">
          Upload an image you want to use, and the AI will:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Generate optimized captions for that image</li>
          <li>Create platform-specific variations</li>
          <li>Suggest hashtags and engagement strategies</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prompt Examples</h2>
        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Example 1: Product Announcement</h4>
            <p className="text-sm text-gray-700 italic mb-2">
              "Create an exciting announcement post for our new AI-powered analytics tool. Target audience: data analysts and business intelligence professionals. Tone: professional but enthusiastic. Include a call-to-action to sign up for early access. Optimize for LinkedIn and Twitter."
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Example 2: Thought Leadership</h4>
            <p className="text-sm text-gray-700 italic mb-2">
              "Write a thought-provoking post about the future of remote work in 2025. Share insights on productivity, team collaboration, and work-life balance. Ask readers to share their predictions. Professional tone for LinkedIn."
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Example 3: Motivational Content</h4>
            <p className="text-sm text-gray-700 italic mb-2">
              "Create an inspiring post about overcoming challenges in entrepreneurship. Include a personal story element and end with an empowering message. Motivational tone, suitable for all platforms."
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Iterating and Refining</h2>
        <p className="text-gray-700 mb-4">
          Don't settle for the first result. PostVolve makes it easy to iterate:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Regenerate:</strong> Click regenerate to get a new version with the same prompt</li>
          <li><strong>Edit Prompt:</strong> Refine your prompt and generate again</li>
          <li><strong>Manual Edits:</strong> Edit the generated content directly</li>
          <li><strong>Image Regeneration:</strong> Keep the caption, regenerate just the image</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Start Detailed:</strong> The more information in your prompt, the better the results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Iterate:</strong> Use the first result as a starting point, then refine</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Save Good Prompts:</strong> Keep a library of prompts that work well for your brand</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Combine Methods:</strong> Use custom prompts alongside auto-generation for variety</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/how-ai-content-generation-works" className="text-[#6D28D9] hover:underline">How AI Content Generation Works</Link></li>
            <li>• <Link href="/dashboard/help/using-url-based-generation" className="text-[#6D28D9] hover:underline">Using URL-Based Generation</Link></li>
            <li>• <Link href="/dashboard/help/understanding-your-dashboard" className="text-[#6D28D9] hover:underline">Understanding Your Dashboard</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["how-ai-content-generation-works", "using-url-based-generation", "understanding-your-dashboard"]
  },

  "setting-up-auto-posting": {
    title: "Setting Up Auto-Posting: Automate Your Social Media Content",
    category: "Scheduling & Posting",
    description: "Learn how to set up and configure auto-posting in PostVolve to automatically publish your approved content at optimal times.",
    metaKeywords: ["auto posting", "automated social media", "schedule posts", "content automation", "social media scheduling"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Auto-posting is one of PostVolve's most powerful features. Once enabled, it automatically publishes your approved drafts at scheduled times, ensuring consistent content delivery without manual intervention. This guide will walk you through setting it up.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Auto-Posting?</h2>
        <p className="text-gray-700 mb-4">
          Auto-posting allows PostVolve to automatically publish your approved content to your connected social media accounts at scheduled times. This means:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>You review and approve drafts in advance</li>
          <li>PostVolve handles the publishing automatically</li>
          <li>Content goes live at optimal times for maximum engagement</li>
          <li>You maintain a consistent posting schedule without daily effort</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Enable Auto-Posting</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Settings</strong></p>
          </li>
          <li>
            <strong>Find Posting Schedules</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Scroll to the "Posting Schedules" section</p>
          </li>
          <li>
            <strong>Enable Auto-Posting</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Toggle the "Enable Auto-Posting" switch to ON</p>
          </li>
          <li>
            <strong>Set Your Schedule</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Configure when you want posts to go live (time, days, frequency)</p>
          </li>
          <li>
            <strong>Select Platforms</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose which platforms should use auto-posting</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Configuring Your Schedule</h2>
        <p className="text-gray-700 mb-4">
          You can create multiple posting schedules for different scenarios:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Daily Schedule</h3>
        <p className="text-gray-700 mb-4">
          Set a specific time each day when posts should go live. For example:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Every day at 9:00 AM</li>
          <li>Every day at 3:00 PM</li>
          <li>Multiple times per day (e.g., 9 AM, 1 PM, 5 PM)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Weekly Schedule</h3>
        <p className="text-gray-700 mb-4">
          Post on specific days of the week:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Monday, Wednesday, Friday at 10:00 AM</li>
          <li>Weekdays only (Monday-Friday)</li>
          <li>Weekends only (Saturday-Sunday)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Platform-Specific Schedules</h3>
        <p className="text-gray-700 mb-4">
          Different platforms may have different optimal posting times:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>LinkedIn: Weekday mornings (8-10 AM)</li>
          <li>Twitter: Multiple times throughout the day</li>
          <li>Facebook: Evenings (6-9 PM)</li>
          <li>Instagram: Lunch hours (12-2 PM) or evenings</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Auto-Posting Works</h2>
        <p className="text-gray-700 mb-4">
          Here's the complete flow:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-6">
          <li><strong>Content Generation:</strong> PostVolve generates drafts based on your preferences</li>
          <li><strong>Review Phase:</strong> Drafts appear in your dashboard for review</li>
          <li><strong>Approval:</strong> You approve drafts you want to publish</li>
          <li><strong>Scheduling:</strong> Approved drafts are automatically scheduled based on your settings</li>
          <li><strong>Auto-Publishing:</strong> At the scheduled time, PostVolve publishes to your selected platforms</li>
          <li><strong>Confirmation:</strong> You receive notifications when posts go live</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Start Gradually:</strong> Enable auto-posting for one platform first, then expand</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Review Regularly:</strong> Check your drafts daily to ensure quality before auto-posting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Monitor Performance:</strong> Use analytics to adjust posting times for better engagement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Maintain Buffer:</strong> Keep a few approved drafts ready to avoid gaps in your schedule</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Safety Features</h2>
        <p className="text-gray-700 mb-4">
          PostVolve includes several safety features to protect your brand:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Manual Review Required:</strong> Nothing publishes without your approval</li>
          <li><strong>Pause Anytime:</strong> Disable auto-posting instantly from settings</li>
          <li><strong>Platform Toggle:</strong> Enable/disable auto-posting per platform</li>
          <li><strong>Schedule Override:</strong> Manually schedule specific posts outside your auto-posting schedule</li>
        </ul>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/managing-your-schedule" className="text-[#6D28D9] hover:underline">Managing Your Schedule</Link></li>
            <li>• <Link href="/dashboard/help/best-times-to-post" className="text-[#6D28D9] hover:underline">Best Times to Post</Link></li>
            <li>• <Link href="/dashboard/help/connecting-social-accounts" className="text-[#6D28D9] hover:underline">Connecting Social Accounts</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["managing-your-schedule", "best-times-to-post", "connecting-social-accounts"]
  },

  "managing-your-schedule": {
    title: "Managing Your Posting Schedule: Complete Guide",
    category: "Scheduling & Posting",
    description: "Learn how to effectively manage your posting schedules, create multiple schedules, and optimize your content delivery timing.",
    metaKeywords: ["posting schedule", "content scheduling", "social media calendar", "schedule management", "content planning"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Effective schedule management is key to maintaining a consistent social media presence. This guide covers everything you need to know about creating, editing, and optimizing your posting schedules in PostVolve.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding Schedules</h2>
        <p className="text-gray-700 mb-4">
          PostVolve allows you to create multiple posting schedules, each with its own:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Time settings (specific times or intervals)</li>
          <li>Day preferences (daily, weekdays, weekends, specific days)</li>
          <li>Platform assignments (which platforms use this schedule)</li>
          <li>Category filters (optional: only posts from specific categories)</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Creating a New Schedule</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Settings → Posting Schedules</strong></p>
          </li>
          <li>
            <strong>Click "Add Schedule"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">You'll see a form to configure your new schedule</p>
          </li>
          <li>
            <strong>Set Time</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose the time(s) when posts should go live</p>
          </li>
          <li>
            <strong>Select Days</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose which days of the week this schedule applies</p>
          </li>
          <li>
            <strong>Assign Platforms</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Select which social media platforms use this schedule</p>
          </li>
          <li>
            <strong>Save</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Click save to activate your new schedule</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Schedule Examples</h2>

        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Example 1: Professional Schedule</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Time:</strong> 9:00 AM, 1:00 PM, 5:00 PM</li>
              <li>• <strong>Days:</strong> Monday through Friday</li>
              <li>• <strong>Platforms:</strong> LinkedIn, Twitter</li>
              <li>• <strong>Use Case:</strong> Business-focused content during work hours</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Example 2: Weekend Engagement</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Time:</strong> 10:00 AM, 3:00 PM</li>
              <li>• <strong>Days:</strong> Saturday and Sunday</li>
              <li>• <strong>Platforms:</strong> Instagram, Facebook</li>
              <li>• <strong>Use Case:</strong> Lifestyle and casual content on weekends</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h4 className="font-semibold text-gray-900 mb-2">Example 3: High-Frequency</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Time:</strong> Every 4 hours (8 AM, 12 PM, 4 PM, 8 PM)</li>
              <li>• <strong>Days:</strong> Every day</li>
              <li>• <strong>Platforms:</strong> Twitter only</li>
              <li>• <strong>Use Case:</strong> News and real-time updates</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Editing Existing Schedules</h2>
        <p className="text-gray-700 mb-4">
          You can modify any schedule at any time:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Click the schedule you want to edit</li>
          <li>Modify time, days, or platform assignments</li>
          <li>Changes take effect immediately for future posts</li>
          <li>Already scheduled posts are not affected</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Deleting Schedules</h2>
        <p className="text-gray-700 mb-4">
          To remove a schedule:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Go to Settings → Posting Schedules</li>
          <li>Find the schedule you want to delete</li>
          <li>Click the delete/remove button</li>
          <li>Confirm the deletion</li>
        </ol>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Deleting a schedule does not affect posts that are already scheduled. Only future auto-posting will be affected.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Viewing Your Schedule</h2>
        <p className="text-gray-700 mb-4">
          You can view your posting schedule in two ways:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Calendar View</h3>
        <p className="text-gray-700 mb-4">
          The Scheduler page shows a calendar view where you can:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>See all scheduled posts at a glance</li>
          <li>Identify gaps in your posting schedule</li>
          <li>Reschedule posts by dragging them to different dates</li>
          <li>View posts by platform or category</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">List View</h3>
        <p className="text-gray-700 mb-4">
          The "Upcoming Posts" list shows:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>All scheduled posts in chronological order</li>
          <li>Post status (scheduled, published, failed)</li>
          <li>Platform assignments</li>
          <li>Quick actions (edit, reschedule, cancel)</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Start Simple:</strong> Begin with one schedule, then add more as needed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Platform-Specific:</strong> Create different schedules for different platforms based on their optimal times</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Regular Review:</strong> Review and adjust schedules monthly based on performance data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Maintain Buffer:</strong> Keep several approved drafts ready to avoid schedule gaps</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/setting-up-auto-posting" className="text-[#6D28D9] hover:underline">Setting Up Auto-Posting</Link></li>
            <li>• <Link href="/dashboard/help/best-times-to-post" className="text-[#6D28D9] hover:underline">Best Times to Post</Link></li>
            <li>• <Link href="/dashboard/help/understanding-your-metrics" className="text-[#6D28D9] hover:underline">Understanding Your Metrics</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["setting-up-auto-posting", "best-times-to-post", "understanding-your-metrics"]
  },

  "best-times-to-post": {
    title: "Best Times to Post on Social Media: Data-Driven Guide",
    category: "Scheduling & Posting",
    description: "Discover the optimal posting times for LinkedIn, Twitter, Facebook, and Instagram based on engagement data and audience behavior.",
    metaKeywords: ["best time to post", "social media timing", "optimal posting times", "engagement optimization", "content scheduling"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Timing is everything in social media. Posting at the right time can significantly increase your engagement, reach, and overall performance. This guide provides data-driven insights into the best times to post on each platform.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Timing Matters</h2>
        <p className="text-gray-700 mb-4">
          Posting at optimal times ensures:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Maximum Visibility:</strong> Your content appears when your audience is most active</li>
          <li><strong>Higher Engagement:</strong> More likes, comments, and shares</li>
          <li><strong>Better Algorithm Performance:</strong> Social platforms favor content that gets immediate engagement</li>
          <li><strong>Increased Reach:</strong> More people see your content in their feeds</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">LinkedIn: Best Times to Post</h2>
        <p className="text-gray-700 mb-4">
          LinkedIn is a professional network, so timing aligns with business hours:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Optimal Times</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Tuesday-Thursday:</strong> 8:00 AM - 10:00 AM (Highest engagement)</li>
            <li>• <strong>Monday:</strong> 9:00 AM - 11:00 AM (Start of work week)</li>
            <li>• <strong>Wednesday:</strong> 12:00 PM - 1:00 PM (Lunch break)</li>
            <li>• <strong>Friday:</strong> 8:00 AM - 9:00 AM (End of week wrap-up)</li>
          </ul>
          <p className="text-blue-800 text-sm mt-3">
            <strong>Avoid:</strong> Evenings, weekends, and early mornings (before 7 AM)
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">X (Twitter): Best Times to Post</h2>
        <p className="text-gray-700 mb-4">
          Twitter has a fast-moving feed, so multiple posts per day work well:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Optimal Times</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• <strong>Monday-Friday:</strong> 8:00 AM - 9:00 AM (Morning commute)</li>
            <li>• <strong>Monday-Friday:</strong> 12:00 PM - 1:00 PM (Lunch break)</li>
            <li>• <strong>Monday-Friday:</strong> 5:00 PM - 6:00 PM (Evening commute)</li>
            <li>• <strong>Weekends:</strong> 9:00 AM - 10:00 AM (Leisurely morning)</li>
          </ul>
          <p className="text-gray-700 text-sm mt-3">
            <strong>Frequency:</strong> 3-5 posts per day is optimal for Twitter
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Facebook: Best Times to Post</h2>
        <p className="text-gray-700 mb-4">
          Facebook users are most active during evenings and weekends:
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Optimal Times</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Tuesday-Thursday:</strong> 1:00 PM - 3:00 PM (Afternoon break)</li>
            <li>• <strong>Monday-Friday:</strong> 6:00 PM - 9:00 PM (Evening leisure)</li>
            <li>• <strong>Saturday-Sunday:</strong> 12:00 PM - 1:00 PM (Weekend lunch)</li>
            <li>• <strong>Saturday-Sunday:</strong> 3:00 PM - 4:00 PM (Weekend afternoon)</li>
          </ul>
          <p className="text-blue-800 text-sm mt-3">
            <strong>Best Day:</strong> Thursday typically sees the highest engagement
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Instagram: Best Times to Post</h2>
        <p className="text-gray-700 mb-4">
          Instagram users are active throughout the day, with peaks during breaks:
        </p>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-pink-900 mb-3">Optimal Times</h3>
          <ul className="space-y-2 text-pink-800 text-sm">
            <li>• <strong>Monday-Friday:</strong> 11:00 AM - 1:00 PM (Lunch break)</li>
            <li>• <strong>Monday-Friday:</strong> 5:00 PM - 7:00 PM (After work)</li>
            <li>• <strong>Tuesday:</strong> 2:00 PM - 3:00 PM (Mid-week engagement peak)</li>
            <li>• <strong>Weekends:</strong> 9:00 AM - 11:00 AM (Weekend morning)</li>
          </ul>
          <p className="text-pink-800 text-sm mt-3">
            <strong>Best Days:</strong> Tuesday and Wednesday see the highest engagement
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Finding Your Optimal Times</h2>
        <p className="text-gray-700 mb-4">
          While these are general guidelines, your specific audience may have different patterns. Use PostVolve's analytics to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Track when your posts get the most engagement</li>
          <li>Identify your audience's active hours</li>
          <li>Test different posting times and compare results</li>
          <li>Adjust your schedule based on data</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Time Zone Considerations</h2>
        <p className="text-gray-700 mb-4">
          If your audience spans multiple time zones:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Post at times that work for your primary audience</li>
          <li>Consider posting multiple times to reach different time zones</li>
          <li>Use PostVolve's timezone settings to schedule in your audience's local time</li>
          <li>Analyze which time zones engage most with your content</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Test and Learn:</strong> Use analytics to find your unique optimal times</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Consistency Matters:</strong> Regular posting at consistent times builds audience expectations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Quality Over Quantity:</strong> Better to post less frequently at optimal times than constantly at poor times</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Platform-Specific:</strong> Each platform has different optimal times—adjust accordingly</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/setting-up-auto-posting" className="text-[#6D28D9] hover:underline">Setting Up Auto-Posting</Link></li>
            <li>• <Link href="/dashboard/help/managing-your-schedule" className="text-[#6D28D9] hover:underline">Managing Your Schedule</Link></li>
            <li>• <Link href="/dashboard/help/engagement-analytics" className="text-[#6D28D9] hover:underline">Engagement Analytics</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["setting-up-auto-posting", "managing-your-schedule", "engagement-analytics"]
  },

  "understanding-your-metrics": {
    title: "Understanding Your Analytics Metrics: Complete Guide to PostVolve Analytics",
    category: "Analytics & Insights",
    description: "Learn how to read and interpret your PostVolve analytics dashboard, understand key metrics, and use data to improve your social media performance.",
    metaKeywords: ["social media analytics", "post performance metrics", "engagement analytics", "content analytics", "social media insights"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Understanding your analytics is crucial for improving your social media strategy. PostVolve provides comprehensive metrics to help you track performance, identify what works, and optimize your content for better engagement.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Metrics Overview</h2>
        <p className="text-gray-700 mb-4">
          Your analytics dashboard tracks several important metrics:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Total Impressions</h3>
        <p className="text-gray-700 mb-4">
          Impressions represent the total number of times your posts were displayed in users' feeds. This metric shows your reach potential.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Higher impressions = more visibility</li>
          <li>Compare impressions across different post types</li>
          <li>Track trends over time to identify growth</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Total Engagements</h3>
        <p className="text-gray-700 mb-4">
          Engagements include all interactions with your posts: likes, comments, shares, retweets, and clicks.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Shows how well your content resonates with your audience</li>
          <li>Higher engagement = better content performance</li>
          <li>Track which content types drive the most engagement</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Engagement Rate</h3>
        <p className="text-gray-700 mb-4">
          Engagement rate is calculated as (Total Engagements / Total Impressions) × 100. This shows the percentage of people who saw your post and interacted with it.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Industry Benchmarks:</strong> Average engagement rates vary by platform: LinkedIn (2-3%), Twitter (0.5-1%), Facebook (1-2%), Instagram (1-3%). Higher is always better!
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reading Your Analytics Dashboard</h2>
        <p className="text-gray-700 mb-4">
          The analytics page provides several views:
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Time Range Selection</h3>
        <p className="text-gray-700 mb-4">
          Select different time periods to analyze:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Last 7 days:</strong> Recent performance trends</li>
          <li><strong>Last 30 days:</strong> Monthly overview</li>
          <li><strong>Last 90 days:</strong> Quarterly analysis</li>
          <li><strong>Custom range:</strong> Analyze specific periods</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Performance Charts</h3>
        <p className="text-gray-700 mb-4">
          Visual charts show trends over time:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Line charts for impressions and engagements</li>
          <li>Identify peaks and valleys in performance</li>
          <li>Compare metrics side-by-side</li>
          <li>Spot patterns and correlations</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Post History Table</h3>
        <p className="text-gray-700 mb-4">
          Detailed breakdown of individual posts:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>See performance for each post</li>
          <li>Compare posts to identify top performers</li>
          <li>Filter by platform, category, or date</li>
          <li>Export data for external analysis</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Using Analytics to Improve</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Actionable Insights</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Identify Top Content:</strong> Analyze which posts perform best and create similar content</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Optimize Posting Times:</strong> See when your audience is most active and adjust your schedule</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Platform Performance:</strong> Focus efforts on platforms that drive the most engagement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Content Categories:</strong> Identify which categories resonate most with your audience</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/engagement-analytics" className="text-[#6D28D9] hover:underline">Engagement Analytics</Link></li>
            <li>• <Link href="/dashboard/help/exporting-reports" className="text-[#6D28D9] hover:underline">Exporting Reports</Link></li>
            <li>• <Link href="/dashboard/help/best-times-to-post" className="text-[#6D28D9] hover:underline">Best Times to Post</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["engagement-analytics", "exporting-reports", "best-times-to-post"]
  },

  "engagement-analytics": {
    title: "Engagement Analytics: Understanding Likes, Comments, and Shares",
    category: "Analytics & Insights",
    description: "Deep dive into engagement metrics, how to interpret them, and strategies to increase engagement across all your social media platforms.",
    metaKeywords: ["engagement metrics", "social media engagement", "increase engagement", "content engagement", "audience interaction"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Engagement is the lifeblood of social media success. Understanding what drives engagement and how to measure it helps you create content that truly connects with your audience.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Counts as Engagement?</h2>
        <p className="text-gray-700 mb-4">
          Engagement includes all forms of interaction with your content:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">LinkedIn</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Reactions (like, celebrate, etc.)</li>
              <li>• Comments</li>
              <li>• Shares</li>
              <li>• Clicks</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Twitter/X</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Likes</li>
              <li>• Retweets</li>
              <li>• Replies</li>
              <li>• Clicks</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Facebook</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Reactions</li>
              <li>• Comments</li>
              <li>• Shares</li>
              <li>• Clicks</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Instagram</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Likes</li>
              <li>• Comments</li>
              <li>• Saves</li>
              <li>• Shares</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Engagement</h2>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Passive Engagement</h3>
        <p className="text-gray-700 mb-4">
          Quick interactions that require minimal effort:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Likes/Reactions:</strong> The easiest form of engagement, shows appreciation</li>
          <li><strong>Views:</strong> Indicates interest but no active interaction</li>
          <li><strong>Clicks:</strong> Shows curiosity and intent to learn more</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Active Engagement</h3>
        <p className="text-gray-700 mb-4">
          Interactions that require more effort and indicate stronger interest:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Comments:</strong> Highest value engagement, shows deep interest</li>
          <li><strong>Shares:</strong> Indicates content is valuable enough to share with others</li>
          <li><strong>Saves:</strong> Shows intent to reference content later</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Increase Engagement</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Proven Strategies</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Ask Questions:</strong> End posts with questions to encourage comments</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Use Visuals:</strong> Posts with images/videos get 2-3x more engagement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Post at Optimal Times:</strong> Use analytics to find when your audience is most active</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Engage Back:</strong> Respond to comments to build community</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Share Value:</strong> Educational and helpful content gets shared more</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Analyzing Engagement Patterns</h2>
        <p className="text-gray-700 mb-4">
          Look for patterns in your engagement data:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Which content categories get the most engagement?</li>
          <li>What posting times drive the highest engagement?</li>
          <li>Which platforms see the most active engagement?</li>
          <li>What types of posts (questions, tips, news) perform best?</li>
        </ul>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/understanding-your-metrics" className="text-[#6D28D9] hover:underline">Understanding Your Metrics</Link></li>
            <li>• <Link href="/dashboard/help/best-times-to-post" className="text-[#6D28D9] hover:underline">Best Times to Post</Link></li>
            <li>• <Link href="/dashboard/help/exporting-reports" className="text-[#6D28D9] hover:underline">Exporting Reports</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["understanding-your-metrics", "best-times-to-post", "exporting-reports"]
  },

  "exporting-reports": {
    title: "Exporting Reports: How to Download and Share Your Analytics Data",
    category: "Analytics & Insights",
    description: "Learn how to export your PostVolve analytics data, create custom reports, and share insights with your team or clients.",
    metaKeywords: ["export analytics", "download reports", "analytics export", "data export", "social media reports"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Exporting your analytics data allows you to create custom reports, share insights with your team, and perform deeper analysis using external tools. This guide shows you how to export and use your PostVolve data.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Export Reports</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Analytics</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Analytics</strong></p>
          </li>
          <li>
            <strong>Select Time Range</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose the date range you want to export</p>
          </li>
          <li>
            <strong>Click Export</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Click the "Export" button in the top right</p>
          </li>
          <li>
            <strong>Choose Format</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Select CSV or PDF format</p>
          </li>
          <li>
            <strong>Download</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Your report will download automatically</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Export Formats</h2>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">CSV Format</h3>
        <p className="text-gray-700 mb-4">
          CSV exports are perfect for data analysis:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Import into Excel, Google Sheets, or data analysis tools</li>
          <li>Perform custom calculations and analysis</li>
          <li>Create pivot tables and charts</li>
          <li>Combine with other data sources</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">PDF Format</h3>
        <p className="text-gray-700 mb-4">
          PDF reports are ideal for sharing:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Professional presentation format</li>
          <li>Includes charts and visualizations</li>
          <li>Easy to share with clients or team members</li>
          <li>Print-ready format</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What's Included in Exports</h2>
        <p className="text-gray-700 mb-4">
          Your exported reports include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Total impressions and engagements</li>
          <li>Engagement rate calculations</li>
          <li>Individual post performance data</li>
          <li>Platform breakdowns</li>
          <li>Category performance</li>
          <li>Time-based trends</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Using Exported Data</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Common Use Cases</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Client Reports:</strong> Create monthly reports for clients showing their social media performance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Team Analysis:</strong> Share data with your team for collaborative analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Custom Dashboards:</strong> Import into BI tools like Tableau or Power BI</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Historical Tracking:</strong> Keep records for long-term trend analysis</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/understanding-your-metrics" className="text-[#6D28D9] hover:underline">Understanding Your Metrics</Link></li>
            <li>• <Link href="/dashboard/help/engagement-analytics" className="text-[#6D28D9] hover:underline">Engagement Analytics</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["understanding-your-metrics", "engagement-analytics"]
  },

  "account-security": {
    title: "Account Security: Protecting Your PostVolve Account",
    category: "Account & Settings",
    description: "Learn how to secure your PostVolve account, manage passwords, enable two-factor authentication, and protect your social media connections.",
    metaKeywords: ["account security", "password security", "two factor authentication", "account protection", "security settings"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Account security is paramount. This guide covers all the steps you need to take to protect your PostVolve account and your connected social media profiles.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Password Best Practices</h2>
        <p className="text-gray-700 mb-4">
          Your PostVolve password should be:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Unique:</strong> Don't reuse passwords from other accounts</li>
          <li><strong>Long:</strong> At least 12 characters, preferably 16+</li>
          <li><strong>Complex:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
          <li><strong>Memorable:</strong> Use a passphrase or password manager</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changing Your Password</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Account Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Account</strong></p>
          </li>
          <li>
            <strong>Click "Change Password"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Find the password section</p>
          </li>
          <li>
            <strong>Enter Current Password</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Verify your identity</p>
          </li>
          <li>
            <strong>Set New Password</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Enter your new secure password</p>
          </li>
          <li>
            <strong>Confirm</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Save your new password</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Two-Factor Authentication</h2>
        <p className="text-gray-700 mb-4">
          Two-factor authentication (2FA) adds an extra layer of security:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Requires both your password and a verification code</li>
          <li>Protects against password theft</li>
          <li>Highly recommended for all accounts</li>
          <li>Can use authenticator apps or SMS</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Connected Account Security</h2>
        <p className="text-gray-700 mb-4">
          Your connected social media accounts are secured through OAuth:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>We never store your social media passwords</li>
          <li>OAuth tokens are encrypted and stored securely</li>
          <li>You can revoke access anytime from Settings</li>
          <li>Tokens automatically refresh to maintain security</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security Best Practices</h2>
        <div className="bg-gradient-to-br from-[#6D28D9]/5 to-[#4C1D95]/5 border border-[#6D28D9]/20 rounded-xl p-6 mb-6">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Use Strong Passwords:</strong> Never use simple or common passwords</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Enable 2FA:</strong> Add an extra layer of protection</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Review Connected Accounts:</strong> Regularly check which accounts are connected</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Log Out When Done:</strong> Especially on shared or public computers</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6D28D9] font-bold mt-0.5">✓</span>
              <span><strong>Monitor Activity:</strong> Check for any suspicious activity in your account</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/managing-connected-apps" className="text-[#6D28D9] hover:underline">Managing Connected Apps</Link></li>
            <li>• <Link href="/dashboard/help/notification-preferences" className="text-[#6D28D9] hover:underline">Notification Preferences</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["managing-connected-apps", "notification-preferences"]
  },

  "notification-preferences": {
    title: "Notification Preferences: Customize Your PostVolve Alerts",
    category: "Account & Settings",
    description: "Learn how to configure notification settings, choose which alerts you receive, and manage how PostVolve communicates with you.",
    metaKeywords: ["notifications", "alert settings", "notification preferences", "email notifications", "push notifications"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Customize your notification preferences to stay informed about important events without being overwhelmed. This guide shows you how to configure all notification settings in PostVolve.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Notifications</h2>
        <p className="text-gray-700 mb-4">
          PostVolve can notify you about:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>New Drafts:</strong> When fresh content is ready for review</li>
          <li><strong>Post Published:</strong> Confirmation when posts go live</li>
          <li><strong>Publishing Errors:</strong> Alerts if a post fails to publish</li>
          <li><strong>Account Connections:</strong> When accounts are connected or disconnected</li>
          <li><strong>Plan Updates:</strong> Changes to your subscription</li>
          <li><strong>System Updates:</strong> Important platform announcements</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Configuring Notifications</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Account Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Account</strong></p>
          </li>
          <li>
            <strong>Find Notification Preferences</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Scroll to the notifications section</p>
          </li>
          <li>
            <strong>Toggle Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Enable or disable specific notification types</p>
          </li>
          <li>
            <strong>Choose Delivery Method</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Select email, in-app, or both</p>
          </li>
          <li>
            <strong>Save Changes</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Your preferences are saved automatically</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Notification Frequency</h2>
        <p className="text-gray-700 mb-4">
          You can control how often you receive notifications:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Real-time:</strong> Get notified immediately when events occur</li>
          <li><strong>Daily Digest:</strong> Receive one summary email per day</li>
          <li><strong>Weekly Summary:</strong> Get a weekly overview of activity</li>
          <li><strong>Critical Only:</strong> Only receive alerts for important events</li>
        </ul>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/account-security" className="text-[#6D28D9] hover:underline">Account Security</Link></li>
            <li>• <Link href="/dashboard/help/managing-connected-apps" className="text-[#6D28D9] hover:underline">Managing Connected Apps</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["account-security", "managing-connected-apps"]
  },

  "managing-connected-apps": {
    title: "Managing Connected Apps: Connect, Disconnect, and Troubleshoot",
    category: "Account & Settings",
    description: "Complete guide to managing your connected social media accounts, troubleshooting connection issues, and maintaining secure integrations.",
    metaKeywords: ["connected accounts", "social media connections", "oauth management", "account management", "disconnect accounts"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Managing your connected social media accounts is essential for maintaining a smooth workflow. This guide covers everything from connecting new accounts to troubleshooting issues.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Viewing Connected Accounts</h2>
        <p className="text-gray-700 mb-4">
          To see all your connected accounts:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Go to <strong>Dashboard → Settings</strong></li>
          <li>Scroll to "Connected Accounts" section</li>
          <li>View status of all platforms</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disconnecting Accounts</h2>
        <p className="text-gray-700 mb-4">
          To disconnect an account:
        </p>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Settings</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to Connected Accounts</p>
          </li>
          <li>
            <strong>Find the Account</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Locate the platform you want to disconnect</p>
          </li>
          <li>
            <strong>Click Disconnect</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Confirm the disconnection</p>
          </li>
        </ol>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Disconnecting an account will stop all automated posting to that platform. Scheduled posts will remain in your drafts.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reconnecting Accounts</h2>
        <p className="text-gray-700 mb-4">
          If a connection expires or fails:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Click "Reconnect" next to the account</li>
          <li>You'll be redirected to the platform's authorization page</li>
          <li>Re-authorize PostVolve</li>
          <li>You'll be redirected back with the connection restored</li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Troubleshooting</h2>
        <div className="space-y-4 mb-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Connection Failed</h3>
            <p className="text-gray-700 text-sm">Try clearing browser cache, using a different browser, or checking your internet connection.</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Token Expired</h3>
            <p className="text-gray-700 text-sm">Simply click "Reconnect" to refresh the connection. This usually takes less than 30 seconds.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900 mb-1">Permission Denied</h3>
            <p className="text-gray-700 text-sm">Check that you're logged into the correct account and haven't blocked PostVolve's access.</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/connecting-social-accounts" className="text-[#6D28D9] hover:underline">Connecting Social Accounts</Link></li>
            <li>• <Link href="/dashboard/help/account-security" className="text-[#6D28D9] hover:underline">Account Security</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["connecting-social-accounts", "account-security"]
  },

  "understanding-your-plan": {
    title: "Understanding Your PostVolve Plan: Features and Limits",
    category: "Billing & Plans",
    description: "Learn about PostVolve's pricing tiers, what's included in each plan, usage limits, and how to make the most of your subscription.",
    metaKeywords: ["postvolve plans", "pricing tiers", "subscription plans", "plan features", "usage limits"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          PostVolve offers flexible pricing plans to suit different needs. This guide explains what's included in each plan and how to understand your usage limits.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Plan Tiers</h2>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Starter Plan</h3>
        <p className="text-gray-700 mb-4">
          Perfect for individuals getting started:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Limited monthly posts</li>
          <li>Basic content generation</li>
          <li>Single user</li>
          <li>Standard support</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Professional Plan</h3>
        <p className="text-gray-700 mb-4">
          For serious content creators and small businesses:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Higher monthly post limits</li>
          <li>Advanced features</li>
          <li>Priority support</li>
          <li>Analytics and insights</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Enterprise Plan</h3>
        <p className="text-gray-700 mb-4">
          For teams and agencies:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Unlimited posts</li>
          <li>Team collaboration</li>
          <li>Dedicated support</li>
          <li>Custom features</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding Usage Limits</h2>
        <p className="text-gray-700 mb-4">
          Your plan includes monthly limits for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Post Generation:</strong> Number of AI-generated posts per month</li>
          <li><strong>Platform Connections:</strong> How many social accounts you can connect</li>
          <li><strong>Auto-Posting:</strong> Whether automated posting is available</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Checking Your Usage</h2>
        <p className="text-gray-700 mb-4">
          To see your current usage:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Go to <strong>Dashboard → Billing</strong></li>
          <li>View your usage statistics</li>
          <li>See how many posts you've used this month</li>
          <li>Check when your limits reset</li>
        </ol>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/upgrading-or-downgrading" className="text-[#6D28D9] hover:underline">Upgrading or Downgrading</Link></li>
            <li>• <Link href="/dashboard/help/payment-methods" className="text-[#6D28D9] hover:underline">Payment Methods</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["upgrading-or-downgrading", "payment-methods"]
  },

  "upgrading-or-downgrading": {
    title: "Upgrading or Downgrading Your Plan: Complete Guide",
    category: "Billing & Plans",
    description: "Learn how to change your PostVolve subscription plan, understand prorated billing, and what happens when you upgrade or downgrade.",
    metaKeywords: ["upgrade plan", "downgrade plan", "change subscription", "plan changes", "billing changes"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Your needs may change over time, and PostVolve makes it easy to upgrade or downgrade your plan. This guide explains the process and what to expect.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Change Your Plan</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Billing</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Billing</strong></p>
          </li>
          <li>
            <strong>Click "Change Plan"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Find the plan management section</p>
          </li>
          <li>
            <strong>Select New Plan</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Choose the plan you want</p>
          </li>
          <li>
            <strong>Review Changes</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">See what's included and pricing</p>
          </li>
          <li>
            <strong>Confirm</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Complete the plan change</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Upgrading Your Plan</h2>
        <p className="text-gray-700 mb-4">
          When you upgrade:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>You get immediate access to new features</li>
          <li>Your usage limits increase right away</li>
          <li>You're charged a prorated amount for the remainder of your billing cycle</li>
          <li>Your next billing date remains the same</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Downgrading Your Plan</h2>
        <p className="text-gray-700 mb-4">
          When you downgrade:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Changes take effect at the end of your current billing period</li>
          <li>You keep access to current plan features until then</li>
          <li>You'll receive a credit for the unused portion</li>
          <li>Make sure you're within the limits of your new plan</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> If you downgrade and are currently over the limits of the new plan, you'll need to reduce usage before the downgrade takes effect.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/understanding-your-plan" className="text-[#6D28D9] hover:underline">Understanding Your Plan</Link></li>
            <li>• <Link href="/dashboard/help/payment-methods" className="text-[#6D28D9] hover:underline">Payment Methods</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["understanding-your-plan", "payment-methods"]
  },

  "payment-methods": {
    title: "Payment Methods: Managing Your Billing Information",
    category: "Billing & Plans",
    description: "Learn how to add, update, or remove payment methods, understand billing cycles, and manage your PostVolve subscription payments.",
    metaKeywords: ["payment methods", "billing information", "credit card", "subscription payment", "update payment"],
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Managing your payment methods ensures uninterrupted service. This guide covers everything you need to know about payment management in PostVolve.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Adding a Payment Method</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-6">
          <li>
            <strong>Go to Billing</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Navigate to <strong>Dashboard → Billing</strong></p>
          </li>
          <li>
            <strong>Click "Update Payment"</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Find the payment section</p>
          </li>
          <li>
            <strong>Enter Card Details</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Add your credit or debit card information</p>
          </li>
          <li>
            <strong>Save</strong>
            <p className="text-sm text-gray-600 mt-1 ml-4">Your payment method is securely stored</p>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updating Payment Information</h2>
        <p className="text-gray-700 mb-4">
          To update an existing payment method:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Go to Billing → Payment Methods</li>
          <li>Click "Update" next to your current card</li>
          <li>Enter new card information</li>
          <li>Save changes</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security</h2>
        <p className="text-gray-700 mb-4">
          PostVolve uses industry-standard security:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>All payments are processed through Stripe</li>
          <li>We never store your full card number</li>
          <li>All data is encrypted in transit and at rest</li>
          <li>PCI DSS compliant payment processing</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Billing Cycles</h2>
        <p className="text-gray-700 mb-4">
          PostVolve bills monthly:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li>Billing occurs on the same date each month</li>
          <li>You'll receive an email receipt after each payment</li>
          <li>View billing history in your Billing dashboard</li>
          <li>Download invoices anytime</li>
        </ul>

        <div className="bg-gray-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Related Articles</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• <Link href="/dashboard/help/understanding-your-plan" className="text-[#6D28D9] hover:underline">Understanding Your Plan</Link></li>
            <li>• <Link href="/dashboard/help/upgrading-or-downgrading" className="text-[#6D28D9] hover:underline">Upgrading or Downgrading</Link></li>
          </ul>
        </div>
      </div>
    ),
    relatedArticles: ["understanding-your-plan", "upgrading-or-downgrading"]
  },
};

