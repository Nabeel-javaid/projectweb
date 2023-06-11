import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { supabase } from '/utils/supabase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProfile = () => {
  const [authorized, setAuthorized] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  console.log('session', status);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (status === 'authenticated' && session) {
          const { data, error } = await supabase
            .from('admin')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (error) throw new Error(error.message);

          if (data) {
            setAdminData(data);
            setEditedName(data.name);
            setEditedPhone(data.phone_number);
            setEditedAddress(data.address);
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error.message);
        setAuthorized(false);
      }
    };

    fetchAdminData();
  }, [status, session]);

  const handleManagePassengers = () => {
    router.push('/managePassengers');
  };

  const handleManageFlights = () => {
    router.push('/manageFlights');
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (editedName.trim() === '' || editedPhone.trim() === '' || editedAddress.trim() === '') {
        toast.error('Please fill in all fields');
        return;
      }

      const { error } = await supabase
        .from('admin')
        .update({ name: editedName, phone_number: editedPhone, address: editedAddress })
        .eq('email', session.user.email);

      if (error) throw new Error(error.message);

      setEditing(false);
      setAdminData((prevData) => ({
        ...prevData,
        name: editedName,
        phone_number: editedPhone,
        address: editedAddress,
      }));

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating admin profile:', error.message);
      toast.error('Failed to update profile');
    }
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
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md px-6 py-8 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>
          {adminData && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <div>
                  {editing ? (
                    <input
                      type="text"
                      className="font-semibold"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    <p className="font-semibold">{adminData.name}</p>
                  )}
                  <p className="text-gray-500">{adminData.role}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{adminData.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone:</p>
                {editing ? (
                  <input
                    type="text"
                    className="font-semibold"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                  />
                ) : (
                  <p className="font-semibold">{adminData.phone_number}</p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Address:</p>
                {editing ? (
                  <input
                    type="text"
                    className="font-semibold"
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                  />
                ) : (
                  <p className="font-semibold">{adminData.address}</p>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-6">
            {editing ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            )}
            <div className="ml-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleManagePassengers}
              >
                Manage Passengers
              </button>
            </div>
            <div className="ml-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleManageFlights}
              >
                Manage Flights
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminProfile;
