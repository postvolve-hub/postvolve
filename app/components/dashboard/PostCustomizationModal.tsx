"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Post {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  status: string;
}

interface PostCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

const MAX_CHARACTERS = 280;

export function PostCustomizationModal({ isOpen, onClose, post }: PostCustomizationModalProps) {
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    if (post) {
      setPostTitle(post.title);
      setPostContent(post.description);
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const characterCount = postContent.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Customize Post</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-100">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Post Title
                </Label>
                <Input
                  id="title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full border-gray-300 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Post Content
                  </Label>
                  <span className={`text-sm ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {characterCount}/{MAX_CHARACTERS}
                  </span>
                </div>
                <Textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className={`w-full min-h-[120px] border-gray-300 focus:ring-[#6D28D9] focus:border-[#6D28D9] resize-none ${
                    isOverLimit ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Write your post content..."
                />
                {isOverLimit && (
                  <p className="text-sm text-red-500 mt-1">
                    Content exceeds the character limit
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.category === 'AI' ? 'bg-purple-100 text-purple-700' :
                  post.category === 'Tech' ? 'bg-blue-100 text-blue-700' :
                  post.category === 'Business' ? 'bg-green-100 text-green-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {post.category}
                </div>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-600">LinkedIn, Twitter</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              className="bg-[#6D28D9] hover:bg-[#4C1D95] text-white shadow-md transition-all duration-300"
              disabled={isOverLimit}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

