import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

function ChurchPopulation() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [genderCounts, setGenderCounts] = useState({
    Male: 0,
    Female: 0,
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/gender`);
      const jsonData = await response.json();

      const newGenderCounts = {
        Male: 0,
        Female: 0,
      };

      let totalMembers = 0;

      jsonData.forEach((user) => {
        const gender = user.gender; // Assuming 'gender' is the correct property in your data
        if (gender === "Male" || gender === "Female") {
          newGenderCounts[gender] += 1;
          totalMembers += 1;
        }
      });

      setGenderCounts(newGenderCounts);
      setTotalMembers(totalMembers); // Assuming you have a state variable for totalMembers
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: ["Male", "Female", "Total Members"], // Updated labels
    datasets: [
      {
        data: [
          genderCounts.Male,
          genderCounts.Female,
          totalMembers, // Include the totalMembers count
        ],
        backgroundColor: [
          "rgb(54, 162, 235)",
          "rgb(255, 99, 132)",
          "rgb(75, 192, 192)",
        ], // Added color for totalMembers
        label: "Church Population",
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // Disable the default aspect ratio
    responsive: true, // Make the chart responsive
    plugins: {
      legend: {
        labels: {
          color: "#FBFADA", // Set the color of the dataset labels
        },
      },
    },
  };

  return (
    <div className="text-center">
      <h3>Church Population</h3>
      <div className="pt-5" style={{ width: "500px", height: "500px" }}>
        <Doughnut data={data} options={chartOptions} />
      </div>
    </div>
  );
}

export default ChurchPopulation;
