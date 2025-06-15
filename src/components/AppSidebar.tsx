import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  Home, 
  MessageCircle, 
  Pill, 
  Stethoscope, 
  Droplets, 
  Activity, 
  User, 
  Settings, 
  Heart,
  Calendar,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  onFeatureSelect: (feature: string) => void;
  currentFeature: string;
}

const AppSidebar = ({ onFeatureSelect, currentFeature }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { setOpenMobile } = useSidebar();

  const mainFeatures = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'ai-assistant', title: 'AI Assistant', icon: MessageCircle },
    { id: 'medicines', title: 'Medicines', icon: Pill },
    { id: 'doctors', title: 'Doctors', icon: Stethoscope },
    { id: 'hydration', title: 'Hydration', icon: Droplets },
    { id: 'symptoms', title: 'Symptoms', icon: Activity },
  ];

  const otherFeatures = [
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'health-score', title: 'Health Score', icon: Heart },
    { id: 'appointments', title: 'Appointments', icon: Calendar },
    { id: 'profile', title: 'Profile', icon: User },
    { id: 'settings', title: 'Settings', icon: Settings },
  ];

  const handleFeatureClick = (featureId: string) => {
    onFeatureSelect(featureId);
    setOpenMobile(false); // Close sidebar on mobile after selection
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-pill-navy/10 bg-gradient-to-r from-pill-teal/20 to-pill-light/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pill-teal rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-pill-navy animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-pill-navy text-xl font-montserrat">Pill Time</h2>
            <p className="text-pill-navy/70 text-sm font-medium">Health Companion</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainFeatures.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleFeatureClick(item.id)}
                    isActive={currentFeature === item.id}
                     className="w-full justify-start gap-3 py-3 px-3 rounded-lg transition-all duration-200 hover:bg-pill-navy/10 hover:scale-[1.02] data-[active=true]:bg-pill-navy data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-4 border-t border-pill-navy/10" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherFeatures.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => handleFeatureClick(item.id)}
                    isActive={currentFeature === item.id}
                    className="w-full justify-start gap-3 py-3 px-3 rounded-lg transition-all duration-200 hover:bg-pill-navy/10 hover:scale-[1.02] data-[active=true]:bg-pill-navy data-[active=true]:text-white data-[active=true]:shadow-lg"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-pill-navy/10 bg-gradient-to-r from-pill-light/20 to-white/50">
        {user && (
          <div className="space-y-3">
            <div className="text-center bg-white/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-sm font-medium text-pill-navy truncate">{user.email}</p>
              <p className="text-xs text-pill-navy/70">Logged in</p>
            </div>
            <Button 
              onClick={signOut}
              variant="outline"
              className="w-full border-pill-navy text-pill-navy hover:bg-pill-navy hover:text-white transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              Sign Out
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;