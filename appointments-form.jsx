import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { selectDoctors, fetchDoctors } from '../../redux/doctorsSlice';
import { selectUsers, fetchUsers } from '../../redux/usersSlice';
import { createAppointment } from '../../redux/appointmentsSlice';

const BookAppointmentContainer = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const doctors = useSelector(selectDoctors);
  const [selectedUser, setSelectedUser] = useState('');
  const userId = selectedUser || '';

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
    if (!doctors.length) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, users, doctors]);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [formData, setFormData] = useState({
    appointment_date: '',
    doctor_id: '',
    user_id: '',
    city: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createAppointment({ ...formData, user_id: userId }));
      setFormData({
        appointment_date: '',
        doctor_id: '',
        user_id: '',
        city: '',
      });
      window.location.href = '/my-appointments';
    } catch (error) {
      throw new Error('Failed to book appointment');
    }
  };

  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-lime-400 flex flex-col">
      <button className={`hamburger fixed top-4 left-4 z-50 ${menuOpen ? 'hidden' : ''}`} type="button" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} className="text-2xl w-6 h-6" />
      </button>
      <div
        className={`fixed h-screen bg-white bg-opacity-75  px-4 top-0 left-0 transition-transform transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
      >
        <button className="hamburger mb-4" type="button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faXmark} className="text-2xl w-6 h-6" />
        </button>
        <div className={`nav-links ${menuOpen ? 'visible' : 'hidden'}`}>
          <ul className=" space-y-6">
            <li className="nav-item">
              <NavLink to="/home" activeClassName="active">
                DOCTORS
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/appointments-form" activeClassName="active">
                ADD APPOINTMENT
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my-appointments" activeClassName="active">
                APPOINTMENTS
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/add-doctor" activeClassName="active">
                ADD DOCTOR
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/delete-doctor" activeClassName="active">
                DELETE DOCTOR
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="min-h-screen bg-lime-400 flex justify-center items-center flex-col">
        <h2 className="font-bold text-2xl underline mb-4">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="px-3 flex flex-col w-full space-y-6 max-w-xl">
          <select
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleInputChange}
            placeholder="Select Appointment Date"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
          />

          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
          >
            <option value="">Select a City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            name="user_id"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
          >
            <option value="">Select your username</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-lime-500 text-white px-4 py-2 rounded-full hover:bg-lime-600 transition duration-300"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentContainer;