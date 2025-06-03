
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Camera, Calendar, MessageCircle, Plus, Clock, Droplets, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import MedicineCardReal from '@/components/MedicineCardReal';
import AddMedicineModalReal from '@/components/AddMedicineModalReal';
import ScheduleModal from '@/components/ScheduleModal';
import AIAssistant from '@/components/AIAssistant';
import DoctorModal from '@/components/DoctorModal';
import HydrationTracker from '@/components/HydrationTracker';
import SymptomChecker from '@/components/SymptomChecker';
import { useMedicines } from '@/hooks/useMedicines';
import { useHydration } from '@/hooks/useHydration';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useAuth } from '@/contexts/AuthContext';

const DashboardReal = () => {
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showHydrationTracker, setShowHydrationTracker] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  
  const { medicines, loading: medicinesLoading, deleteMedicine } = useMedicines();
  const { logs: hydrationLogs, loading: hydrationLoading } = useHydration();
  const { logs: symptomLogs, loading: symptomsLoading } = useSymptoms();
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
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌆";
  };

  // Filter today's medicines
  const today = new Date().toISOString().split('T')[0];
  const todaysMedicines = medicines.filter(med => med.date === today);
  const completedToday = todaysMedicines.filter(med => med.taken).length;
  const pendingToday = todaysMedicines.filter(med => !med.taken).length;

  // Get today's hydration
  const todaysHydration = hydrationLogs.find(log => log.date === today);
  const hydrationGoal = 3; // 3L daily goal
  const hydrationProgress = todaysHydration ? (todaysHydration.liters / hydrationGoal) * 100 : 0;

  console.log('Dashboard data:', {
    medicines: medicines.length,
    todaysMedicines: todaysMedicines.length,
    hydrationLogs: hydrationLogs.length,
    symptomLogs: symptomLogs.length,
    loading: { medicinesLoading, hydrationLoading, symptomsLoading }
  });

  if (medicinesLoading || hydrationLoading || symptomsLoading) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-pill-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pill-navy/70">Loading your health dashboard...</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">{completedToday}</span>
            </div>
            <div>
              <h3 className="font-semibold text-pill-navy">Completed</h3>
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
              <h3 className="font-semibold text-pill-navy">Pending</h3>
              <p className="text-pill-navy/70 text-sm">{pendingToday} remaining</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-pill-navy">Hydration</h3>
              <p className="text-pill-navy/70 text-sm">{Math.round(hydrationProgress)}% of goal</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pill-teal rounded-full flex items-center justify-center">
              <span className="text-pill-navy font-bold text-lg">{todaysMedicines.length}</span>
            </div>
            <div>
              <h3 className="font-semibold text-pill-navy">Today's Schedule</h3>
              <p className="text-pill-navy/70 text-sm">{todaysMedicines.length} medicines</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
        <h3 className="text-2xl font-semibold text-pill-navy mb-6 font-montserrat">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

          <Button 
            onClick={() => setShowHydrationTracker(true)}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Droplets className="w-6 h-6" />
            <span className="text-sm">Hydration</span>
          </Button>

          <Button 
            onClick={() => setShowSymptomChecker(true)}
            variant="outline" 
            className="h-20 flex flex-col gap-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-105"
          >
            <Activity className="w-6 h-6" />
            <span className="text-sm">Symptoms</span>
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

      {/* Health Logs Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Hydration Logs */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-pill-navy flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              Hydration Logs
            </h3>
            <Button 
              onClick={() => setShowHydrationTracker(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Track Water
            </Button>
          </div>
          <div className="space-y-3">
            {hydrationLogs.length > 0 ? (
              hydrationLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-pill-navy">{log.date}</p>
                      <p className="text-sm text-pill-navy/70">{log.liters}L consumed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{Math.round((log.liters / 3) * 100)}%</div>
                    <div className="text-xs text-blue-600/70">of goal</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-pill-navy/70 text-sm">No hydration logs yet</p>
                <p className="text-pill-navy/50 text-xs">Start tracking your water intake</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Symptom Logs */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm pill-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-pill-navy flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Symptom Logs
            </h3>
            <Button 
              onClick={() => setShowSymptomChecker(true)}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Log Symptoms
            </Button>
          </div>
          <div className="space-y-3">
            {symptomLogs.length > 0 ? (
              symptomLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-pill-navy">{log.date}</p>
                      </div>
                      <p className="text-sm text-pill-navy/80 mb-2">{log.symptoms}</p>
                      <p className="text-xs text-red-700 bg-red-100 p-2 rounded">
                        {log.suggestions}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-pill-navy/70 text-sm">No symptom logs yet</p>
                <p className="text-pill-navy/50 text-xs">Track how you're feeling</p>
              </div>
            )}
          </div>
        </Card>
      </div>

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
      <HydrationTracker 
        isOpen={showHydrationTracker} 
        onClose={() => setShowHydrationTracker(false)} 
      />
      <SymptomChecker 
        isOpen={showSymptomChecker} 
        onClose={() => setShowSymptomChecker(false)} 
      />
    </div>
  );
};

export default DashboardReal;
