
import React from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-monitor-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h1 className="text-lg font-bold text-monitor-700 dark:text-monitor-400">
              {isMobile ? "Monitor" : "Monitor Connect"}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile ? `${profile.first_name} ${profile.last_name}` : 'Minha conta'}
                    {profile && (
                      <div className="text-xs font-normal mt-1 text-gray-500">
                        {profile.role === 'student' ? 'Estudante' : 'Responsável'}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/configuracoes">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
