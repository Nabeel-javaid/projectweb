import React, { useState, useEffect } from 'react';
import { supabase } from 'utils/supabase';

const AdminProfile = ({ user }) => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchAdminEmail = async () => {
      try {
        const { data, error } = await supabase.from('admin').select('email');
        if (error) throw new Error(error.message);

        const adminEmails = data.map((admin) => admin.email);

        if (adminEmails.includes('nabeeljaved944@gmail.com')) {
          setAuthorized(true); // Set authorized to true if user is in the adminEmails list
        } else {
          setAuthorized(false); // Set authorized to false if user is not in the adminEmails list
        }
      } catch (error) {
        console.error('Error fetching admin email:', error.message);
        setAuthorized(false); // Set authorized to false in case of any error
      }
    };

    fetchAdminEmail();
  }, [user]);

  return (
    <>
      {authorized ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <div className="max-w-md px-6 py-8 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-gray-500">Admin</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{"nabeeljaved944@gmail.com"}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone:</p>
                <p className="font-semibold">+1 123 456 7890</p>
              </div>
              <div>
                <p className="text-gray-600">Address:</p>
                <p className="font-semibold">123 Main St, City, Country</p>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AdminProfile;
