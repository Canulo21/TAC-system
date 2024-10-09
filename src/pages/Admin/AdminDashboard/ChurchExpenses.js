import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./ChurchFinancial.css";

function ChurchExpenses() {
  const currentYear = new Date().getFullYear(); // Get the current year
  const [totalIncome, setTotalIncome] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState([]);
  const [filter, setFilter] = useState([]);
  const [total, setTotal] = useState([]);
  const [coh, setCoh] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear); // Set selectedYear to the current year by default
  const [hasData, setHasData] = useState(true); // Flag to indicate if there is data for the selected year

  const getYear = async () => {
    try {
      // Fetch data for the selected year
      const incomeResponse = await axios.get(
        `http://localhost:8080/getTotalIncomeByYear`,
        {
          params: {
            year: selectedYear,
          },
        }
      );

      const expensesResponse = await axios.get(
        `http://localhost:8080/getTotalExpensesByYear`,
        {
          params: {
            year: selectedYear,
          },
        }
      );

      // Extract month and corresponding data for income and expenses
      const incomeData = incomeResponse.data.reduce((acc, item) => {
        acc[item.MONTH] = item.totalIncome;
        return acc;
      }, {});

      const expensesData = expensesResponse.data.reduce((acc, item) => {
        acc[item.MONTH] = item.totalExpenses;
        return acc;
      }, {});

      // Combine income and expenses data
      const mergedData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: incomeData[i + 1] || 0,
        expenses: expensesData[i + 1] || 0,
      }));

      // Filter the months that have data
      const monthsWithData = mergedData.filter(
        (item) => item.income || item.expenses
      );

      // Update state
      setTotalIncome(monthsWithData.map((item) => item.income));
      setTotalExpenses(monthsWithData.map((item) => item.expenses));
      setFilter(monthsWithData.map((item) => item.month));
      setHasData(monthsWithData.length > 0); // Update hasData based on whether there is data for the selected year
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasData(false); // Set hasData to false since there is no data for the selected year
    }
  };

  const getCoh = async () => {
    try {
      // Fetch total income and total expenses
      const cohTotalIncome = await axios.get(
        "http://localhost:8080/getTotalIncome"
      );
      const cohTotalExpenses = await axios.get(
        "http://localhost:8080/getTotalExpenses"
      );

      const cohIncomeValue = cohTotalIncome.data[0].totalIncome;
      const cohExpensesValue = cohTotalExpenses.data[0].totalExpenses;

      // Fetch the manually set cash on hand from your database
      const cohManualSet = await axios.get(
        "http://localhost:8080/check-cash-on-hand"
      );

      // Assuming cohManualSet.data.setCoh contains the manually set cash value
      const cohManualValue = cohManualSet.data.setCoh || 0; // Default to 0 if not set

      // Calculate total cash on hand
      const cohTotal = (
        cohIncomeValue -
        cohExpensesValue +
        cohManualValue
      ).toFixed(2);

      // Set the calculated cash on hand value
      setCoh(parseFloat(cohTotal));
    } catch (err) {
      console.error("Error fetching cash on hand:", err);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      getYear();
    }
  }, [selectedYear]);

  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1];
  };

  useEffect(() => {
    const monthlyTotals = totalIncome.map(
      (income, index) => income - totalExpenses[index]
    );
    setTotal(monthlyTotals);
    getCoh();
  }, [totalIncome, totalExpenses]);

  const data = {
    labels: filter.map((month) => getMonthName(month)),
    datasets: [
      {
        label: "Income",
        data: totalIncome,
        backgroundColor: "rgba(54, 162, 235, 0.9)",
        borderColor: "#FBFADA",
        borderWidth: 2,
      },
      {
        label: "Expenses",
        data: totalExpenses,
        backgroundColor: "rgba(255, 99, 132, 0.9)",
        borderColor: "#FBFADA",
        borderWidth: 2,
      },
      {
        label: "Total",
        data: total,
        backgroundColor: "rgba(75, 192, 192, 0.9)",
        borderColor: "#FBFADA",
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
    <div className="text-center box-holder">
      <h3>Church Financial status</h3>
      <div className="flex items-center justify-between">
        <div className="btn-holder flex gap-2 pt-2">
          <div>
            <input
              type="number"
              placeholder="Enter year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#FBFADA] px-2 py-1 text-xs rounded-md"
            />
          </div>
        </div>
        <div>
          <p className="text-bold">
            C.O.H:{" "}
            <span className="ml-2 font-semibold text-xl">
              ₱
              {coh.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      </div>
      <div className="pt-5 charts" style={{ width: "100%", height: "100%" }}>
        {hasData ? (
          <Bar data={data} options={chartOptions} />
        ) : (
          <p className="text-3xl text-center text-bold pt-20">
            No record found for the inputted year
          </p>
        )}
      </div>
    </div>
  );
}

export default ChurchExpenses;
