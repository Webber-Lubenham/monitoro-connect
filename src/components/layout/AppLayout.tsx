
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="flex-1 md:ml-64 pt-2">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Mobile overlay to close sidebar when clicking outside */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
