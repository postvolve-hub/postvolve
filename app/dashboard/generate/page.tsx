"use client";

import { useState } from "react";
import { 
  RefreshCw, 
  Edit3, 
  SkipForward,
  Image as ImageIcon,
  Filter,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PostCustomizationModal } from "@/components/dashboard/PostCustomizationModal";

// Custom Icons
const IconSparkles = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    <path d="M19 13l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" />
  </svg>
);

const IconZap = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CATEGORIES = ["All", "Tech", "AI", "Business", "Motivation"];

const MOCK_CONTENT = [
  {
    id: 1,
    title: "The Rise of Autonomous AI Agents",
    category: "AI",
    description: "Discover how AI agents are revolutionizing task automation and decision-making across industries. From customer service to creative workflows, autonomous agents are becoming essential business tools.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    status: "draft",
  },
  {
    id: 2,
    title: "5 Cloud Technologies Transforming Business",
    category: "Tech",
    description: "Cloud computing continues to evolve. Here are the top 5 technologies that will shape enterprise infrastructure in the coming years.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    status: "draft",
  },
  {
    id: 3,
    title: "Building Resilience in Uncertain Times",
    category: "Motivation",
    description: "Success isn't about avoiding challenges—it's about developing the resilience to overcome them. Learn the mindset shifts that separate high performers from the rest.",
    imageUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&h=600&fit=crop",
    status: "draft",
  },
  {
    id: 4,
    title: "Startup Funding: Series A Strategies",
    category: "Business",
    description: "Navigating the path from seed to Series A requires strategic planning. Here's what investors are looking for in 2025.",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop",
    status: "draft",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-purple-100 text-purple-700 border-purple-200",
  Tech: "bg-blue-100 text-blue-700 border-blue-200",
  Business: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Motivation: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function ContentGeneration() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<typeof MOCK_CONTENT[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredContent = selectedCategory === "All" 
    ? MOCK_CONTENT 
    : MOCK_CONTENT.filter(post => post.category === selectedCategory);

  const handleEditPost = (post: typeof MOCK_CONTENT[0]) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div>
            <h2 className="text-xl font-bold text-gray-900">News Card Generation</h2>
            <p className="text-sm text-gray-500 mt-1">Review and customize AI-generated news cards for your audience.</p>
          </div>
          <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <IconSparkles className="h-4 w-4 mr-2" />
            Generate More
          </Button>
        </div>

        {/* Category Filter & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-75">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-[#6D28D9] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-100">
          {filteredContent.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.01] group"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[post.category]}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="md:w-2/5 p-4 flex flex-col">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                    {post.description}
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleEditPost(post)}
                      className="w-full bg-[#6D28D9] hover:bg-[#5B21B6] text-white transition-all duration-200 rounded-xl h-9 text-sm"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-2" />
                      Review & Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 rounded-xl h-9 text-sm"
                    >
                      <SkipForward className="h-3.5 w-3.5 mr-2" />
                      Skip / Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 animate-in fade-in duration-300">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-gray-900 mb-2">No content in this category</h3>
            <p className="text-sm text-gray-500 mb-6">Generate new news cards to see posts here.</p>
            <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl">
              <IconSparkles className="h-4 w-4 mr-2" />
              Generate News Cards
            </Button>
          </div>
        )}

        {/* Generate More CTA */}
        <div className="flex justify-center pt-4 animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <Button 
            size="lg"
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-sm hover:shadow-md transition-all duration-200 px-8 rounded-xl"
          >
            <IconZap className="h-4 w-4 mr-2" />
            Generate More News Cards
          </Button>
        </div>
      </div>

      <PostCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />
    </DashboardLayout>
  );
}
