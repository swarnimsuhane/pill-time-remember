
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import Header from '@/components/Header';
import LoadingAnimation from '@/components/LoadingAnimation';
import DashboardReal from '@/components/DashboardReal';
import SettingsModal from '@/components/SettingsModal';
import ProfileModal from '@/components/ProfileModal';
import NotificationsPanel from '@/components/NotificationsPanel';
import AuthPage from '@/components/AuthPage';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState<'notifications' | 'timezone'>('notifications');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalType, setProfileModalType] = useState<'personal' | 'medical'>('personal');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading animation first
  if (showLoading) {
    return <LoadingAnimation />;
  }

  // Show auth page if not authenticated
  if (!authLoading && !user) {
    return <AuthPage />;
  }

  // Show loading if still checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pill-light to-pill-teal flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pill-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSettingsClick = (type: 'notifications' | 'timezone') => {
    setSettingsModalType(type);
    setShowSettingsModal(true);
  };

  const handleProfileClick = (type: 'personal' | 'medical') => {
    setProfileModalType(type);
    setShowProfileModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pill-light to-pill-teal">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onNotificationClick={() => setShowNotifications(true)}
      />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && <DashboardReal />}
          
          {currentView === 'profile' && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-white/90 backdrop-blur-sm pill-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-pill-navy font-montserrat">Your Profile</h2>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Sign Out
                  </Button>
                </div>
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-pill-teal rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-pill-navy" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-pill-navy">
                        {profile?.name || 'Welcome!'}
                      </h3>
                      <p className="text-pill-navy/70">{profile?.email || user?.email}</p>
                      {profile?.age && (
                        <p className="text-pill-navy/60">Age: {profile.age}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card 
                      className="p-4 bg-pill-light hover:bg-pill-teal/20 transition-colors cursor-pointer"
                      onClick={() => handleProfileClick('personal')}
                    >
                      <h4 className="font-semibold text-pill-navy mb-2">Personal Information</h4>
                      <p className="text-pill-navy/70">Update your profile details</p>
                      <Button className="mt-3 bg-pill-navy hover:bg-pill-navy/90" size="sm">
                        Edit Details
                      </Button>
                    </Card>
                    <Card 
                      className="p-4 bg-pill-light hover:bg-pill-teal/20 transition-colors cursor-pointer"
                      onClick={() => handleProfileClick('medical')}
                    >
                      <h4 className="font-semibold text-pill-navy mb-2">Medical History</h4>
                      <p className="text-pill-navy/70">Track your health records</p>
                      <Button className="mt-3 bg-pill-navy hover:bg-pill-navy/90" size="sm">
                        Update History
                      </Button>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="animate-fade-in">
              <Card className="p-8 bg-white/90 backdrop-blur-sm pill-shadow">
                <h2 className="text-3xl font-bold text-pill-navy mb-6 font-montserrat">Settings</h2>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 hover:scale-105 transition-transform duration-200">
                      <h3 className="font-semibold text-pill-navy mb-2 flex items-center gap-2">
                        Notifications
                      </h3>
                      <p className="text-pill-navy/70 mb-4">Customize reminder preferences</p>
                      <Button 
                        onClick={() => handleSettingsClick('notifications')}
                        variant="outline" 
                        className="border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white"
                      >
                        Configure
                      </Button>
                    </Card>
                    
                    <Card className="p-6 hover:scale-105 transition-transform duration-200">
                      <h3 className="font-semibold text-pill-navy mb-2 flex items-center gap-2">
                        Timezone
                      </h3>
                      <p className="text-pill-navy/70 mb-4">Set to India Standard Time</p>
                      <Button 
                        onClick={() => handleSettingsClick('timezone')}
                        variant="outline" 
                        className="border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white"
                      >
                        Update
                      </Button>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        type={settingsModalType}
      />
      
      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        type={profileModalType}
      />

      <NotificationsPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default Index;
