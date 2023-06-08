import { useForm } from 'react-hook-form';
import { supabase } from 'utils/supabase';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

const Admin = () => {
  const { register, handleSubmit, reset } = useForm();
  const [flights, setFlights] = useState([]);

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

  // Add a new booking
  const addFlight = async (flightData) => {
    try {
      const { data, error } = await supabase.from('bookings').insert(flightData);
      if (error) throw new Error(error.message);
      toast.success('Flight added successfully!');
      reset();
      fetchFlights();
    } catch (error) {
      console.error('Error adding booking:', error.message);
    }
  };

  // Edit an existing booking
  const editFlight = async (flightData) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(flightData)
        .match({ id: flightData.id });
      if (error) throw new Error(error.message);
      toast.success('Flight updated successfully!');
      fetchFlights();
    } catch (error) {
      console.error('Error updating booking:', error.message);
    }
  };

  // Delete a booking
  const deleteFlight = async (flightId) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .match({ id: flightId });
      if (error) throw new Error(error.message);
      toast.success('Flight deleted successfully!');
      fetchFlights();
    } catch (error) {
      console.error('Error deleting booking:', error.message);
    }
  };

  // Fetch flights on component mount
  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Add New Flight</h2>
        <form onSubmit={handleSubmit(addFlight)} className="flex gap-2">
          <TextField {...register('departure_airport')} label="Departure City" required />
          <TextField type="date" {...register('departure_date')} label="Departure Date" required />
          <TextField {...register('arrival_airport')} label="Arrival City" required />
          <TextField type="number" {...register('price')} label="Price" required />
          <Button type="submit" variant="contained" color="primary">
            Add Flight
          </Button>
        </form>
      </div>
      <h2 className="text-lg font-semibold mb-2">All Flights</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Departure City</TableCell>
              <TableCell>Arrival City</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.departure_airport}</TableCell>
                <TableCell>{booking.arrival_airport}</TableCell>
                <TableCell>${booking.price}</TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      editFlight({
                        id: booking.id,
                        departure_airport: 'Updated Departure',
                        arrival_airport: 'Updated Arrival',
                        price: 500,
                      })
                    }
                    variant="contained"
                    color="warning"
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => deleteFlight(booking.id)} variant="contained" color="error" size="small">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Admin;
