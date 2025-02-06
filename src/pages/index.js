import { useState, useEffect } from 'react';
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin')
      .then(res => res.json())
      .then(data => {
        setAdmins(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch admin data');
        setLoading(false);
      });
  }, []);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen p-8`}>
      <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Role ID</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-4 py-2 border">{admin.id}</td>
                <td className="px-4 py-2 border">{admin.username}</td>
                <td className="px-4 py-2 border">{admin.email}</td>
                <td className="px-4 py-2 border">{admin.mobile}</td>
                <td className="px-4 py-2 border">{admin.role_id}</td>
                <td className="px-4 py-2 border">
                  {admin.is_status === 1 ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}