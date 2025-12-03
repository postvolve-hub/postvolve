import { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  Edit3, 
  SkipForward,
  Image as ImageIcon,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PostCustomizationModal } from "@/components/dashboard/PostCustomizationModal";

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
  Business: "bg-green-100 text-green-700 border-green-200",
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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Generation</h2>
            <p className="text-gray-500 mt-1">Review and customize AI-generated content for your audience.</p>
          </div>
          <Button className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02]">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate More Content
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#6D28D9] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContent.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[post.category]}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="md:w-2/5 p-5 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                    {post.description}
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleEditPost(post)}
                      className="w-full bg-[#6D28D9] hover:bg-[#4C1D95] text-white transition-all duration-300"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Review & Edit Post
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-300"
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Skip / Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content in this category</h3>
            <p className="text-gray-500 mb-6">Generate new content to see posts here.</p>
            <Button className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content
            </Button>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button 
            size="lg"
            className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] px-8"
          >
            <Zap className="h-5 w-5 mr-2" />
            Generate More Content Now
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
