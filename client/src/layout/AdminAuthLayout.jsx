import { Outlet } from 'react-router-dom';
import { AdminFooter } from '../components/admin/AdminFooter';
import { AdminHeader } from '../components/admin/AdminHeader';


export const AdminAuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-50">
      <AdminHeader />
      <div className="flex flex-grow justify-center items-center">
        <main className="w-full max-w-md p-6">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
};