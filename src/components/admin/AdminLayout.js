import { useState } from 'react';
import AdminSidebar from './AdminSibebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="min-h-[calc(100vh-64px)] ">
          {children}
        </div>
      </main>
    </div>
  );
}