
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pill, Camera, Calendar, MessageCircle, Plus, Heart } from 'lucide-react';
import QuickStats from '@/components/QuickStats';
import UpcomingReminders from '@/components/UpcomingReminders';
import AIAssistant from '@/components/AIAssistant';
import DoctorModal from '@/components/DoctorModal';

const Dashboard = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Section */}
      <Card className="p-8 bg-gradient-to-r from-white to-pill-light/50 backdrop-blur-sm pill-shadow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold text-pill-navy mb-2 font-montserrat">
              Good Morning! 🌅
            </h2>
            <p className="text-pill-navy/70 text-lg">
              Today is June 1, 2025 • It's time to take care of yourself
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-pill-teal rounded-full flex items-center justify-center pill-glow">
              <Heart className="w-8 h-8 text-pill-navy animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <QuickStats />

      {/* Quick Actions */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
        <h3 className="text-2xl font-semibold text-pill-navy mb-6 font-montserrat">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => setShowAIAssistant(true)}
            className="h-20 flex flex-col gap-2 bg-pill-navy hover:bg-pill-navy/90 text-white transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm">AI Assistant</span>
          </Button>
          
          <Button 
            onClick={() => setShowDoctorModal(true)}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Add Doctor</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Heart className="w-6 h-6" />
            <span className="text-sm">Health Tips</span>
          </Button>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Health Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
            <h3 className="text-2xl font-semibold text-pill-navy mb-6 font-montserrat">
              Health Overview
            </h3>
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-pill-navy/30 mx-auto mb-4" />
              <p className="text-pill-navy/70 text-lg mb-2">Welcome to Pill Time!</p>
              <p className="text-pill-navy/50">Your health management companion</p>
            </div>
          </Card>
        </div>

        {/* Upcoming Reminders */}
        <div>
          <UpcomingReminders />
        </div>
      </div>

      {/* Modals */}
      <AIAssistant 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
      <DoctorModal 
        isOpen={showDoctorModal} 
        onClose={() => setShowDoctorModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
