import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '/utils/supabase'; // Update the import path based on your project structure

const AdminFlights = () => {
  const { register, handleSubmit, reset } = useForm();
  const [flights, setFlights] = useState([]);
  const [editFlightId, setEditFlightId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch flights from Supabase
  const fetchFlights = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) throw new Error(error.message);
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error.message);
    }
  };

  // Add a new flight
  const addFlight = async (flightData) => {
    try {
      const { data, error } = await supabase.from('bookings').insert([flightData]);
      if (error) throw new Error(error.message);
      toast.success('Flight added successfully!');
      reset();
      fetchFlights();
    } catch (error) {
      console.error('Error adding flight:', error.message);
      toast.error('Error adding flight');
    }
  };

  // Edit an existing flight
  const editFlight = (flightId) => {
    setEditFlightId(flightId);
    setShowEditModal(true);
  };

  // Save edited flight
  const saveEditedFlight = async (flightData) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(flightData)
        .match({ id: editFlightId });
      if (error) throw new Error(error.message);
      toast.success('Flight updated successfully!');
      reset();
      fetchFlights();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating flight:', error.message);
      toast.error('Error updating flight');
    }
  };

  // Delete a flight
  const deleteFlight = async (flightId) => {
    try {
      const { data, error } = await supabase.from('bookings').delete().match({ id: flightId });
      if (error) throw new Error(error.message);
      toast.success('Flight deleted successfully!');
      fetchFlights();
    } catch (error) {
      console.error('Error deleting flight:', error.message);
      toast.error('Error deleting flight');
    }
  };

  // Fetch flights on component mount
  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="h-[100vh]">
      <div className="flex items-center justify-center h-[30%]">
        <div className="font-bold text-2xl leading-tight flex items-center justify-center text-slate-600 shadow-lg p-8 mt-14 rounded-lg border-orange-400 border-2">
          Manage Passengers
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Add New Flight</h2>
          <form onSubmit={handleSubmit(addFlight)} className="flex flex-wrap gap-2">
            <input
              type="text"
              {...register('departure_airport', { required: true, pattern: /^[a-zA-Z\s]+$/ })}
              placeholder="Departure Airport"
              className="border p-2"
              required
            />
            <input
              type="text"
              {...register('arrival_airport', { required: true, pattern: /^[a-zA-Z\s]+$/ })}
              placeholder="Arrival Airport"
              className="border p-2"
              required
            />
            <input
              type="text"
              {...register('price', { required: true, pattern: /^\d+$/ })}
              placeholder="Price"
              className="border p-2"
              required
            />
            <input
              type="date"
              {...register('departure_date', { required: true })}
              placeholder="Departure Date"
              className="border p-2"
              required
            />
            <input
              type="time"
              {...register('departure_time', { required: true })}
              placeholder="Departure Time"
              className="border p-2"
              required
            />
            <input
              type="time"
              {...register('arrival_time', { required: true })}
              placeholder="Arrival Time"
              className="border p-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Flight
            </button>
          </form>
        </div>
        <h2 className="text-lg font-semibold mb-2">All Flights</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Departure Airport</th>
              <th className="border p-2">Arrival Airport</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Departure Date</th>
              <th className="border p-2">Departure Time</th>
              <th className="border p-2">Arrival Time</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((bookings) => (
              <tr key={bookings.id}>
                <td className="border p-2">{bookings.departure_airport}</td>
                <td className="border p-2">{bookings.arrival_airport}</td>
                <td className="border p-2">{bookings.price}</td>
                <td className="border p-2">{bookings.departure_date}</td>
                <td className="border p-2">{bookings.departure_time}</td>
                <td className="border p-2">{bookings.arrival_time}</td>
                <td className="border p-2">
                  <button
                    onClick={() => editFlight(bookings.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFlight(bookings.id)}
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
              <h2 className="text-lg font-semibold mb-2">Edit Flight</h2>
              <form
                onSubmit={handleSubmit(saveEditedFlight)}
                className="flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  {...register('departure_airport', { required: true, pattern: /^[a-zA-Z\s]+$/ })}
                  placeholder="Departure Airport"
                  defaultValue={flights.find((bookings) => bookings.id === editFlightId)?.departure_airport}
                  className="border p-2"
                  required
                />
                <input
                  type="date"
                  {...register('departure_date', { required: true })}
                  placeholder="Departure Date"
                  defaultValue={flights.find((bookings) => bookings.id === editFlightId)?.departure_date}
                  className="border p-2"
                  required
                />
                <input
                  type="text"
                  {...register('arrival_airport', { required: true, pattern: /^[a-zA-Z\s]+$/ })}
                  placeholder="Arrival Airport"
                  defaultValue={flights.find((bookings) => bookings.id === editFlightId)?.arrival_airport}
                  className="border p-2"
                  required
                />
                <input
                  type="time"
                  {...register('departure_time', { required: true })}
                  placeholder="Departure Time"
                  defaultValue={flights.find((bookings) => bookings.id === editFlightId)?.departure_time}
                  className="border p-2"
                  required
                />
                <input
                  type="time"
                  {...register('arrival_time', { required: true })}
                  placeholder="Arrival Time"
                  defaultValue={flights.find((bookings) => bookings.id === editFlightId)?.arrival_time}
                  className="border p-2"
                  required
                />
                <input
                  type="number"
                  {...register('price', { required: true, pattern: /^\d+$/ })}
                  placeholder="Price"
                  defaultValue={flights.find((bookings) => bookings.id === editFlightId)?.price}
                  className="border p-2"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminFlights;
