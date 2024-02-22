import { useState, useEffect } from "react";
import "./ChurchFinancial.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateChurchFinancial() {
  const [expensesData, setExpensesData] = useState({
    amount: "",
    used_for: "",
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewExpenses/${id}`)
      .then((res) => {
        console.log(res);
        const getData = res.data;

        if (getData) {
          setExpensesData({
            amount: getData.amount || "",
            used_for: getData.used_for || "",
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdateExpenses = async (e) => {
    e.preventDefault();
    try {
      const updateExpenses = await axios.put(`/updateFinancial/${id}`, {
        data: expensesData,
      });

      if (updateExpenses.data.updated) {
        console.log("Response from server:", updateExpenses);

        // Additional logic based on the server response
        // For example, update your local state with the new data
        // setLocalData(updateExpenses.data);
      }
    } catch (err) {
      console.log("Error updating expense:", err);
      // Handle errors, display an error message, or perform other actions
    }
  };

  return (
    <>
      <div className="relative">
        <h1>Update Expenses</h1>
        <ToastContainer />
        <div className="card-holder p-5 mb-5 mt-10">
          <h4 className="text-gray-900">id: {}</h4>
          <form>
            <div className="flex flex-wrap items-center justify-center gap-5 pt-5 pb-5">
              <label className="text-xl text-bold">Amount:</label>
              <div className="w-1/4">
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  name="amount"
                  //   value={exMoney}
                  //   onChange={handleExMoneyAmount}
                  placeholder="XxxX"></input>
              </div>
              <label className="text-xl text-bold">Purpose:</label>
              <div className="w-1/4 relative">
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="used_for"
                  //   value={useFor}
                  //   onChange={handleExMoneyFor}
                  placeholder="for"></input>
              </div>

              <button
                onClick={handleUpdateExpenses}
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateChurchFinancial;
