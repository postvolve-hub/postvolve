import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-foreground py-12 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              Post<span className="text-primary">Volve</span>
            </span>
            <p className="text-gray-400 mt-2 text-sm">Automating authority for the modern web.</p>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          &copy; 2025 PostVolve Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
