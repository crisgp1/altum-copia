import RoleGuard from '@/app/components/auth/RoleGuard';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import AdminHeader from '@/app/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard requiredPermission="manage_content">
      <div className="min-h-screen bg-stone-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <div>
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main id="main-content" className="flex-1 lg:ml-64 min-h-screen">
              <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-20 sm:pt-24 md:pt-26 lg:pt-28">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}