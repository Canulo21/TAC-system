import React from "react";
import { Bar } from "react-chartjs-2";

function ChurchExpenses() {
  const data = {
    labels: ["January", "Febuary"],
    datasets: [
      {
        label: "Income",
        data: [3000, 1000],
        backgroundColor: ["rgba(54, 162, 235, 0.9)", "rgba(54, 162, 235, 0.9)"],
        borderColor: ["#FBFADA", "#FBFADA"],
        borderWidth: 2,
      },
      {
        label: "Expenses",
        data: [2000, 1500],
        backgroundColor: ["rgba(255, 99, 132, 0.9)", "rgba(255, 99, 132, 0.9)"],
        borderColor: ["#FBFADA", "#FBFADA"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "x", // Set to 'y' for a vertical bar graph
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#FBFADA", // Set the color of the labels
        },
        grid: {
          color: "rgba(224, 224, 224, 0.5)", // Set the color of the horizontal grid lines
          borderColor: "rgba(224, 224, 224, 0.02)", // Set the color of the horizontal grid lines
          lineWidth: 1, // Set the width of the horizontal grid lines
        },
      },
      x: {
        ticks: {
          color: "#FBFADA", // Set the color of the labels
        },
        grid: {
          color: "rgba(224, 224, 224, 0.5)", // Set the color of the horizontal grid lines
          borderColor: "rgba(224, 224, 224, 0.02)", // Set the color of the horizontal grid lines
          lineWidth: 1, // Set the width of the horizontal grid lines
        },
      },
    },
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
      <h3>Church Financial status</h3>
      <div className="pt-5" style={{ width: "1000px", height: "500px" }}>
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
}

export default ChurchExpenses;
