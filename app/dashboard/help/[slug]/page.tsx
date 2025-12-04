"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARTICLES } from "../articles-data";

export default function HelpArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = ARTICLES[slug];

  if (!article) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/dashboard/help">
              <Button>Back to Help Center</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        {/* Back Button */}
        <Link href="/dashboard/help">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{article.category}</span>
            <span>•</span>
            <span>Help Center</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-lg text-gray-600">{article.description}</p>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          {article.content}
        </div>

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {article.relatedArticles.map((relatedSlug) => {
                const related = ARTICLES[relatedSlug];
                if (!related) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={`/dashboard/help/${relatedSlug}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#6D28D9] hover:bg-[#6D28D9]/5 transition-all"
                  >
                    <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">{related.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

