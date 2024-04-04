import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./ChurchFinancial.css";

function ChurchExpenses() {
  const [total, setTotal] = useState([]);
  const [totalIncome, setTotalIncome] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState([]);
  const [filter, setFilter] = useState([]);
  const [coh, setCoh] = useState(0);
  const [toggleCurrentMonth, setToggleCurrentMonth] = useState(false);
  const [toggleCurrentYear, setToggleCurrentYear] = useState(false);

  const fetchTotalIncomeAndExpenses = async (month) => {
    try {
      const incomeResponse = await axios.get(
        `http://localhost:8080/getTotalIncome?month=${month}`
      );
      setTotalIncome(incomeResponse.data.map((item) => item.totalIncome));

      const expensesResponse = await axios.get(
        `http://localhost:8080/getTotalExpenses?month=${month}`
      );
      setTotalExpenses(expensesResponse.data.map((item) => item.totalExpenses));
    } catch (err) {
      console.error(err);
    }
  };

  const getFilterByMonth = async () => {
    const getCurrentMonth = new Date().toLocaleString([], {
      month: "long",
    });

    setFilter([getCurrentMonth]);
    await fetchTotalIncomeAndExpenses(getCurrentMonth);
    setToggleCurrentMonth(true);
    setToggleCurrentYear(false);
  };

  const getFilterByYearAndMonths = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/getTotalExpenses"
      );
      const currentYear = new Date().getFullYear();

      const monthArray = response.data.map((item) => {
        const numericMonth = item.MONTH;
        const monthString = new Date(
          currentYear,
          numericMonth - 1,
          1
        ).toLocaleString("en-US", { month: "long" });
        return monthString;
      });

      setToggleCurrentYear(true);
      setToggleCurrentMonth(false);
      setFilter(monthArray);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFilterByMonth();
  }, []);

  useEffect(() => {
    if (totalIncome.length > 0 && totalExpenses.length > 0) {
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
      const monthlyTotals = totalIncome.map(
        (income, index) => income - totalExpenses[index]
      );
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
    indexAxis: "x",
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#FBFADA" },
        grid: {
          color: "rgba(224, 224, 224, 0.5)",
          borderColor: "rgba(224, 224, 224, 0.02)",
          lineWidth: 1,
        },
      },
      x: {
        ticks: { color: "#FBFADA" },
        grid: {
          color: "rgba(224, 224, 224, 0.5)",
          borderColor: "rgba(224, 224, 224, 0.02)",
          lineWidth: 1,
        },
      },
    },
    plugins: { legend: { labels: { color: "#FBFADA" } } },
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
            C.O.H: <span className="ml-2">₱{coh}</span>
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
