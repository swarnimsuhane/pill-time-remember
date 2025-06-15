
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Heart, Calendar, MessageCircle, Plus, Clock, Droplets, Activity, TrendingUp, AlertCircle, Pill, Stethoscope, Phone, User, Menu, Bell, Settings } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import DoctorModal from '@/components/DoctorModal';
import HydrationTracker from '@/components/HydrationTracker';
import SymptomChecker from '@/components/SymptomChecker';
import AddMedicineModal from '@/components/AddMedicineModal';
import MedicineCard from '@/components/MedicineCard';
import AppSidebar from '@/components/AppSidebar';
import { useHydration } from '@/hooks/useHydration';
import { useSymptoms } from '@/hooks/useSymptoms';
import { useMedicines } from '@/hooks/useMedicines';
import { useDoctors } from '@/hooks/useDoctors';
import { useHealthScore } from '@/hooks/useHealthScore';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardReal = () => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showHydrationTracker, setShowHydrationTracker] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  const [currentFeature, setCurrentFeature] = useState('dashboard');
  
  const { logs: hydrationLogs, loading: hydrationLoading } = useHydration();
  const { logs: symptomLogs, loading: symptomsLoading } = useSymptoms();
  const { medicines, loading: medicinesLoading, deleteMedicine } = useMedicines();
  const { doctors, loading: doctorsLoading } = useDoctors();
  const healthScore = useHealthScore();
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

  // Get today's hydration
  const today = new Date().toISOString().split('T')[0];
  const todaysHydration = hydrationLogs.find(log => log.date === today);
  const hydrationGoal = 3; // 3L daily goal
  const hydrationProgress = todaysHydration ? (todaysHydration.liters / hydrationGoal) * 100 : 0;

  console.log('Dashboard data:', {
    hydrationLogs: hydrationLogs.length,
    symptomLogs: symptomLogs.length,
    loading: { hydrationLoading, symptomsLoading }
  });

  if (hydrationLoading || symptomsLoading || medicinesLoading || doctorsLoading) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-pill-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pill-navy/70">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  const handleFeatureSelect = (feature: string) => {
    setCurrentFeature(feature);
    
    // Handle feature navigation
    switch (feature) {
      case 'ai-assistant':
        setShowAIAssistant(true);
        break;
      case 'medicines':
        setShowAddMedicineModal(true);
        break;
      case 'doctors':
        setShowDoctorModal(true);
        break;
      case 'hydration':
        setShowHydrationTracker(true);
        break;
      case 'symptoms':
        setShowSymptomChecker(true);
        break;
      case 'notifications':
        // TODO: Implement notifications
        break;
      case 'health-score':
        // TODO: Show detailed health score
        break;
      case 'appointments':
        // TODO: Show appointments view
        break;
      case 'profile':
        // TODO: Show profile modal
        break;
      case 'settings':
        // TODO: Show settings modal
        break;
      default:
        // Dashboard is the default view
        break;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          onFeatureSelect={handleFeatureSelect}
          currentFeature={currentFeature}
        />
        <SidebarInset className="flex-1">
          <div className="flex items-center justify-between p-4 border-b border-pill-navy/10 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-8 w-8 bg-pill-navy hover:bg-pill-navy/90 text-white rounded-md transition-colors duration-200" />
              <h1 className="font-semibold text-pill-navy text-lg">
                {currentFeature === 'dashboard' ? 'Health Dashboard' : 
                 currentFeature.charAt(0).toUpperCase() + currentFeature.slice(1).replace('-', ' ')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-pill-navy/20 text-pill-navy hover:bg-pill-navy hover:text-white"
              >
                <Bell className="w-4 h-4" />
                {!isMobile && <span className="ml-1">Notifications</span>}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-pill-navy/20 text-pill-navy hover:bg-pill-navy hover:text-white"
              >
                <Settings className="w-4 h-4" />
                {!isMobile && <span className="ml-1">Settings</span>}
              </Button>
            </div>
          </div>
          <div className={`animate-fade-in ${isMobile ? 'space-y-4 px-2 py-4' : 'space-y-8 p-8'}`}>
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
      <div className={`grid grid-cols-2 md:grid-cols-3 ${isMobile ? 'gap-2' : 'gap-4'}`}>
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
            <div className={`bg-red-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <Activity className={`text-red-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-pill-navy ${isMobile ? 'text-xs' : ''}`}>Symptoms</h3>
              <p className={`text-pill-navy/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>{symptomLogs.length} logged</p>
            </div>
          </div>
        </Card>

        <Card className={`${isMobile ? 'p-3' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
          <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`bg-pill-teal rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <Heart className={`text-pill-navy ${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-pill-navy ${isMobile ? 'text-xs' : ''}`}>Health Score</h3>
              <p className={`${healthScore.color} font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {healthScore.rating} ({healthScore.score}/100)
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
        <h3 className={`font-semibold text-pill-navy mb-4 font-montserrat ${isMobile ? 'text-lg' : 'text-2xl'}`}>Quick Actions</h3>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
          <Button 
            onClick={() => setShowAIAssistant(true)}
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 bg-pill-navy hover:bg-pill-navy/90 text-white transition-all duration-200 hover:scale-105`}
          >
            <MessageCircle className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>AI Assistant</span>
          </Button>
          
          <Button 
            onClick={() => setShowAddMedicineModal(true)}
            variant="outline" 
            className={`${isMobile ? 'h-16' : 'h-20'} flex flex-col gap-1 border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-105`}
          >
            <Pill className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{isMobile ? 'Medicine' : 'Add Medicine'}</span>
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
        </div>
      </Card>

      {/* Medicine Schedule */}
      <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
        <h3 className={`font-semibold text-pill-navy mb-4 font-montserrat ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          Medicine Schedule
        </h3>
        {medicines.length === 0 ? (
          <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
            <Pill className={`text-pill-navy/30 mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
            <p className={`text-pill-navy/70 mb-2 ${isMobile ? 'text-sm' : 'text-lg'}`}>No medicines scheduled</p>
            <p className={`text-pill-navy/50 mb-4 ${isMobile ? 'text-xs' : ''}`}>Add your first medicine to get started</p>
            <Button 
              onClick={() => setShowAddMedicineModal(true)}
              className="bg-pill-navy hover:bg-pill-navy/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {medicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onEdit={(medicine) => {
                  setEditingMedicine(medicine);
                  setShowAddMedicineModal(true);
                }}
                onDelete={deleteMedicine}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Doctors Section */}
      <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-white/90 backdrop-blur-sm pill-shadow`}>
        <div className={`flex items-center justify-between mb-4 ${isMobile ? 'flex-col gap-2' : ''}`}>
          <h3 className={`font-semibold text-pill-navy flex items-center gap-2 font-montserrat ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            <Stethoscope className={`text-pill-navy ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            Your Doctors
          </h3>
          <Button 
            onClick={() => setShowDoctorModal(true)}
            size="sm"
            className="bg-pill-navy hover:bg-pill-navy/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            {isMobile ? 'Add' : 'Add Doctor'}
          </Button>
        </div>
        
        {doctors.length === 0 ? (
          <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
            <User className={`text-pill-navy/30 mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
            <p className={`text-pill-navy/70 mb-2 ${isMobile ? 'text-sm' : 'text-lg'}`}>No doctors added</p>
            <p className={`text-pill-navy/50 mb-4 ${isMobile ? 'text-xs' : ''}`}>Add your healthcare providers to track appointments</p>
            <Button 
              onClick={() => setShowDoctorModal(true)}
              className="bg-pill-navy hover:bg-pill-navy/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            {doctors.map((doctor) => (
              <div key={doctor.id} className={`bg-pill-light/30 rounded-lg border border-pill-navy/10 ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'}`}>
                  <div className={`bg-pill-teal rounded-full flex items-center justify-center flex-shrink-0 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
                    <Stethoscope className={`text-pill-navy ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-pill-navy mb-1 ${isMobile ? 'text-sm' : ''}`}>{doctor.name}</h4>
                    <p className={`text-pill-navy/70 mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{doctor.speciality}</p>
                    
                    {doctor.contact && (
                      <div className={`flex items-center gap-1 text-pill-navy/60 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <Phone className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        <span>{doctor.contact}</span>
                      </div>
                    )}
                    
                    {doctor.appointment_date && (
                      <div className={`flex items-center gap-1 text-pill-navy/60 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <Calendar className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        <span>Next: {new Date(doctor.appointment_date).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
      <AddMedicineModal
        isOpen={showAddMedicineModal}
        onClose={() => {
          setShowAddMedicineModal(false);
          setEditingMedicine(null);
        }}
        editMedicine={editingMedicine}
      />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardReal;
