import AdminLayout from '../../components/admin/AdminLayout';
import PendingRequests from '@/components/admin/RequestDetails';
export default function ProfilePage() {
  return (
    <AdminLayout>
      <PendingRequests />
    </AdminLayout>
  );
}