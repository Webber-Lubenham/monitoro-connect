
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Bell, 
  Settings, 
  MapPin,
  Shield,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  showFor?: 'all' | 'student' | 'guardian';
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { profile } = useAuth();
  const userRole = profile?.role || null;

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      to: '/',
      showFor: 'all',
    },
    {
      label: 'Responsáveis',
      icon: <Users className="h-5 w-5" />,
      to: '/responsaveis',
      showFor: 'student',
    },
    {
      label: 'Estudantes',
      icon: <Users className="h-5 w-5" />,
      to: '/responsaveis',
      showFor: 'guardian',
    },
    {
      label: 'Localização',
      icon: <MapPin className="h-5 w-5" />,
      to: '/localizacao',
      showFor: 'all',
    },
    {
      label: 'Notificações',
      icon: <Bell className="h-5 w-5" />,
      to: '/notificacoes',
      showFor: 'all',
    },
    {
      label: 'Privacidade',
      icon: <Shield className="h-5 w-5" />,
      to: '/privacidade',
      showFor: 'all',
    },
    {
      label: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
      to: '/configuracoes',
      showFor: 'all',
    },
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.showFor === 'all') return true;
    if (!userRole) return false;
    if (item.showFor === 'student' && userRole === 'student') return true;
    if (item.showFor === 'guardian' && userRole === 'guardian') return true;
    return false;
  });

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-900 border-r transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-monitor-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-xl font-bold text-monitor-700 dark:text-monitor-400">
              Monitor
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-monitor-100 text-monitor-700 font-medium dark:bg-gray-800 dark:text-monitor-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <div className="p-4 bg-monitor-50 rounded-lg dark:bg-gray-800">
            <h3 className="font-medium text-monitor-800 dark:text-monitor-300">Precisa de ajuda?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Entre em contato com nosso suporte</p>
            <Button className="w-full mt-3 bg-monitor-500 hover:bg-monitor-600">
              <HelpCircle className="h-4 w-4 mr-2" />
              Suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
