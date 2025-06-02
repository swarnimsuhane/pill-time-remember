
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Bell, Settings, Home } from 'lucide-react';
import { useMedicines } from '@/hooks/useMedicines';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onNotificationClick: () => void;
}

const Header = ({ currentView, setCurrentView, onNotificationClick }: HeaderProps) => {
  const { medicines } = useMedicines();
  
  // Get real notification count based on pending medicines
  const today = new Date().toISOString().split('T')[0];
  const pendingMedicines = medicines.filter(med => med.date === today && !med.taken);
  const notificationCount = pendingMedicines.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-pill-teal/30 pill-shadow">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pill-teal rounded-full flex items-center justify-center relative">
              <div className="w-6 h-6 bg-gradient-to-t from-pill-red to-white rounded-full border border-pill-navy"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pill-navy font-montserrat">PILL TIME</h1>
              <p className="text-xs text-pill-navy/60">We Remember, So You Can Feel Better</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('dashboard')}
              className={`${
                currentView === 'dashboard' 
                  ? 'bg-pill-navy text-white' 
                  : 'text-pill-navy hover:bg-pill-light'
              } transition-all duration-200`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>

            <Button
              variant={currentView === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('profile')}
              className={`${
                currentView === 'profile' 
                  ? 'bg-pill-navy text-white' 
                  : 'text-pill-navy hover:bg-pill-light'
              } transition-all duration-200`}
            >
              <User className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationClick}
              className="text-pill-navy hover:bg-pill-light relative"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pill-red rounded-full text-white text-xs flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>

            <Button
              variant={currentView === 'settings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('settings')}
              className={`${
                currentView === 'settings' 
                  ? 'bg-pill-navy text-white' 
                  : 'text-pill-navy hover:bg-pill-light'
              } transition-all duration-200`}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
