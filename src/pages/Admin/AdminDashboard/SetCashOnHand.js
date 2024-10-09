import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SetCashOnHand() {
  const [coh, setCoh] = useState(""); // Stores the cash on hand value
  const [isCashSet, setIsCashSet] = useState(false); // Tracks whether cash is set

  // Fetch the current status of cash on hand on component mount
  useEffect(() => {
    const checkCashOnHand = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/check-cash-on-hand"
        );
        if (response.data.setCoh !== null) {
          setCoh(response.data.setCoh); // Set the value in the input
          setIsCashSet(true); // Cash on hand is already set
        }
      } catch (error) {
        console.error("Error checking cash on hand:", error);
      }
    };

    checkCashOnHand();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/set-cash-on-hand", { coh });
      toast.success("Cash on hand saved successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setIsCashSet(true); // Disable input and button after setting cash
    } catch (error) {
      toast.error("Failed to save cash on hand", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div
        className={`bg-white py-5 px-5 h-full ${
          isCashSet ? "opacity-75" : "opacity-100"
        }`}
      >
        <h2 className="text-black text-center">Set Cash on Hand</h2>
        <p className="text-red-500 mb-5 text-sm text-center italic font-medium">
          {isCashSet
            ? "Cash on hand is already set."
            : "This will set the cash on hand, one use only!!"}
        </p>
        <form>
          <div className="flex justify-between">
            <input
              className="appearance-none block w-4/5 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              name="coh"
              placeholder="XxxX"
              value={coh}
              onChange={(e) => setCoh(e.target.value)}
              disabled={isCashSet} // Disable input if cash on hand is set
            />
            <button
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isCashSet
                  ? "bg-red-500 cursor-not-allowed text-white"
                  : "bg-[#436850] hover:bg-[#12372a] text-white"
              }`}
              type="button"
              onClick={handleSubmit}
              disabled={isCashSet} // Disable button if cash on hand is set
            >
              {isCashSet ? "Not Allowed" : "Save"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default SetCashOnHand;
