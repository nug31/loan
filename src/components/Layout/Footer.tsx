import React from 'react';
import { Instagram, MessageCircle, Heart, User } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-r from-gray-50 via-white to-gray-50 text-gray-800 mt-auto overflow-hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Developer Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <User size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-orange-500">NUG</h3>
              <p className="text-sm text-gray-600">Engineer & Full Stack Developer</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-2 text-orange-600 font-semibold mb-2 sm:mb-0">
              <MessageCircle size={18} />
              <span>Get In Touch</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://wa.me/6281316052316" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg group"
              >
                <MessageCircle size={16} />
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-xs bg-green-500 px-2 py-1 rounded-full group-hover:bg-green-400 transition-colors">
                  Fast
                </span>
              </a>
              
              <a 
                href="https://instagram.com/j.s_nugroho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Instagram size={16} />
                <span className="text-sm font-medium">@j.s_nugroho</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-6">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>© 2025 SmartLend.</span>
              <span>Developed with</span>
              <Heart size={14} className="text-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-semibold text-orange-600">NUG</span>
            </div>
          </div>

          {/* Fun Quote */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              "Code is poetry in motion, bugs are just unexpected plot twists." - NUG
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </footer>
  );
};
