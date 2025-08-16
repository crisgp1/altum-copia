'use client';

import RoleGuard from '@/app/components/auth/RoleGuard';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import AdminHeader from '@/app/components/admin/AdminHeader';
import { useMobileMenu } from '@/app/lib/presentation/hooks/useMobileMenu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();

  return (
    <RoleGuard requiredPermission="manage_content">
      <div className="min-h-screen bg-stone-50">
        <AdminHeader onMobileMenuToggle={toggleMenu} />
        <div className="flex">
          <AdminSidebar isOpen={isOpen} onClose={closeMenu} />
          <main className={`flex-1 transition-all duration-300 ${
            isOpen ? 'lg:ml-64' : 'lg:ml-64'
          } ml-0 p-4 sm:p-6 lg:p-8 pt-24 sm:pt-28 lg:pt-32`}>
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}