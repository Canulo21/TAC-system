import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

function AdminRegistration() {
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    role: "Admin", // default role set to Admin
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // For success/error message

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your API
      const response = await axios.post(
        "http://localhost:8080/admin-registration",
        formData
      );

      if (response.status === 200) {
        setMessage("Admin registered successfully!");
        // Optionally, reset the form
        setFormData({
          fname: "",
          mname: "",
          lname: "",
          role: "Admin",
          username: "",
          password: "",
        });
      }
    } catch (error) {
      setMessage(
        "Error registering admin: " + error.response?.data?.error ||
          error.message
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#fbfada] shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-black">
        Apply As Admin
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-lg font-bold">First Name:</label>
          <input
            type="text"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border rounded-md "
          />
        </div>
        <div>
          <label className="text-lg font-bold">Middle Name:</label>
          <input
            type="text"
            name="mname"
            value={formData.mname}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md "
          />
        </div>
        <div>
          <label className="text-lg font-bold">Last Name:</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border rounded-md "
          />
        </div>
        <div>
          <label className="text-lg font-bold">Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            readOnly
            className="w-full p-2 mt-1 bg-gray-100 border rounded-md focus:outline-none"
          />
        </div>
        <div>
          <label className="text-lg font-bold">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border rounded-md "
          />
        </div>
        <div>
          <label className="text-lg font-bold">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border rounded-md "
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md  hover:bg-[#2e5491] w-full"
        >
          Register
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-green-600">{message}</p>
        </div>
      )}

      <div className="mt-6">
        <Link className="font-medium underline" to={"/"}>
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default AdminRegistration;
