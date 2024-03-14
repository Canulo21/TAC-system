import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./ChurchFinancial.css";

function ChurchExpenses() {
  const [total, setTotal] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [filter, setFilter] = useState([]);
  const [coh, setCoh] = useState(0);
  const [toggleCurrentMonth, setToggleCurrentMonth] = useState(false);
  const [toggleCurrentYear, setToggleCurrentYear] = useState(false);

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

    setToggleCurrentMonth(!toggleCurrentMonth);
    setToggleCurrentYear(false); // Ensure the other toggle is set to false
  };

  const getFilterByYearAndMonths = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/getTotalExpenses"
      );

      const currentYear = new Date().getFullYear(); // Get the current year

      const monthArray = response.data.map((item) => {
        const numericMonth = item.MONTH;
        const monthString = new Date(
          currentYear,
          numericMonth - 1,
          1
        ).toLocaleString("en-US", { month: "long" });
        return monthString;
      });
      setToggleCurrentYear(!toggleCurrentYear);
      setToggleCurrentMonth(false);
      setFilter(monthArray);
    } catch (err) {
      // Handle errors here
    }
  };

  useEffect(() => {
    // Fetch default data for the current month
    getFilterByMonth();
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {
    if (totalIncome === undefined || totalExpenses === undefined) {
      return;
    }

    if (!Array.isArray(totalIncome) || !Array.isArray(totalExpenses)) {
      return;
    }

    const sumOfTotalIncome = totalIncome.reduce(
      (acc, income) => acc + income,
      0
    );
    const sumOfTotalExpenses = totalExpenses.reduce(
      (acc, expenses) => acc + expenses,
      0
    );
    const coh = sumOfTotalIncome - sumOfTotalExpenses;
    setCoh(coh);

    if (totalIncome.length > 0 && totalExpenses.length > 0) {
      // Calculate the total income and total expenses for each month
      const monthlyTotals = totalIncome.map(
        (income, index) => income - totalExpenses[index]
      );

      // Set total as an array containing the total for each month
      setTotal(monthlyTotals);
    }
  }, [totalIncome, totalExpenses, toggleCurrentMonth, toggleCurrentYear]);
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
      <div className="flex items-center justify-between">
        <div className="btn-holder flex gap-2 pt-2">
          <button
            className={`bg-[#FBFADA] btn px-2 py-1 text-xs rounded-md${
              toggleCurrentMonth ? " active" : ""
            }`}
            onClick={getFilterByMonth}>
            Current Month
          </button>
          <button
            className={`bg-[#FBFADA] btn px-2 py-1 text-xs rounded-md${
              toggleCurrentYear ? " active" : ""
            }`}
            onClick={getFilterByYearAndMonths}>
            Current Year
          </button>
        </div>
        <div>
          <p className="text-bold">
            C.O.H:
            <span className="ml-2">₱{coh}</span>
          </p>
        </div>
      </div>
      <div className="pt-5 charts" style={{ width: "100%", height: "auto" }}>
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
}

export default ChurchExpenses;
