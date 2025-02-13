import AdminLayout from '../../components/admin/AdminLayout';
import ManageCommittees from '../../components/admin/ManageCommittees';

export default function ProfilePage() {
  return (
    <AdminLayout>
      <ManageCommittees />
    </AdminLayout>
  );
}