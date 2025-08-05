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
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8 pt-24">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}