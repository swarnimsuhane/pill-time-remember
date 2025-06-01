import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Pill, Camera, Calendar, MessageCircle, Plus, Heart } from 'lucide-react';
import MedicineCard from '@/components/MedicineCard';
import QuickStats from '@/components/QuickStats';
import UpcomingReminders from '@/components/UpcomingReminders';
import AddMedicineModal from '@/components/AddMedicineModal';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const { toast } = useToast();

  const handleScheduleClick = () => {
    toast({
      title: "Schedule Feature",
      description: "Medication scheduling will be available soon!",
    });
  };

  const handleAIAssistant = () => {
    toast({
      title: "AI Assistant",
      description: "Ask me anything about your medications! This feature is coming soon.",
    });
  };

  const handleAddDoctor = () => {
    toast({
      title: "Add Doctor",
      description: "Doctor management feature will be available in the next update!",
    });
  };

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => setShowAddMedicine(true)}
            className="h-20 flex flex-col gap-2 bg-pill-navy hover:bg-pill-navy/90 text-white transition-all duration-200 hover:scale-105"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Add Medicine</span>
          </Button>
          
          <Button 
            onClick={handleScheduleClick}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Schedule</span>
          </Button>
          
          <Button 
            onClick={handleAIAssistant}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm">AI Assistant</span>
          </Button>
          
          <Button 
            onClick={handleAddDoctor}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Add Doctor</span>
          </Button>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Medicines */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
            <h3 className="text-2xl font-semibold text-pill-navy mb-6 font-montserrat">
              Today's Medicines
            </h3>
            <div className="space-y-4">
              <MedicineCard 
                name="Vitamin D3"
                time="09:00 AM"
                dosage="1 tablet"
                status="pending"
              />
              <MedicineCard 
                name="Omega-3"
                time="02:00 PM"
                dosage="2 capsules"
                status="taken"
              />
              <MedicineCard 
                name="Calcium"
                time="08:00 PM"
                dosage="1 tablet"
                status="pending"
              />
            </div>
          </Card>
        </div>

        {/* Upcoming Reminders */}
        <div>
          <UpcomingReminders />
        </div>
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal 
        isOpen={showAddMedicine} 
        onClose={() => setShowAddMedicine(false)} 
      />
    </div>
  );
};

export default Dashboard;
