// src/app/admin/layout.tsx
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F7FEF9]">
      <AdminSidebar />
      <div className="flex-1 ml-20 md:ml-64">
        {children}
      </div>
    </div>
  );
}