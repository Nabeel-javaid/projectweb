import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '/utils/supabase';

const AdminPassengers = () => {
  const { register, handleSubmit, reset } = useForm();
  const [passengers, setPassengers] = useState([]);
  const [editPassengerId, setEditPassengerId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch passengers from Supabase
  const fetchPassengers = async () => {
    try {
      const { data, error } = await supabase.from('passengers').select('*');
      if (error) throw new Error(error.message);
      setPassengers(data);
    } catch (error) {
      console.error('Error fetching passengers:', error.message);
    }
  };

  // Add a new passenger
  const addPassenger = async (passengerData) => {
    try {
      const { data, error } = await supabase.from('passengers').insert([passengerData]);
      if (error) throw new Error(error.message);
      toast.success('Passenger added successfully!');
      reset();
      fetchPassengers();
    } catch (error) {
      console.error('Error adding passenger:', error.message);
      toast.error('Error adding passenger');
    }
  };

  // Edit an existing passenger
  const editPassenger = (passengerId) => {
    setEditPassengerId(passengerId);
    setShowEditModal(true);
  };

  // Save edited passenger
  const saveEditedPassenger = async (passengerData) => {
    try {
      const { data, error } = await supabase
        .from('passengers')
        .update(passengerData)
        .match({ id: editPassengerId });
      if (error) throw new Error(error.message);
      toast.success('Passenger updated successfully!');
      reset();
      fetchPassengers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating passenger:', error.message);
      toast.error('Error updating passenger');
    }
  };

  // Delete a passenger
  const deletePassenger = async (passengerId) => {
    try {
      const { data, error } = await supabase
        .from('passengers')
        .delete()
        .match({ id: passengerId });
      if (error) throw new Error(error.message);
      toast.success('Passenger deleted successfully!');
      fetchPassengers();
    } catch (error) {
      console.error('Error deleting passenger:', error.message);
      toast.error('Error deleting passenger');
    }
  };

  // Fetch passengers on component mount
  useEffect(() => {
    fetchPassengers();
  }, []);

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-1/4">
        <div className="font-bold text-2xl leading-tight flex items-center justify-center text-slate-600 shadow-lg p-8 mt-14 rounded-lg border-orange-400 border-2">
          Manage All Passengers
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Add New Passenger</h2>
          <form onSubmit={handleSubmit(addPassenger)} className="flex flex-wrap gap-2">
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="Name"
              className="border p-2"
              required
            />
            <input
              type="date"
              {...register('date_of_birth', { required: true })}
              placeholder="Date of Birth"
              className="border p-2"
              required
            />
            <input
              type="text"
              {...register('passport_number', { required: true })}
              placeholder="Passport Number"
              className="border p-2"
              required
            />
            <input
              type="number"
              {...register('cnic', { required: true })}
              placeholder="CNIC"
              className="border p-2"
              required
            />
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Email"
              className="border p-2"
              required
            />
            <input
              type="number"
              {...register('phone_number', { required: true })}
              placeholder="Phone Number"
              className="border p-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Passenger
            </button>
          </form>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Date of Birth</th>
              <th className="border p-2">Passport Number</th>
              <th className="border p-2">CNIC</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((passenger) => (
              <tr key={passenger.id}>
                <td className="border p-2">{passenger.name}</td>
                <td className="border p-2">{passenger.date_of_birth}</td>
                <td className="border p-2">{passenger.passport_number}</td>
                <td className="border p-2">{passenger.cnic}</td>
                <td className="border p-2">{passenger.email}</td>
                <td className="border p-2">{passenger.phone_number}</td>
                <td className="border p-2">
                  <button
                    onClick={() => editPassenger(passenger.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePassenger(passenger.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Edit Passenger</h2>
              <form onSubmit={handleSubmit(saveEditedPassenger)} className="flex flex-wrap gap-2">
                <input
                  type="text"
                  {...register('name', { required: true })}
                  defaultValue={passengers.find((passenger) => passenger.id === editPassengerId)?.name}
                  placeholder="Name"
                  className="border p-2"
                  required
                />
                <input
                  type="date"
                  {...register('date_of_birth', { required: true })}
                  defaultValue={passengers.find((passenger) => passenger.id === editPassengerId)?.date_of_birth}
                  placeholder="Date of Birth"
                  className="border p-2"
                  required
                />
                <input
                  type="text"
                  {...register('passport_number', { required: true })}
                  defaultValue={passengers.find((passenger) => passenger.id === editPassengerId)?.passport_number}
                  placeholder="Passport Number"
                  className="border p-2"
                  required
                />
                <input
                  type="number"
                  {...register('cnic', { required: true })}
                  defaultValue={passengers.find((passenger) => passenger.id === editPassengerId)?.cnic}
                  placeholder="CNIC"
                  className="border p-2"
                  required
                />
                <input
                  type="email"
                  {...register('email', { required: true })}
                  defaultValue={passengers.find((passenger) => passenger.id === editPassengerId)?.email}
                  placeholder="Email"
                  className="border p-2"
                  required
                />
                <input
                  type="number"
                  {...register('phone_number', { required: true })}
                  defaultValue={passengers.find((passenger) => passenger.id === editPassengerId)?.phone_number}
                  placeholder="Phone Number"
                  className="border p-2"
                  required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminPassengers;
