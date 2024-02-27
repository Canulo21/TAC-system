import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faEdit,
  faTrash,
  faClose,
  faCalendar,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

function ChurchAddEvents() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    status: "",
    description: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:8080/getEvents");
      const jsonData = await res.json();
      const formattedData = jsonData.map((event) => {
        const date = new Date(event.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return { ...event, date: formattedDate };
      });

      setData(formattedData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInsertData = async (e) => {
    e.preventDefault();
    setErrors(validateValues(formData));
    const localDate = selectedDate
      ? new Date(
          selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
        )
      : null;

    const formattedDate = localDate
      ? localDate.toISOString().split("T")[0]
      : "";

    try {
      const response = await axios.post("http://localhost:8080/addEvent", {
        ...formData,
        date: formattedDate,
      });

      if (response.data.Status === "Success") {
        console.log("Added successfully");
        // Assuming you have toast.success and setFormData from somewhere
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
        // Reset form data and selected date
        setFormData({
          title: "",
          location: "",
          status: "",
          date: "",
          description: "",
        });
        setSelectedDate(null);
        fetchEvents();
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

  const handleDeleteEvent = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/deleteEvent/${id}`
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
        fetchEvents();
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

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const closeModal = () => {
    setShowModal(false);
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

  return (
    <>
      <h3 className="text-center">Events</h3>
      <ToastContainer />
      <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5 text-center">
        <thead className="bg-[#ADBC9F]">
          <tr>
            <th className="border border-slate-300 p-2 uppercase">id</th>
            <th className="border border-slate-300 p-2 uppercase">title</th>
            <th className="border border-slate-300 p-2 uppercase">location</th>
            <th className="border border-slate-300 p-2 uppercase">date</th>
            <th className="border border-slate-300 p-2 uppercase">status</th>
            <th className="border border-slate-300 p-2 uppercase">action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={index}>
              <td className="border border-slate-300 p-2 ">{d.id}</td>
              <td className="border border-slate-300 p-2 uppercase ">
                {d.title}
              </td>
              <td className="border border-slate-300 p-2 uppercase ">
                {d.location}
              </td>
              <td className="border border-slate-300 p-2 uppercase">
                {d.date}
              </td>
              <td
                className={`border border-slate-300 p-2 uppercase text-bold ${d.status}`}>
                {d.status}
              </td>
              <td className="border border-slate-300 p-2 uppercase">
                <div className="flex gap-2 justify-center">
                  <Link
                    className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#12372a]"
                    to={`/updateEvent/${d.id}`}>
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                    onClick={() => handleDeleteEvent(d.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2 mt-2 mb-5 ml-2 hover:bg-[#2e5491]"
        onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faCalendarPlus} />
        Add Event
      </button>

      {/* MODAL FOR ADD MEMBER */}
      {showModal ? (
        <div className="registration-holder content">
          <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <button
              onClick={closeModal}
              className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
              <FontAwesomeIcon icon={faClose} />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-5 pt-2 pb-5">
              <label className="text-xl text-bold">Title Event:</label>
              <div className=" w-full">
                <input
                  className="appearance-none block  w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="eg. Youth Fellowship"></input>
                {errors.title ? (
                  <p className="error text-red-600 font-bold">{errors.title}</p>
                ) : null}
              </div>

              <div className=" w-1/3 relataive">
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
                  onChange={handleInputChange}
                  placeholder="eg. Tudela Alliance Church"></input>
                {errors.location ? (
                  <p className="error text-red-600 font-bold">
                    {errors.location}
                  </p>
                ) : null}
              </div>

              <div className=" w-auto relative">
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
                    selected={selectedDate}
                    name="date"
                    onChange={(date) => {
                      setSelectedDate(date);
                      setFormData({
                        ...formData,
                        date: date
                          ? date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })
                          : "", // Format the date
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
                  <p className="error text-red-600 font-bold">{errors.date}</p>
                ) : null}
              </div>
              <div className="w-1/3 relative">
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
                    onChange={handleInputChange}>
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

              <div className=" w-1/3 relataive">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-description ">
                  Desciption
                </label>
                <textarea
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              onClick={handleInsertData}
              className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button">
              Save
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default ChurchAddEvents;
