import { useState, useEffect, useRef } from "react";
import "./ChurchFinancial.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../../variants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faEyeSlash,
  faPrint,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import SetCashOnHand from "./SetCashOnHand";
import AddFund from "./AddFund";

function ChurchFinancial() {
  const [data, setData] = useState([]);
  const [financial, setFinancial] = useState([]);
  const [upMoney, setUpMoney] = useState("");
  const [exMoney, setExMoney] = useState("");
  const [useFor, setUseFor] = useState("");
  const [errors, setErrors] = useState({});
  const [errorsIncome, setErrorsIncome] = useState({});
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [searchIncomeFromDate, setSearchIncomeFromDate] = useState("");
  const [searchIncomeToDate, setSearchIncomeToDate] = useState("");

  const handleUpMoneyChange = (e) => {
    e.preventDefault();
    setUpMoney(e.target.value);
  };
  const handleExMoneyAmount = (e) => {
    e.preventDefault();
    setExMoney(e.target.value);
  };
  const handleExMoneyFor = (e) => {
    e.preventDefault();
    setUseFor(e.target.value);
  };

  const handleInsertData = async (e) => {
    e.preventDefault();
    setErrorsIncome(validateFinance(upMoney));
    const currentDate = new Date().toISOString();

    try {
      const res = await axios.post("http://localhost:8080/upMoney", {
        up_money: upMoney,
        date: currentDate,
      });

      if (res.data.Status === "Success") {
        toast.success("Amount Added Successfully! 👌", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setUpMoney("");
        fetchFinancialData();
      } else {
        console.error("Failed to post data");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Please provide the required field", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  const handleExpensesData = async (e) => {
    e.preventDefault();
    setErrors(validateValues(useFor, exMoney));
    const currentDate = new Date().toISOString();

    try {
      const res = await axios.post("http://localhost:8080/exMoney", {
        amount: exMoney,
        used_for: useFor,
        date: currentDate,
      });

      if (res.data.Status === "Success") {
        toast.success("Added Successfully! 👌", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setExMoney("");
        setUseFor("");

        fetchExpensesData();
      } else {
        console.error("Failed to post data");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Please provide the required field", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };
  const validateFinance = (up_money) => {
    let errorsIncome = {};
    if (up_money.trim() === "") {
      errorsIncome.up_money = "Provide Amount";
    }
    return errorsIncome;
  };

  const validateValues = (used_for, amount) => {
    let errors = {};
    if (used_for.trim() === "") {
      errors.used_for = "Provide Purpose";
    }
    if (amount.trim() === "") {
      errors.amount = "Provide Amount";
    }
    return errors;
  };

  const fetchExpensesData = async () => {
    try {
      const res = await fetch("http://localhost:8080/expenses");
      const jsonData = await res.json();

      const formattedData = jsonData.map((expenses) => {
        const date = new Date(expenses.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return { ...expenses, date: formattedDate };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const res = await fetch("http://localhost:8080/getFinancial");
      const jsonData = await res.json();

      const formattedData = jsonData.map((financial) => {
        const date = new Date(financial.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return { ...financial, date: formattedDate };
      });

      setFinancial(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/deleteFinancial/${id}`
      );
      if (response.data.message === "Data deleted successfully") {
        // Update state to trigger re-render
        toast.info("Data deleted successfully! 👌", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        fetchExpensesData();
      } else {
        console.error("Error deleting data:", response.data.message);
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  // Add these event handlers to update the search dates
  const handleSearchFromDate = (event) => {
    setSearchFromDate(event.target.value);
  };

  const handleSearchToDate = (event) => {
    setSearchToDate(event.target.value);
  };

  const handleIncomeSearchFromDate = (event) => {
    setSearchIncomeFromDate(event.target.value);
  };

  const handleIncomeSearchToDate = (event) => {
    setSearchIncomeToDate(event.target.value);
  };

  // Modify the filteredData to filter based on the date range
  const filteredData = data.filter((d) => {
    if (searchFromDate && searchToDate) {
      const fromDate = new Date(searchFromDate);
      const toDate = new Date(searchToDate);
      const expenseDate = new Date(d.date);
      return expenseDate >= fromDate && expenseDate <= toDate;
    }
    return true;
  });

  const filteredFinancial = financial.filter((d) => {
    if (searchIncomeFromDate && searchIncomeToDate) {
      const fromDate = new Date(searchIncomeFromDate);
      const toDate = new Date(searchIncomeToDate);
      const incomeDate = new Date(d.date);
      return incomeDate >= fromDate && incomeDate <= toDate;
    }
    return true;
  });

  const [isHidden, setIsHidden] = useState(false);
  const componentPDF = useRef();
  const componentIncomePDF = useRef();

  const expensesPDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Expenses Data",
    onAfterPrint: () => {
      alert("Data saved in PDF");
    },
  });

  const incomePDF = useReactToPrint({
    content: () => componentIncomePDF.current,
    documentTitle: "Expenses Data",
    onAfterPrint: () => {
      alert("Data saved in PDF");
    },
  });

  const handleExpensesAction = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      <div className="text-center">
        <ToastContainer />
      </div>
      <div className="flex gap-5 mb-5" style={{ alignItems: "normal" }}>
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="w-1/2"
        >
          <SetCashOnHand />
        </motion.div>
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="w-1/2"
        >
          <AddFund />
        </motion.div>
      </div>

      <div className="mt-2">
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="card-holder pt-5 pb-2 px-5 mb-5"
        >
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
          ></motion.div>
          <div className="form-holder">
            <form>
              <div className="flex flex-wrap items-center justify-center gap-5 pt-2 pb-5 ">
                <label className="text-xl text-bold">Amount:</label>
                <div className=" w-1/4">
                  <input
                    className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    name="up_money"
                    value={upMoney}
                    onChange={handleUpMoneyChange}
                    placeholder="XxxX"
                  ></input>
                  {errorsIncome.up_money ? (
                    <p className="error text-red-600 font-bold absolute">
                      {errorsIncome.up_money}
                    </p>
                  ) : null}
                </div>
                <button
                  onClick={handleInsertData}
                  className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="table-holder">
            <div className="search-holder flex items-center gap-2 pt-5">
              <FontAwesomeIcon icon={faSearch} />
              <span className="font-bold">From:</span>
              <input
                type="date"
                placeholder="Search Date From"
                value={searchIncomeFromDate}
                onChange={handleIncomeSearchFromDate}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <span className="font-bold">To:</span>
              <input
                type="date"
                placeholder="Search Date To"
                value={searchIncomeToDate}
                onChange={handleIncomeSearchToDate}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <button
                className="bg-blue-500 uppercase text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#2e5491]"
                onClick={incomePDF}
              >
                Print
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div ref={componentIncomePDF}>
                <h2 className="text-black text-center">Income</h2>
                <table className="table-auto mt-1 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
                  <thead>
                    <tr>
                      <th className="border border-slate-300 p-2 bg-[#adbc9f]">
                        Amount
                      </th>
                      <th className="border border-slate-300 p-2 bg-[#adbc9f]">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFinancial.slice(0, 10).map((d, index) => (
                      <tr key={index}>
                        <td className="text-center text-sm text-bold border border-slate-300 p-2 uppercase">
                          {d.up_money}
                        </td>
                        <td className="text-center text-sm text-bold border border-slate-300 p-2 uppercase">
                          {d.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="card-holder p-5"
        >
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
          ></motion.div>
          <div className="form-holder">
            <form>
              <div className="flex flex-wrap items-center justify-center gap-5 pt-2 pb-5">
                <label className="text-xl text-bold">Amount:</label>
                <div className="w-1/4">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    name="amount"
                    value={exMoney}
                    onChange={handleExMoneyAmount}
                    placeholder="XxxX"
                  ></input>
                  {errors.amount ? (
                    <p className="error text-red-600 font-bold absolute">
                      {errors.amount}
                    </p>
                  ) : null}
                </div>
                <label className="text-xl text-bold">Purpose:</label>
                <div className="w-1/4 relative">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="used_for"
                    value={useFor}
                    onChange={handleExMoneyFor}
                    placeholder="for"
                  ></input>
                  {errors.used_for ? (
                    <p className="error text-red-600 font-bold absolute">
                      {errors.used_for}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={handleExpensesData}
                  className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="table-holder">
            <div className="search-holder flex items-center gap-2 pt-5">
              <FontAwesomeIcon icon={faSearch} />
              <span className="font-bold">From:</span>
              <input
                type="date"
                placeholder="Search Date From"
                value={searchFromDate}
                onChange={handleSearchFromDate}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <span className="font-bold">To:</span>
              <input
                type="date"
                placeholder="Search Date To"
                value={searchToDate}
                onChange={handleSearchToDate}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <button
                className="bg-blue-500 uppercase text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#2e5491]"
                onClick={expensesPDF}
              >
                Print
                <FontAwesomeIcon icon={faPrint} />
              </button>
              <button
                className="bg-red-500  uppercase text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                onClick={handleExpensesAction}
              >
                Action
                <FontAwesomeIcon icon={isHidden ? faEyeSlash : faEye} />
              </button>
            </div>
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div ref={componentPDF}>
                <h2 className="text-black text-center">Expenses</h2>
                <table className="table-auto mt-1 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
                  <thead>
                    <tr>
                      <th className="border border-slate-300 p-2 bg-[#adbc9f]">
                        Amount
                      </th>
                      <th className="border border-slate-300 p-2 bg-[#adbc9f]">
                        Purpose
                      </th>
                      <th className="border border-slate-300 p-2 bg-[#adbc9f]">
                        Date
                      </th>
                      {!isHidden && (
                        <th className="border border-slate-300 p-2 bg-[#adbc9f]">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 10).map((d, index) => (
                      <tr key={index}>
                        <td className="text-center text-sm text-bold border border-slate-300 p-2 uppercase">
                          {d.amount}
                        </td>
                        <td className="text-center text-sm text-bold border border-slate-300 p-2 uppercase">
                          {d.used_for}
                        </td>
                        <td className="text-center text-sm text-bold border border-slate-300 p-2 uppercase">
                          {d.date}
                        </td>
                        <td
                          className={`border border-slate-300 p-2 ${
                            isHidden ? "hidden" : ""
                          }`}
                        >
                          <div className="flex gap-2 justify-center">
                            <Link
                              className="bg-green-500 text-white text-sm py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#12372a]"
                              to={`/updateFinancial/${d.id}`}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                              Edit
                            </Link>
                            <button
                              className="bg-red-500 text-white text-sm py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                              onClick={() => handleDelete(d.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ChurchFinancial;
