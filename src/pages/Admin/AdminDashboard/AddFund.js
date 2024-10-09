import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddFund() {
  const [fundTitle, setFundTitle] = useState("");
  const [funds, setFunds] = useState([]);
  const [editingFund, setEditingFund] = useState(null); // Track which fund is being edited
  const [amountFund, setAmountFund] = useState(null); // Track which fund is being added amount
  const [fundAmount, setFundAmount] = useState(""); // Track the input amount

  // Fetch the existing funds from the backend on component mount
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get("http://localhost:8080/get-funds");
        setFunds(response.data);
      } catch (error) {
        console.error("Error fetching funds:", error);
        toast.error("Failed to fetch funds");
      }
    };

    fetchFunds();
  }, []); // Empty dependency array to only fetch on component mount

  // Handle the fund title submission
  const handleSubmit = async () => {
    if (!fundTitle.trim()) {
      toast.error("Fund title cannot be empty");
      return; // Prevent submission if fund title is empty
    }

    if (editingFund) {
      // Update existing fund
      try {
        await axios.put(`http://localhost:8080/update-fund/${editingFund.id}`, {
          fund_title: fundTitle,
        });
        toast.success("Fund updated successfully!");

        // Refresh the funds list after updating
        const response = await axios.get("http://localhost:8080/get-funds");
        setFunds(response.data);
        setEditingFund(null); // Clear editing state
        setFundTitle(""); // Clear the input
      } catch (error) {
        console.error("Error updating fund:", error);
        toast.error("Failed to update fund");
      }
    } else {
      // Add new fund
      try {
        await axios.post("http://localhost:8080/add-fund", {
          fund_title: fundTitle,
        });
        setFundTitle(""); // Clear input after saving

        // Refresh the funds list
        const response = await axios.get("http://localhost:8080/get-funds");
        setFunds(response.data);
        toast.success("Fund added successfully!");
      } catch (error) {
        console.error("Error adding fund:", error);
        toast.error("Failed to add fund");
      }
    }
  };

  // Handle fund deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/delete-fund/${id}`);
      setFunds(funds.filter((fund) => fund.id !== id));
      toast.success("Fund deleted successfully");
    } catch (error) {
      console.error("Error deleting fund:", error);
      toast.error("Failed to delete fund");
    }
  };

  // Handle fund editing
  const handleEdit = (fund) => {
    setEditingFund(fund); // Set the fund to be edited
    setFundTitle(fund.fund_title); // Fill the input with the fund's title
  };

  // Handle adding amount functionality
  const handleAddAmount = (fund) => {
    setAmountFund(fund); // Set the fund to add amount
    setFundAmount(""); // Clear previous input amount
  };

  // Handle saving the amount
  const handleSaveAmount = async () => {
    if (!fundAmount || isNaN(fundAmount) || fundAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/update-fund-amount/${amountFund.id}`,
        {
          fund_amount: parseFloat(fundAmount), // Ensure the amount is sent as a number
        }
      );
      toast.success("Amount added successfully!");

      // Refresh the funds list after saving the amount
      const response = await axios.get("http://localhost:8080/get-funds");
      setFunds(response.data);
      setAmountFund(null); // Clear amount adding state
      setFundAmount(""); // Clear the input
    } catch (error) {
      console.error("Error adding amount:", error);
      toast.error("Failed to add amount");
    }
  };

  // Function to close the editing state
  const handleCloseEdit = () => {
    setEditingFund(null);
    setFundTitle(""); // Clear the input
  };

  // Function to close the adding amount state
  const handleCloseAddAmount = () => {
    setAmountFund(null);
    setFundAmount(""); // Clear the input
  };

  return (
    <div className="bg-white p-5">
      <h2 className="text-center font-bold mb-4 text-black">
        {editingFund ? "Edit Fund" : "Add Funds"}
      </h2>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Fund Title"
          value={fundTitle}
          onChange={(e) => setFundTitle(e.target.value)}
          className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
        <button
          className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 ml-5 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        >
          {editingFund ? "Update" : "Save"}
        </button>
        {editingFund && (
          <button
            className="font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline bg-red-500 text-white text-sm ml-2"
            onClick={handleCloseEdit}
          >
            Cancel
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2 text-black">All Funds</h3>

      {funds.map((fund) => (
        <div
          key={fund.id}
          className="flex items-center uppercase font-medium border-2 border-[#707070] px-2 py-2 justify-between mb-2"
        >
          <span>{fund.fund_title}</span>
          <div className="flex gap-2">
            <button
              className="font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline bg-blue-500  hover:bg-[#2e5491] text-white text-sm"
              onClick={() => handleAddAmount(fund)}
            >
              Add Amount
            </button>
            <button
              className="font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline bg-green-500 hover:bg-[#12372a] text-white text-sm"
              onClick={() => handleEdit(fund)}
            >
              Edit
            </button>
            <button
              className="font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline bg-red-500 text-white text-sm"
              onClick={() => handleDelete(fund.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Show input for amount if amountFund is set */}
      {amountFund && (
        <div className="mt-4 text-center flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-black">
            Add Amount to {amountFund.fund_title}
          </h3>
          <input
            type="number"
            placeholder="Enter Amount"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            min="0"
            className="mb-2 appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
          <div className="flex justify-center gap-2">
            <button
              className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSaveAmount}
              disabled={!fundAmount || isNaN(fundAmount) || fundAmount <= 0}
            >
              Save Amount
            </button>
            <button
              className="font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline bg-red-500 text-white text-sm"
              onClick={handleCloseAddAmount}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default AddFund;
