import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user dashboard
    router.push('/user/UserDashboard');
  }, [router]);

  return null;
}