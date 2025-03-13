import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminFooter } from "../components/admin/AdminFooter";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);


  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-50">
      <AdminHeader />
      
      <div className="flex flex-grow relative">


     
            <>
             {/* Mobile sidebar toggle button */}
        <button 
          className="md:hidden fixed z-30 top-20 left-4 bg-primary text-white p-2 rounded-md shadow-md"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

             {/* Sidebar - responsive */}
             <aside className={`
          fixed md:static z-20 h-[calc(100vh-64px)] transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}>
          <AdminSidebar isMobile={isMobile} closeSidebar={closeSidebar} />
        </aside>

        
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-10" 
                onClick={closeSidebar} 
                aria-hidden="true" 
              />
            )}


            </>
       
   
        
        {/* Main content area */}
        <main className={`
          flex-grow p-4 md:p-2 transition-all duration-300 ease-in-out
          w-full 'md:w-[calc(100%-16rem)]' 
        `}>
         
          <div className={`'max-w-7xl' mx-auto`}>
            <Outlet />
          </div>
        </main>
      </div>
      
      <AdminFooter />
    </div>
  );
};