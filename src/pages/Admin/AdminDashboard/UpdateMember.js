import React, { useState, useEffect } from "react";
import "./UpdateMember.css";
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
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import { motion } from "framer-motion";

function UpdateMember() {
  const [avatar, setAvatar] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(avatarProfile);
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

  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  Modal.setAppElement("#root");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewMember/${id}`)
      .then((res) => {
        setDataImage(res.data);
        const memberData = res.data;
        if (memberData) {
          setFormData({
            fname: memberData.fname || "",
            mname: memberData.mname || "",
            lname: memberData.lname || "",
            gender: memberData.gender || "",
            birthdate: memberData.birthdate || "",
            category: memberData.category || "",
            position: memberData.position || "",
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (formData.birthdate) {
      const birthdate = new Date(formData.birthdate);
      const localBirthDate = new Date(
        birthdate.getTime() - birthdate.getTimezoneOffset() * 60000
      );
      const formattedBirthdate = localBirthDate.toISOString().split("T")[0];

      setFormData({
        ...formData,
        birthdate: formattedBirthdate,
      });
    }
  }, [formData.birthdate]);

  const handleImage = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (avatar) {
        const imagedata = new FormData();
        imagedata.append("file", avatar);

        const imageResponse = await axios.put(
          `http://localhost:8080/uploadProfile/${id}`,
          imagedata
        );

        if (imageResponse.data.status === "Success") {
          console.log("Image upload successful!");
          const memberResponse = await axios.get(
            `http://localhost:8080/viewMember/${id}`
          );
          const memberData = memberResponse.data;

          setDataImage(memberData);

          const updatedMemberResponse = await axios.put(
            `http://localhost:8080/updateMember/${id}`,
            {
              data: formData,
            }
          );

          if (updatedMemberResponse.data.updated) {
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
        } else {
          console.log("Image upload failed");
        }
      } else {
        const updatedMemberResponse = await axios.put(
          `http://localhost:8080/updateMember/${id}`,
          {
            data: formData,
          }
        );

        if (updatedMemberResponse.data.updated) {
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
      }
    } catch (error) {
      console.error("Error updating member", error);
      toast.error("Error updating member");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
        <h1>Update Profile</h1>
        <ToastContainer />
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={modalTransition}
          className="registration-holder">
          <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <Link
              to={`/registration`}
              className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
              <FontAwesomeIcon icon={faClose} />
            </Link>
            <div className="Avatar flex justify-center">
              {avatarUrl && (
                <img
                  key={dataImage.user_id}
                  className="rounded-full ring-2 ring-gray-300 w-32 h-32 dark:ring-gray-500 p-1"
                  src={
                    dataImage.profile_pic_url
                      ? `http://localhost:8080/profilepics/${dataImage.user_id}/${dataImage.profile_pic_url}`
                      : avatarUrl
                  }
                  alt="Selected Avatar"
                  onClick={openModal}
                />
              )}
            </div>
            <div className="flex items-center flex-col mb-10 mt-10">
              <input type="file" onChange={handleImage} accept="image/*" />
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fname: e.target.value,
                    })
                  }
                  placeholder="eg. Juan"
                  required
                />
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mname: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lname: e.target.value,
                    })
                  }
                  placeholder="eg. Cruz"
                />
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
                    selected={formData.birthdate}
                    name="birthdate"
                    onChange={(date) => {
                      setBirthDate(date);
                      setFormData({
                        ...formData,
                        birthdate: date,
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
                    name="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value,
                      })
                    }>
                    <option value=""></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                </div>
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
                    name="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        position: e.target.value,
                      })
                    }>
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
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }>
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
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleUpdate}
                className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay">
        {/* Modal Content Here */}
        <div className="text-center relative z-10">
          <img
            key={dataImage.user_id}
            className="rounded-full ring-2 ring-gray-96 w-96 h-96 dark:ring-gray-500 p-1 relative inline-block shadow-2xl"
            src={
              dataImage.profile_pic_url
                ? `http://localhost:8080/profilepics/${dataImage.user_id}/${dataImage.profile_pic_url}`
                : avatarUrl
            }
            alt="Selected Avatar"
          />
          <button onClick={closeModal} className="absolute left-0 right-0">
            <FontAwesomeIcon className="text-3xl  text-white" icon={faClose} />
          </button>
        </div>
      </Modal>
    </>
  );
}

export default UpdateMember;
