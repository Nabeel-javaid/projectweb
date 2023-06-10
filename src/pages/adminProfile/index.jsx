import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { supabase } from 'utils/supabase';

const AdminProfile = () => {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        if (status === 'authenticated' && session) {
          const { data, error } = await supabase.from('admin').select('email');
          if (error) throw new Error(error.message);

          const adminEmails = data.map((admin) => admin.email);

          if (adminEmails.includes(session.user.email)) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        }
      } catch (error) {
        console.error('Error fetching admin email:', error.message);
        setAuthorized(false);
      }
    };

    fetchAdminEmail();
  }, [status, session]);

  const handleManagePassengers = () => {
    router.push('/managePassengers');
  };

  const handleManageFlights = () => {
    router.push('/manageFlights');
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-lg font-medium text-gray-600">Loading...</h2>
      </div>
    );
  }

  if (!session) {
    router.push('/sign'); // Redirect to the sign-in page if session is not found
    return null;
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-lg font-medium text-red-600">
          You are not authorized to access this page.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Admin Profile</h1>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleManagePassengers}
        >
          Manage Passengers
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleManageFlights}
        >
          Manage Flights
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
