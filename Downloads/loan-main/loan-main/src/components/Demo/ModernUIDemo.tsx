import React, { useState } from 'react';
import { Button, FloatingActionButton } from '../UI/Button';
import { 
  Sparkles, 
  Zap, 
  Star, 
  Heart, 
  Rocket, 
  Plus,
  Search,
  Settings,
  Bell
} from 'lucide-react';

export const ModernUIDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('buttons');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-300 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text-cyber">
            Modern UI Demo
          </h1>
          <p className="text-xl text-secondary-300 animate-slide-up">
            Experience the new cyber-themed interface with stunning animations
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
          {['buttons', 'cards', 'animations'].map((demo) => (
            <button
              key={demo}
              onClick={() => setActiveDemo(demo)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 mobile-bounce ${
                activeDemo === demo
                  ? 'bg-gradient-cyber text-white shadow-glow-cyber'
                  : 'glass text-primary-300 hover:text-white hover:shadow-glow'
              }`}
            >
              {demo.charAt(0).toUpperCase() + demo.slice(1)}
            </button>
          ))}
        </div>

        {/* Buttons Demo */}
        {activeDemo === 'buttons' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center gradient-text">Button Variants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Buttons */}
              <div className="glass-cyber p-6 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold text-primary-300 mb-4">Primary Buttons</h3>
                <Button variant="primary" icon={<Star />} className="w-full">
                  Primary
                </Button>
                <Button variant="primary" size="lg" glow className="w-full">
                  Primary Large
                </Button>
              </div>

              {/* Cyber Buttons */}
              <div className="glass-cyber p-6 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold text-gradient-cyber-blue mb-4">Cyber Theme</h3>
                <Button variant="cyber" icon={<Zap />} className="w-full">
                  Cyber Button
                </Button>
                <Button variant="neon" size="lg" icon={<Sparkles />} className="w-full">
                  Neon Glow
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="glass-cyber p-6 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold text-gradient-mint-green mb-4">Action Buttons</h3>
                <Button variant="success" icon={<Heart />} className="w-full">
                  Success
                </Button>
                <Button variant="danger" size="lg" icon={<Rocket />} className="w-full">
                  Danger
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cards Demo */}
        {activeDemo === 'cards' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center gradient-text">Interactive Cards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item}
                  className="glass-cyber p-6 rounded-3xl card-mobile-cyber hover:shadow-glow-cyber cursor-pointer group animate-scale-in"
                  style={{ animationDelay: `${item * 0.1}s` }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-cyber rounded-2xl flex items-center justify-center animate-float-smooth group-hover:animate-bounce-gentle">
                      <Sparkles className="text-white" size={32} />
                    </div>
                    <h3 className="text-lg font-bold gradient-text-cyber">Card {item}</h3>
                    <p className="text-secondary-300">
                      Interactive card with hover effects and smooth animations
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animations Demo */}
        {activeDemo === 'animations' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center gradient-text">Animation Showcase</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Floating Elements */}
              <div className="glass-cyber p-8 rounded-3xl text-center space-y-6">
                <h3 className="text-xl font-bold gradient-text-cyber">Floating Elements</h3>
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-cyber rounded-full flex items-center justify-center animate-float-smooth shadow-glow-cyber">
                    <Star className="text-white animate-wiggle" size={40} />
                  </div>
                  <div className="w-16 h-16 mx-auto bg-gradient-neon rounded-2xl flex items-center justify-center animate-bounce-gentle shadow-glow-purple">
                    <Heart className="text-white" size={32} />
                  </div>
                </div>
              </div>

              {/* Pulse Effects */}
              <div className="glass-cyber p-8 rounded-3xl text-center space-y-6">
                <h3 className="text-xl font-bold gradient-text-cyber">Pulse & Glow</h3>
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gradient-mint-green to-emerald-600 rounded-full flex items-center justify-center animate-pulse-glow shadow-glow-green">
                    <Zap className="text-white" size={40} />
                  </div>
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-gradient-cyber-blue to-gradient-neon-purple rounded-2xl animate-pulse-glow shadow-glow-cyber">
                    <span className="text-white font-bold">Pulsing Badge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient Text Examples */}
            <div className="glass-cyber p-8 rounded-3xl text-center space-y-6">
              <h3 className="text-xl font-bold gradient-text-cyber">Animated Text</h3>
              <div className="space-y-4">
                <h4 className="text-3xl font-bold gradient-text animate-gradient-shift">
                  Gradient Animated Text
                </h4>
                <h4 className="text-2xl font-bold gradient-text-cyber">
                  Cyber Theme Text
                </h4>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Demo */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0">
          <div className="mobile-nav-cyber mobile-shadow-cyber">
            <div className="flex items-center justify-between px-4 py-3">
              {[
                { icon: Search, label: 'Search' },
                { icon: Bell, label: 'Notifications' },
                { icon: Settings, label: 'Settings' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center justify-center p-3 rounded-3xl mobile-bounce touch-target glass hover:shadow-glow group min-w-[64px] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-3xl"></div>
                  
                  <div className="relative mb-2 z-10">
                    <item.icon 
                      size={24} 
                      className="text-primary-400 group-hover:scale-110 group-hover:drop-shadow-md hover:brightness-125 transition-all duration-500 animate-float-smooth"
                      strokeWidth={2.2}
                    />
                  </div>
                  
                  <span className="text-xs font-bold text-primary-400 group-hover:drop-shadow-sm group-hover:brightness-125 transition-all duration-500 truncate z-10 animate-fade-in">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="pb-safe mobile-nav-cyber"></div>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton 
          icon={<Plus />}
          variant="cyber"
        />

      </div>
    </div>
  );
};