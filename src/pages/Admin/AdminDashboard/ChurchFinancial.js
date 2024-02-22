import { useState, useEffect } from "react";
import "./ChurchFinancial.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChurchFinancial() {
  const [data, setData] = useState([]);
  const [upMoney, setUpMoney] = useState("");
  const [exMoney, setExMoney] = useState("");
  const [useFor, setUseFor] = useState("");
  const [errors, setErrors] = useState({});

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
      } else {
        console.error("Failed to post data");
      }
    } catch (error) {
      console.error("Error posting data:", error);
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
        toast.success("Expenses Added Successfully! 👌", {
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

  return (
    <>
      <div className="text-center">
        <h1>Financial Management</h1>
        <ToastContainer />
      </div>
      <div className="mt-10">
        <div className="card-holder p-5 mb-5">
          <h3>Income</h3>
          <div className="form-holder">
            <form>
              <div className="flex flex-wrap items-center justify-center gap-5 pt-5 pb-5">
                <label className="text-xl text-bold">Amount:</label>
                <input
                  className="appearance-none block w-1/4 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  name="up_money"
                  value={upMoney}
                  onChange={handleUpMoneyChange}
                  placeholder="XxxX"></input>
                <button
                  onClick={handleInsertData}
                  className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="card-holder p-5">
          <h3>Expenses</h3>
          <div className="form-holder">
            <form>
              <div className="flex flex-wrap items-center justify-center gap-5 pt-5 pb-5">
                <label className="text-xl text-bold">Amount:</label>
                <div className="w-1/4">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    name="amount"
                    value={exMoney}
                    onChange={handleExMoneyAmount}
                    placeholder="XxxX"></input>
                  {errors.amount ? (
                    <p className="error text-red-600 font-bold absolute">
                      {errors.amount}
                    </p>
                  ) : null}
                </div>
                <label className="text-xl text-bold">Purpose:</label>
                <div className="w-1/4 relative">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="used_for"
                    value={useFor}
                    onChange={handleExMoneyFor}
                    placeholder="for"></input>
                  {errors.used_for ? (
                    <p className="error text-red-600 font-bold absolute">
                      {errors.used_for}
                    </p>
                  ) : null}
                </div>

                <button
                  onClick={handleExpensesData}
                  className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button">
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="table-holder">
            <table className="table-auto mt-10 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5">
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
                </tr>
              </thead>
              <tbody>
                {data.map((d, index) => (
                  <tr key={index}>
                    <td className="text-center text-bold border border-slate-300 p-2 uppercase">
                      {d.amount}
                    </td>
                    <td className="text-center text-bold border border-slate-300 p-2 uppercase">
                      {d.used_for}
                    </td>
                    <td className="text-center text-bold border border-slate-300 p-2 uppercase">
                      {d.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChurchFinancial;
