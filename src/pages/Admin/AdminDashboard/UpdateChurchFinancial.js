import { useState, useEffect } from "react";
import "./ChurchFinancial.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function UpdateChurchFinancial() {
  const [errors, setErrors] = useState({});
  const [expensesData, setExpensesData] = useState({
    id: "",
    amount: "",
    used_for: "",
    date: "",
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewExpenses/${id}`)
      .then((res) => {
        console.log(res);
        const getData = res.data;

        if (getData) {
          const date = new Date(getData.date); // Use getData.date directly
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          setExpensesData({
            id: getData.id,
            amount: getData.amount || "",
            used_for: getData.used_for || "",
            date: formattedDate, // Use the formatted date
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdateExpenses = async (e) => {
    e.preventDefault();
    setErrors(validateValues(expensesData));
    try {
      const updateExpenses = await axios.put(
        `http://localhost:8080/updateFinancial/${id}`,
        {
          data: expensesData,
        }
      );

      if (updateExpenses.data.updated) {
        toast.success("Updated successfully! 👌", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      if (err.response.status === 400) {
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

  const validateValues = (inputValues) => {
    let errors = {};
    if (inputValues.used_for.trim() === "") {
      errors.used_for = "Provide Purpose";
    }
    if (inputValues.amount.trim() === "") {
      errors.amount = "Provide Amount";
    }
    return errors;
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const modalTransition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  };

  return (
    <>
      <div className="relative">
        <h1>Update Expenses</h1>
        <ToastContainer />
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}
          className="card-holder p-5 mb-5 mt-10">
          <Link
            className="text-white py-2 px-4 w-fit float-right rounded-md flex items-center gap-2 bg-[#436850] hover:bg-[#12372a]"
            to={"/financial"}>
            <FontAwesomeIcon icon={faClose} />
          </Link>
          <h4 className="text-gray-900">id: {expensesData.id}</h4>
          <h5 className="text-gray-900">{expensesData.date}</h5>
          <form>
            <div className="flex flex-wrap items-center justify-center gap-5 pt-5 pb-5">
              <label className="text-xl text-bold">Amount:</label>
              <div className="w-1/4">
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  name="amount"
                  value={expensesData.amount}
                  onChange={(e) =>
                    setExpensesData({
                      ...expensesData,
                      amount: e.target.value,
                    })
                  }
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
                  value={expensesData.used_for}
                  onChange={(e) =>
                    setExpensesData({
                      ...expensesData,
                      used_for: e.target.value,
                    })
                  }
                  placeholder="for"></input>
                {errors.used_for ? (
                  <p className="error text-red-600 font-bold absolute">
                    {errors.used_for}
                  </p>
                ) : null}
              </div>

              <button
                onClick={handleUpdateExpenses}
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Update
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default UpdateChurchFinancial;
