import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClose,
  faChevronDown,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

function ChurchUpdateEvents() {
  const [setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    date: "",
    status: "",
    location: "",
    description: "",
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewEvent/${id}`)
      .then((res) => {
        const getData = res.data;

        if (getData) {
          const date = new Date(getData.date);
          const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          );
          const formattedDate = localDate.toISOString().split("T")[0];

          setFormData({
            id: getData.id,
            title: getData.title || "",
            location: getData.location || "",
            status: getData.status || "",
            description: getData.description || "",
            date: formattedDate,
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors(validateValues(formData));
    try {
      const updateEvent = await axios.put(
        `http://localhost:8080/updateEvent/${id}`,
        {
          data: formData,
        }
      );

      if (updateEvent.data.updated) {
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
      if (err.response && err.response.status === 400) {
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

    if (inputValues.title.trim() === "") {
      errors.title = "Provide Title";
    }
    if (inputValues.location.trim() === "") {
      errors.location = "Provide Location";
    }
    if (!inputValues.date || inputValues.date.trim() === "") {
      errors.date = "Provide Date";
    }
    if (inputValues.status.trim() === "") {
      errors.status = "Provide Status";
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
      <div className="registration-holder content">
        <h3 className="text-center pb-5">Update Event</h3>
        <ToastContainer />
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}>
          <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <Link
              className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md"
              to={"/events"}>
              <FontAwesomeIcon icon={faClose} />
            </Link>
            <label className="text-xl text-bold block text-center pt-10">
              Title Event:
            </label>
            <div className=" gap-5 pt-2 pb-5">
              <div className="w-full mb-5">
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="eg. Youth Fellowship"
                />
                {errors.title ? (
                  <p className="error text-red-600 font-bold">{errors.title}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="w-full relataive">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-birth-date">
                    Location
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <input
                    className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    placeholder="eg. Tudela Alliance Church"
                  />
                  {errors.location ? (
                    <p className="error text-red-600 font-bold">
                      {errors.location}
                    </p>
                  ) : null}
                </div>

                <div className="w-full relative">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-birth-date">
                    Date
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <div className="w-auto relative">
                    <DatePicker
                      className="appearance-none block w-full bg-gray-200 w-full text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-birth-date"
                      selected={formData.date}
                      name="birthdate"
                      onChange={(date) => {
                        setSelectedDate(date);
                        setFormData({
                          ...formData,
                          date: date,
                        });
                      }}
                      placeholderText="Click to select a date"
                      showYearDropdown
                      scrollableYearDropdown
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FontAwesomeIcon icon={faCalendar} />
                    </div>
                  </div>
                  {errors.date ? (
                    <p className="error text-red-600 font-bold">
                      {errors.date}
                    </p>
                  ) : null}
                </div>

                <div className="w-full relative">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name">
                    Status
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-position"
                      name="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }>
                      <option value=""></option>
                      <option value="Post">Post</option>
                      <option value="Hold">Hold</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>
                  {errors.status ? (
                    <p className="error text-red-600 font-bold">
                      {errors.status}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className=" w-full relataive">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-description ">
                  Desciption
                </label>
                <textarea
                  className="appearance-none block w-full h-32 bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-description "
                  name="description" // Provide a name attribute
                  value={formData.description} // Use formData to get and set the value
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="What to do"></textarea>
              </div>
            </div>
            <button
              onClick={handleUpdate}
              className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button">
              Update
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default ChurchUpdateEvents;
