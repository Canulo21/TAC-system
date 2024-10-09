import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PendingAdmins() {
  const [pendingAdmins, setPendingAdmins] = useState([]);

  useEffect(() => {
    // Fetch pending admins when the component mounts
    const fetchPendingAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/pending-admins"
        );
        setPendingAdmins(response.data);
      } catch (error) {
        console.error("Error fetching pending admins:", error);
        toast.error("Failed to fetch pending admins", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    };

    fetchPendingAdmins();
  }, []);

  const acceptAdmin = async (userId) => {
    try {
      console.log("Accepting admin with userId:", userId); // Add this line
      const response = await axios.post("http://localhost:8080/accept-admin", {
        userId,
      });
      console.log("Response from accept-admin:", response.data); // Add this line

      // Update the local state to remove the accepted admin
      setPendingAdmins((prev) =>
        prev.filter((admin) => admin.user_id !== userId)
      );

      toast.success("Admin accepted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error accepting admin:", error);
      toast.error("Failed to accept admin", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const deleteAdmin = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/delete-admin/${userId}`);
      // Update the local state to remove the deleted admin
      setPendingAdmins((prev) =>
        prev.filter((admin) => admin.user_id !== userId)
      );
      toast.success("Admin deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div>
      <h1>Pending Admins</h1>
      <ToastContainer />
      {pendingAdmins.length === 0 ? (
        <p>No pending admins</p>
      ) : (
        <ul className="mt-9">
          {pendingAdmins.map((admin) => (
            <li
              key={admin.user_id}
              className="flex justify-between items-center border rounded-md p-2 mb-2 bg-[#fbfada] uppercase font-medium text-2xl"
            >
              <span>
                {admin.fname} {admin.lname}
              </span>
              <div>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => acceptAdmin(admin.user_id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteAdmin(admin.user_id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PendingAdmins;
