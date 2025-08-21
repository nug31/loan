import React from 'react';
import { Instagram, MessageCircle, Globe, Heart, Code, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Developer Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <Code size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-400">NUG</h3>
                <p className="text-xs text-gray-300">Full Stack Developer</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Passionate developer creating innovative solutions with modern technologies. 
              Specialized in React, Node.js, and mobile applications.
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center justify-center space-x-2">
              <MessageCircle size={18} />
              <span>Get In Touch</span>
            </h4>
            <div className="space-y-3">
              <a 
                href="https://wa.me/6281316052316" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg group"
              >
                <MessageCircle size={16} />
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-xs bg-green-500 px-2 py-1 rounded-full group-hover:bg-green-400 transition-colors">
                  Fast Response
                </span>
              </a>
              
              <a 
                href="https://instagram.com/j.s_nugroho" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Instagram size={16} />
                <span className="text-sm font-medium">@j.s_nugroho</span>
              </a>
            </div>
          </div>

          {/* Portfolio */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center justify-center md:justify-end space-x-2">
              <Globe size={18} />
              <span>Portfolio</span>
            </h4>
            <a 
              href="https://jsnugroho.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center space-x-2">
                <Globe size={18} />
                <span className="font-semibold">jsnugroho.com</span>
              </div>
              <p className="text-xs mt-1 opacity-90 group-hover:opacity-100">
                View My Latest Projects
              </p>
            </a>
            
            {/* Skills */}
            <div className="mt-4">
              <div className="flex flex-wrap justify-center md:justify-end gap-2">
                {['React', 'TypeScript', 'Node.js', 'Laravel'].map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-xs rounded-full transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-600 pt-6">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>© 2024 LoanMitra.</span>
              <span>Developed with</span>
              <Heart size={14} className="text-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-semibold text-orange-400">NUG</span>
            </div>

            {/* Rating/Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-300 ml-2">5.0 Rating</span>
              </div>
              
              <div className="text-xs text-gray-400 border-l border-slate-600 pl-4">
                <span>Made in Indonesia 🇮🇩</span>
              </div>
            </div>
          </div>

          {/* Fun Quote */}
          <div className="text-center mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-gray-400 italic">
              "Code is poetry in motion, bugs are just unexpected plot twists." - NUG
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </footer>
  );
};
