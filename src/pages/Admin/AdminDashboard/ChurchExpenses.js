import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./ChurchFinancial.css";

function ChurchExpenses() {
  const [total, setTotal] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [filter, setFilter] = useState([]);

  const getTotalIncome = async (month) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getTotalIncome?month=${month}`
      );
      const totalIncomeArray = response.data.map((item) => item.totalIncome);
      setTotalIncome(totalIncomeArray);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalExpenses = async (month) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/getTotalExpenses?month=${month}`
      );
      const totalExpensesArray = response.data.map(
        (item) => item.totalExpenses
      );
      setTotalExpenses(totalExpensesArray);
    } catch (err) {
      console.error(err);
    }
  };

  const getFilterByMonth = async () => {
    const getCurrentMonth = new Date().toLocaleString([], {
      month: "long",
    });

    // Set the filter as an array with a single element
    setFilter([getCurrentMonth]);

    // Fetch data for the current month
    await getTotalIncome(getCurrentMonth);
    await getTotalExpenses(getCurrentMonth);
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
    // Fetch default data for the current month
    getFilterByMonth();
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {
    if (totalIncome.length > 0 && totalExpenses.length > 0) {
      // Calculate the total income and total expenses for each month
      const monthlyTotals = totalIncome.map(
        (income, index) => income - totalExpenses[index]
      );

      // Set total as an array containing the total for each month
      setTotal(monthlyTotals);
    }
  }, [totalIncome, totalExpenses]);

  const data = {
    labels: filter,
    datasets: [
      {
        label: "Income",
        data: totalIncome,
        backgroundColor: ["rgba(54, 162, 235, 0.9)", "rgba(54, 162, 235, 0.9)"],
        borderColor: ["#FBFADA", "#FBFADA"],
        borderWidth: 2,
      },
      {
        label: "Expenses",
        data: totalExpenses,
        backgroundColor: ["rgba(255, 99, 132, 0.9)", "rgba(255, 99, 132, 0.9)"],
        borderColor: ["#FBFADA", "#FBFADA"],
        borderWidth: 2,
      },
      {
        label: "Total",
        data: total,
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
      <div className="pt-5 charts" style={{ width: "100%", height: "auto" }}>
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
}

export default ChurchExpenses;
