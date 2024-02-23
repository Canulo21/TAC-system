import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

function ChurchExpenses() {
  const [total, setTotal] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [filter, setFilter] = useState([]);

  const getTotalIncome = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getTotalIncome`);
      setTotalIncome(response.data.totalIncome);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getTotalExpenses`
      );
      setTotalExpenses(response.data.totalExpenses);
    } catch (err) {
      console.log(err);
    }
  };

  const getFilterByMonth = async () => {
    const getCurrentMonth = new Date().toLocaleString([], {
      month: "long",
    });

    // Set the filter as an array with a single element
    setFilter([getCurrentMonth]);
  };

  const getFilterByYearAndMonths = async () => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create an array of all months
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(currentYear, index, 1);
      return monthDate.toLocaleString([], { month: "long" });
    });

    // Set the filter with the array of all months
    setFilter(allMonths.map((month) => [month])); // Ensure each month is wrapped in an array
  };

  useEffect(() => {
    getTotalIncome();
    getTotalExpenses();
  }, []);

  useEffect(() => {
    if (totalIncome !== "" && totalExpenses !== "") {
      const calculatedTotal = totalIncome - totalExpenses;
      setTotal(calculatedTotal);
    }
  }, [totalIncome, totalExpenses]);

  const data = {
    labels: filter,
    datasets: [
      {
        label: "Income",
        data: [totalIncome],
        backgroundColor: ["rgba(54, 162, 235, 0.9)", "rgba(54, 162, 235, 0.9)"],
        borderColor: ["#FBFADA", "#FBFADA"],
        borderWidth: 2,
      },
      {
        label: "Expenses",
        data: [totalExpenses],
        backgroundColor: ["rgba(255, 99, 132, 0.9)", "rgba(255, 99, 132, 0.9)"],
        borderColor: ["#FBFADA", "#FBFADA"],
        borderWidth: 2,
      },
      {
        label: "Total",
        data: [total],
        backgroundColor: ["rgba(75, 192, 192, 0.9)", "rgba(75, 192, 192, 0.9)"],
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
      <div className="btn-holder flex gap-2 pt-2">
        <button
          className="bg-[#FBFADA] px-2 py-1 text-xs rounded-md"
          onClick={getFilterByMonth}>
          Current Month
        </button>
        <button
          className="bg-[#FBFADA] px-2 py-1 text-xs rounded-md"
          onClick={getFilterByYearAndMonths}>
          Current Year
        </button>
      </div>
      <div className="pt-5" style={{ width: "1000px", height: "500px" }}>
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
}

export default ChurchExpenses;
