"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  const lastUpdated = "December 3, 2024";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <main className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
              <p>
                Welcome to PostVolve. This Privacy Policy explains how we collect, use, and protect your information when you use our service. By using PostVolve, you agree to the practices described in this policy.
              </p>
              <p>
                If you have any questions, please contact us at <a href="mailto:support@postvolve.com" className="text-primary hover:underline">support@postvolve.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
              <p>When you use PostVolve, we may collect the following information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Account Information:</strong> Your name, email address, and password when you create an account.</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through our payment provider.</li>
                <li><strong>Content Preferences:</strong> Your selected platforms, content categories, and posting schedules.</li>
                <li><strong>Usage Data:</strong> Information about how you use our features to improve the service.</li>
                <li><strong>Social Account Data:</strong> When you connect social accounts, we access necessary permissions to post on your behalf.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide and maintain our service</li>
                <li>Generate and publish content on your connected social accounts</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service updates and notifications</li>
                <li>Improve our platform based on usage patterns</li>
                <li>Respond to your support requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Data Sharing</h2>
              <p>
                We do not sell your personal information. We only share your data with third-party services necessary to operate PostVolve, such as payment processors and social media platforms you choose to connect.
              </p>
              <p>
                We may also disclose information when required by law or to protect the safety of our users and platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your information, including encryption for data in transit and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Access and download your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at <a href="mailto:privacy@postvolve.com" className="text-primary hover:underline">privacy@postvolve.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                We use cookies to keep you logged in and remember your preferences. You can manage cookie settings in your browser, though disabling essential cookies may affect the service's functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Children's Privacy</h2>
              <p>
                PostVolve is not intended for users under 18 years of age. We do not knowingly collect information from minors. If you believe a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the service. Your continued use of PostVolve after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:support@postvolve.com" className="text-primary hover:underline">support@postvolve.com</a>
              </p>
            </section>

          </div>

          {/* Bottom Link */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              See also: <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
