import React, { useState, useEffect } from "react";
import axios from "axios";

function ShowFunds() {
  const [funds, setFunds] = useState([]);

  // Fetch the existing funds from the backend on component mount
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await axios.get("http://localhost:8080/get-funds");
        setFunds(response.data);
        console.log("here", response);
      } catch (error) {
        console.error("Error fetching funds:", error);
      }
    };

    fetchFunds();
  }, []);

  return (
    <div className="pt-5 px-5">
      {funds.length === 0 ? (
        ""
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-200 text-center card"
            >
              <h3 className="text-xl font-bold text-[#436850]">
                {fund.fund_title}
              </h3>
              <p className="mt-2 text-2xl text-gray-700 font-bold">
                <span className="mr-2 text-3xl">₱</span>
                {new Intl.NumberFormat("en-PH", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(fund.fund_amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowFunds;
