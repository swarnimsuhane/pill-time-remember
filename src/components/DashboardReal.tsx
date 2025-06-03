
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
    // Get current hour in IST (India Standard Time)
    const currentTime = new Date();
    const istTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hour = istTime.getHours();
    
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
    <div className={`animate-fade-in ${isMobile ? 'space-y-4 px-2' : 'space-y-8'}`}>
      {/* Welcome Section */}
      <Card className={`${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-r from-white to-pill-light/50 backdrop-blur-sm pill-shadow`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-center md:text-left">
            <h2 className={`font-bold text-pill-navy mb-2 font-montserrat ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              {getGreeting()}
            </h2>
            <p className={`text-pill-navy/70 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {isMobile ? currentTime.toLocaleDateString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              }) : currentDate} • {currentTimeString} IST
            </p>
            {user && (
              <p className={`text-pill-navy/60 mt-1 ${isMobile ? 'text-xs' : ''}`}>
                Welcome back! Time to take care of yourself
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className={`bg-pill-teal rounded-full flex items-center justify-center pill-glow ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <Heart className={`text-pill-navy animate-pulse ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 ${isMobile ? 'gap-2' : 'gap-4'}`}>
        <Card className={`${isMobile ? 'p-3' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`bg-green-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <span className={`text-green-600 font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>{completedToday}</span>
            </div>
            <div>
              <h3 className={`font-semibold text-pill-navy ${isMobile ? 'text-xs' : ''}`}>Completed</h3>
              <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>Medicines taken</p>
            </div>
          </div>
        </Card>

        <Card className={`${isMobile ? 'p-3' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`bg-orange-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <Clock className={`text-orange-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-pill-navy ${isMobile ? 'text-xs' : ''}`}>Pending</h3>
              <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{pendingToday} remaining</p>
            </div>
          </div>
        </Card>

        <Card className={`${isMobile ? 'p-3' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`bg-blue-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <Droplets className={`text-blue-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-pill-navy ${isMobile ? 'text-xs' : ''}`}>Hydration</h3>
              <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{Math.round(hydrationProgress)}% of goal</p>
            </div>
          </div>
        </Card>

        <Card className={`${isMobile ? 'p-3' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`bg-pill-teal rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <span className={`text-pill-navy font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>{todaysMedicines.length}</span>
            </div>
            <div>
              <h3 className={`font-semibold text-pill-navy ${isMobile ? 'text-xs' : ''}`}>Today's Schedule</h3>
              <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{todaysMedicines.length} medicines</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
        <h3 className={`font-semibold text-pill-navy mb-4 font-montserrat ${isMobile ? 'text-lg' : 'text-2xl'}`}>Quick Actions</h3>
        <div className={`grid ${isMobile ? 'grid-cols-3 gap-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'}`}>
          <Button 
            onClick={() => setShowAddMedicine(true)}
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 bg-pill-navy hover:bg-pill-navy/90 text-white transition-all duration-200 hover:scale-105`}
          >
            <Camera className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Add Medicine</span>
          </Button>
          
          <Button 
            onClick={() => setShowSchedule(true)}
            variant="outline" 
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105`}
          >
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Schedule</span>
          </Button>
          
          <Button 
            onClick={() => setShowAIAssistant(true)}
            variant="outline" 
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105`}
          >
            <MessageCircle className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>AI Assistant</span>
          </Button>
          
          <Button 
            onClick={() => setShowDoctorModal(true)}
            variant="outline" 
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105`}
          >
            <Plus className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'Doctor' : 'Add Doctor'}</span>
          </Button>

          <Button 
            onClick={() => setShowHydrationTracker(true)}
            variant="outline" 
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-105`}
          >
            <Droplets className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Hydration</span>
          </Button>

          <Button 
            onClick={() => setShowSymptomChecker(true)}
            variant="outline" 
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 hover:scale-105`}
          >
            <Activity className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Symptoms</span>
          </Button>
        </div>
      </Card>

      {/* Today's Medicines */}
      <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
        <h3 className={`font-semibold text-pill-navy mb-4 font-montserrat ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          Today's Medicines
        </h3>
        <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
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
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <div className={`bg-pill-light rounded-full flex items-center justify-center mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                <Camera className={`text-pill-navy ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
              </div>
              <p className={`text-pill-navy/70 mb-4 ${isMobile ? 'text-sm' : ''}`}>No medicines scheduled for today</p>
              <Button 
                onClick={() => setShowAddMedicine(true)}
                className="bg-pill-navy hover:bg-pill-navy/90"
                size={isMobile ? 'sm' : 'default'}
              >
                Add Your First Medicine
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Health Logs Section */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
        {/* Recent Hydration Logs */}
        <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center justify-between mb-4 ${isMobile ? 'flex-col gap-2' : ''}`}>
            <h3 className={`font-semibold text-pill-navy flex items-center gap-2 ${isMobile ? 'text-base' : 'text-xl'}`}>
              <Droplets className={`text-blue-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              Hydration Logs
            </h3>
            <Button 
              onClick={() => setShowHydrationTracker(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isMobile ? 'Track' : 'Track Water'}
            </Button>
          </div>
          <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
            {hydrationLogs.length > 0 ? (
              hydrationLogs.slice(0, 3).map((log) => (
                <div key={log.id} className={`flex items-center justify-between bg-blue-50 rounded-lg ${isMobile ? 'p-2' : 'p-3'}`}>
                  <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                    <div className={`bg-blue-100 rounded-full flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
                      <Droplets className={`text-blue-600 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </div>
                    <div>
                      <p className={`font-medium text-pill-navy ${isMobile ? 'text-sm' : ''}`}>{log.date}</p>
                      <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{log.liters}L consumed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-blue-600 ${isMobile ? 'text-sm' : 'text-lg'}`}>{Math.round((log.liters / 3) * 100)}%</div>
                    <div className={`text-blue-600/70 ${isMobile ? 'text-xs' : 'text-xs'}`}>of goal</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center ${isMobile ? 'py-3' : 'py-4'}`}>
                <TrendingUp className={`text-blue-400 mx-auto mb-2 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
                <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>No hydration logs yet</p>
                <p className={`text-pill-navy/50 ${isMobile ? 'text-xs' : 'text-xs'}`}>Start tracking your water intake</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Symptom Logs */}
        <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center justify-between mb-4 ${isMobile ? 'flex-col gap-2' : ''}`}>
            <h3 className={`font-semibold text-pill-navy flex items-center gap-2 ${isMobile ? 'text-base' : 'text-xl'}`}>
              <Activity className={`text-red-600 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              Symptom Logs
            </h3>
            <Button 
              onClick={() => setShowSymptomChecker(true)}
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              {isMobile ? 'Log' : 'Log Symptoms'}
            </Button>
          </div>
          <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
            {symptomLogs.length > 0 ? (
              symptomLogs.slice(0, 3).map((log) => (
                <div key={log.id} className={`bg-red-50 rounded-lg ${isMobile ? 'p-2' : 'p-3'}`}>
                  <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
                    <div className={`bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
                      <AlertCircle className={`text-red-600 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium text-pill-navy ${isMobile ? 'text-sm' : ''}`}>{log.date}</p>
                      </div>
                      <p className={`text-pill-navy/80 mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{log.symptoms}</p>
                      <p className={`text-red-700 bg-red-100 p-2 rounded ${isMobile ? 'text-xs' : 'text-xs'}`}>
                        {log.suggestions}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center ${isMobile ? 'py-3' : 'py-4'}`}>
                <AlertCircle className={`text-red-400 mx-auto mb-2 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
                <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>No symptom logs yet</p>
                <p className={`text-pill-navy/50 ${isMobile ? 'text-xs' : 'text-xs'}`}>Track how you're feeling</p>
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
