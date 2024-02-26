import { useState, useEffect } from "react";
import "./Registration.css";
import avatarProfile from "../../../Assets/images/avatar.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCalendar,
  faEdit,
  faUserPlus,
  faTrash,
  faClose,
  faArrowLeftLong,
  faArrowRightLong,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Registration() {
  const [avatar, setAvatar] = useState(null);
  const [data, setData] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(avatarProfile);
  const [birthDate, setBirthDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataImage, setDataImage] = useState([]);
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    gender: "",
    birthdate: "",
    category: "",
    position: "",
  });

  const handleImage = (e) => {
    setAvatar(e.target.files[0]);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/users?order=desc");
      const jsonData = await response.json();

      const formattedData = jsonData.map((user) => {
        const birthdate = new Date(user.birthdate);
        const formattedBirthdate = birthdate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return { ...user, birthdate: formattedBirthdate };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newFilteredData = data.filter(
      (d) =>
        d.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.mname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.lname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(newFilteredData);

    setCurrentPage(1);
  }, [searchTerm, data]);

  const getSlicedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Return filteredData if it exists, otherwise return the original data
    return filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : data.slice(startIndex, endIndex);
  };

  // Pagination controls
  const itemsPerPage = 10;
  const pagesPerBatch = 10;
  const totalBatches = Math.ceil(data.length / itemsPerPage);
  const currentBatch = Math.ceil(currentPage / pagesPerBatch);
  const startPage = (currentBatch - 1) * pagesPerBatch + 1;
  const endPage = Math.min(startPage + pagesPerBatch - 1, totalBatches);

  // Check if there is data to display
  const hasData = data.length > 0;

  // Determine whether to show the right arrow
  const showRightArrow = currentBatch < totalBatches && endPage < totalBatches;

  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((res) => {
        setDataImage(res.data); // Assuming res.data is an array and you want to set the state with the first element
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInsertData = async (e) => {
    e.preventDefault();
    setErrors(validateValues(formData));

    // Adjust the date to the local time zone
    const localBirthDate = birthDate
      ? new Date(birthDate.getTime() - birthDate.getTimezoneOffset() * 60000)
      : null;

    // Format the birthdate to 'YYYY-MM-DD'
    const formattedBirthdate = localBirthDate
      ? localBirthDate.toISOString().split("T")[0]
      : "";

    const imagedata = new FormData();
    imagedata.append("file", avatar);
    imagedata.append("fname", formData.fname);
    imagedata.append("mname", formData.mname);
    imagedata.append("lname", formData.lname);
    imagedata.append("gender", formData.gender);
    imagedata.append("birthdate", formattedBirthdate);
    imagedata.append("category", formData.category);
    imagedata.append("position", formData.position);

    try {
      const response = await axios.post(
        "http://localhost:8080/addMember",
        imagedata
      );

      if (response.data.message === "Data inserted successfully") {
        toast.success("Member Added Successfully! 👌", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Clear input fields after successful insertion
        setFormData({
          fname: "",
          mname: "",
          lname: "",
          gender: "",
          birthdate: "",
          category: "",
          position: "",
        });
        setBirthDate(null);

        // Fetch the updated data
        fetchData();
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Data already exists, display a warning
        toast.error("Member already exists!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.response && error.response.status === 400) {
        // Data already exists, display a warning
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
      } else {
        // Other errors
        console.error("Error inserting data:", error);
        toast.error("Something Went Wrong!!:", error, {
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

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/deleteMember/${userId}`
      );
      console.log(response.data);

      // Check if the response contains the success message
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
        fetchData();
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

  const [errors, setErrors] = useState({});

  const validateValues = (inputValues) => {
    let errors = {};
    if (inputValues.fname.trim() === "") {
      errors.fname = "Provide Firstname";
    }
    if (inputValues.lname.trim() === "") {
      errors.lname = "Provide Lastname";
    }
    if (!inputValues.birthdate || inputValues.birthdate.trim() === "") {
      errors.birthdate = "Provide Birthdate";
    }
    if (inputValues.gender.trim() === "") {
      errors.gender = "Choose Gender";
    }
    if (inputValues.position.trim() === "") {
      errors.position = "Choose Position";
    }
    if (inputValues.category.trim() === "") {
      errors.category = "Choose Category";
    }
    if (!inputValues.profile_pic_url) {
      errors.profile_pic_url = "Provide Picture";
    }
    return errors;
  };

  return (
    <>
      <div className="relative">
        <h1>Registration</h1>
        <ToastContainer />
        <div className="search-holder flex items-center gap-2 mt-10">
          <FontAwesomeIcon className="text-white text-xl" icon={faSearch} />
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <table className="table-auto mt-2 bg-[#f6fdef] shadow-md px-8 pt-6 pb-8 mb-4 w-full border-collapse border border-slate-400 p-5 ">
          <thead className="bg-[#ADBC9F]">
            <tr>
              <th className="border border-slate-300 p-2">Id</th>
              <th className="border border-slate-300 p-2">Firstname</th>
              <th className="border border-slate-300 p-2">Middlename</th>
              <th className="border border-slate-300 p-2">Lastname</th>
              <th className="border border-slate-300 p-2">Gender</th>
              <th className="border border-slate-300 p-2">Birthdate</th>
              <th className="border border-slate-300 p-2">Category</th>
              <th className="border border-slate-300 p-2">Position</th>
              <th className="border border-slate-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {getSlicedData().map((d, index) => (
              <tr key={index} className="text-center">
                <td className="border border-slate-300 p-2 ">{d.user_id}</td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.fname}
                </td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.mname}
                </td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.lname}
                </td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.gender}
                </td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.birthdate}
                </td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.category}
                </td>
                <td className="border border-slate-300 p-2 uppercase">
                  {d.position}
                </td>
                <td className="border border-slate-300 p-2">
                  <div className="flex gap-2 justify-center">
                    <Link
                      className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#12372a]"
                      to={`/updateMember/${d.user_id}`}>
                      <FontAwesomeIcon icon={faEdit} />
                      Edit
                    </Link>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#a93737]"
                      onClick={() => handleDelete(d.user_id)}>
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
          <FontAwesomeIcon icon={faUserPlus} />
          Add
        </button>
        {/* Pagination controls */}
        {hasData && pagesPerBatch <= 10 && (
          <div className="pt-5 flex justify-center gap-2">
            {currentBatch > 1 && (
              <button
                className="font-bold pagi"
                onClick={() =>
                  setCurrentPage((currentBatch - 2) * pagesPerBatch + 1)
                }>
                <FontAwesomeIcon icon={faArrowLeftLong} />
              </button>
            )}

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, index) => startPage + index
            ).map((page) => (
              <button
                className={`font-bold pagi ${
                  currentPage === page ? "active" : ""
                }`}
                key={page}
                onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            ))}

            {showRightArrow && (
              <button
                className="font-bold pagi"
                onClick={() =>
                  setCurrentPage(currentBatch * pagesPerBatch + 1)
                }>
                <FontAwesomeIcon icon={faArrowRightLong} />
              </button>
            )}
          </div>
        )}

        {/* MODAL FOR ADD MEMBER */}
        {showModal ? (
          <div className="registration-holder ">
            <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <button
                onClick={closeModal}
                className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
                <FontAwesomeIcon icon={faClose} />
              </button>
              <div className="Avatar flex justify-center">
                {dataImage && dataImage.profile_pic_url ? (
                  <img
                    className="rounded-full ring-2 ring-gray-300 w-32 h-32 dark:ring-gray-500 p-1"
                    src={`http://localhost:8080/profilepics/${dataImage.profile_pic_url}`}
                    alt="Selected Avatar"
                  />
                ) : (
                  <img
                    className="rounded-full ring-2 ring-gray-300 w-32 h-32 dark:ring-gray-500 p-1"
                    src={avatarUrl}
                    alt="Selected Avatar"
                  />
                )}
              </div>
              <div className="flex items-center flex-col mb-2 mt-10">
                <input type="file" onChange={handleImage} accept="image/*" />
              </div>
              {errors.profile_pic_url ? (
                <p className="error text-red-600 font-bold text-center">
                  {errors.profile_pic_url}
                </p>
              ) : null}
              <div className="flex flex-wrap -mx-3 mb-6 mt-10">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-first-name">
                    First Name{" "}
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-first-name"
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleInputChange}
                    placeholder="eg. Juan"
                    required
                  />
                  {errors.fname ? (
                    <p className="error text-red-600 font-bold">
                      {errors.fname}
                    </p>
                  ) : null}
                </div>
                <div className="w-full md:w-1/3 px-3 pt-2">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name">
                    Middle Name
                    <span className="text-gray-400 font-bold align-super text-xs ml-2">
                      (optional)
                    </span>
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    name="mname"
                    value={formData.mname}
                    onChange={handleInputChange}
                    placeholder="eg. Dela"
                  />
                </div>
                <div className="w-full md:w-1/3 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name">
                    Last Name
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleInputChange}
                    placeholder="eg. Cruz"
                  />
                  {errors.lname ? (
                    <p className="error text-red-600 font-bold">
                      {errors.lname}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="px-3 mb-6 md:mb-0 md:w-1/4">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-birth-date">
                    Birthdate
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <div className="relative w-full">
                    <DatePicker
                      className="appearance-none block w-full bg-gray-200 w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-birth-date"
                      selected={birthDate}
                      name="birthdate"
                      onChange={(date) => {
                        setBirthDate(date);
                        setFormData({
                          ...formData,
                          birthdate: date
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
                  {errors.birthdate ? (
                    <p className="error text-red-600 font-bold">
                      {errors.birthdate}
                    </p>
                  ) : null}
                </div>
                <div className="w-full md:w-1/4 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name">
                    Gender
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-position"
                      name="gender" // Corrected attribute name here
                      value={formData.gender}
                      onChange={handleInputChange}>
                      <option value=""></option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>
                  {errors.gender ? (
                    <p className="error text-red-600 font-bold">
                      {errors.gender}
                    </p>
                  ) : null}
                </div>
                <div className="w-full md:w-1/4 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name">
                    Position
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-position"
                      name="position" // Corrected attribute name here
                      value={formData.position}
                      onChange={handleInputChange}>
                      <option value=""></option>
                      <option value="Member">Member</option>
                      <option value="Praise and Worship Team">
                        Praise and Worship Team
                      </option>
                      <option value="Elder">Elder</option>
                      <option value="Beautification">Beautification</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>
                  {errors.position ? (
                    <p className="error text-red-600 font-bold">
                      {errors.position}
                    </p>
                  ) : null}
                </div>
                <div className="w-full md:w-1/4 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-last-name">
                    Category
                    <span className="text-red-600 font-bold text-lg"> *</span>
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      name="category" // Corrected attribute name here
                      value={formData.category}
                      onChange={handleInputChange}>
                      <option value=""></option>
                      <option value="Mens">Mens</option>
                      <option value="Womens">Womens</option>
                      <option value="Young People">Young People</option>
                      <option value="Kids">Kids</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>
                  {errors.category ? (
                    <p className="error text-red-600 font-bold">
                      {errors.category}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={handleInsertData}
                  className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button">
                  Save
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Registration;
