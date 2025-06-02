
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Camera, Calendar, MessageCircle, Plus, Clock } from 'lucide-react';
import MedicineCardReal from '@/components/MedicineCardReal';
import AddMedicineModalReal from '@/components/AddMedicineModalReal';
import ScheduleModal from '@/components/ScheduleModal';
import AIAssistant from '@/components/AIAssistant';
import DoctorModal from '@/components/DoctorModal';
import { useMedicines } from '@/hooks/useMedicines';
import { useAuth } from '@/contexts/AuthContext';

const DashboardReal = () => {
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  
  const { medicines, loading, deleteMedicine } = useMedicines();
  const { user } = useAuth();

  const currentTime = new Date();
  const currentTimeString = currentTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit'
  });
  const currentDate = currentTime.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌆";
  };

  // Filter today's medicines
  const today = new Date().toISOString().split('T')[0];
  const todaysMedicines = medicines.filter(med => med.date === today);
  const completedToday = todaysMedicines.filter(med => med.taken).length;
  const pendingToday = todaysMedicines.filter(med => !med.taken).length;

  if (loading) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-pill-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pill-navy/70">Loading your medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Section */}
      <Card className="p-8 bg-gradient-to-r from-white to-pill-light/50 backdrop-blur-sm pill-shadow">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold text-pill-navy mb-2 font-montserrat">
              {getGreeting()}
            </h2>
            <p className="text-pill-navy/70 text-lg">
              {currentDate} • {currentTimeString} IST
            </p>
            {user && (
              <p className="text-pill-navy/60 mt-1">
                Welcome back! Time to take care of yourself
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-pill-teal rounded-full flex items-center justify-center pill-glow">
              <Heart className="w-8 h-8 text-pill-navy animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">{completedToday}</span>
            </div>
            <div>
              <h3 className="font-semibold text-pill-navy">Completed Today</h3>
              <p className="text-pill-navy/70 text-sm">Medicines taken</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-pill-navy">Pending Today</h3>
              <p className="text-pill-navy/70 text-sm">{pendingToday} medicines remaining</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pill-teal rounded-full flex items-center justify-center">
              <span className="text-pill-navy font-bold text-lg">{medicines.length}</span>
            </div>
            <div>
              <h3 className="font-semibold text-pill-navy">Total Medicines</h3>
              <p className="text-pill-navy/70 text-sm">In your schedule</p>
            </div>
          </div>
        </Card>
      </div>

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
            onClick={() => setShowSchedule(true)}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Schedule</span>
          </Button>
          
          <Button 
            onClick={() => setShowAIAssistant(true)}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105"
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
        </div>
      </Card>

      {/* Today's Medicines */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
        <h3 className="text-2xl font-semibold text-pill-navy mb-6 font-montserrat">
          Today's Medicines
        </h3>
        <div className="space-y-4">
          {todaysMedicines.length > 0 ? (
            todaysMedicines.map((medicine) => (
              <MedicineCardReal
                key={medicine.id}
                id={medicine.id}
                name={medicine.name}
                time={medicine.time}
                dosage={medicine.dosage}
                taken={medicine.taken}
                onDelete={() => deleteMedicine(medicine.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-pill-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-pill-navy" />
              </div>
              <p className="text-pill-navy/70 mb-4">No medicines scheduled for today</p>
              <Button 
                onClick={() => setShowAddMedicine(true)}
                className="bg-pill-navy hover:bg-pill-navy/90"
              >
                Add Your First Medicine
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Modals */}
      <AddMedicineModalReal 
        isOpen={showAddMedicine} 
        onClose={() => setShowAddMedicine(false)} 
      />
      <ScheduleModal 
        isOpen={showSchedule} 
        onClose={() => setShowSchedule(false)} 
      />
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

export default DashboardReal;
