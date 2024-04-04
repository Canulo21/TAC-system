import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function Baptized() {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBaptized, setIsBaptized] = useState(0);
  const [notBaptized, setNotBaptized] = useState(0);
  const [baptizedYes, setBaptizedYes] = useState([]);
  const [baptizedNo, setBaptizedNo] = useState([]);
  const [showBaptizedModal, setShowBaptizedModal] = useState(false); // New state variable for baptized modal
  const [showNotBaptizedModal, setShowNotBaptizedModal] = useState(false); // New state variable for not baptized modal

  const fetchIsBaptized = async () => {
    try {
      const res = await fetch("http://localhost:8080/getIsBaptized");
      const data = await res.json();

      const baptizedYesData = data.filter(
        (person) => person.baptized === "Yes"
      );
      const baptizedNoData = data.filter((person) => person.baptized === "No");

      setIsBaptized(baptizedYesData.length);
      setNotBaptized(baptizedNoData.length);

      setBaptizedYes(baptizedYesData);
      setBaptizedNo(baptizedNoData);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (modalType) => {
    if (modalType === "isBaptized") {
      setShowBaptizedModal(true);
    } else if (modalType === "notBaptized") {
      setShowNotBaptizedModal(true);
    }
  };

  const closeModal = () => {
    setShowBaptizedModal(false);
    setShowNotBaptizedModal(false);
  };

  useEffect(() => {
    fetchIsBaptized();
  }, []);

  return (
    <>
      <h3 className="text-center">Baptized</h3>

      <div className="flex justify-evenly pt-6">
        <div className="max-w-sm card rounded overflow-hidden shadow-lg bg-[#FBFADA] w-full mens-class text-center py-6 px-2">
          <h4 className="text-gray-900 pb-3">Is Baptized</h4>
          <button
            onClick={() => openModal("isBaptized")}
            className="link-button text-5xl font-bold">
            {isBaptized}
          </button>
        </div>
        <div className="max-w-sm card rounded overflow-hidden shadow-lg bg-[#FBFADA] w-full mens-class text-center py-6 px-2">
          <h4 className="text-gray-900 pb-3">Not Yet Baptized</h4>
          <button
            onClick={() => openModal("notBaptized")}
            className="link-button text-5xl font-bold">
            {notBaptized}
          </button>
        </div>
      </div>

      {showBaptizedModal && (
        <EventModal
          baptizedYes={baptizedYes}
          onClose={closeModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {showNotBaptizedModal && (
        <EventModals
          baptizedNo={baptizedNo}
          onClose={closeModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
    </>
  );
}

function EventModal({ baptizedYes, onClose, searchTerm, setSearchTerm }) {
  const [filteredBaptizedYes, setFilteredBaptizedYes] = useState([]);
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

  useEffect(() => {
    const newFilteredData = baptizedYes.filter(
      (d) =>
        (d.fname && d.fname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.mname && d.mname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.lname && d.lname.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredBaptizedYes(newFilteredData);
  }, [searchTerm, baptizedYes]);

  return (
    <motion.div
      className="modal absolute event-modal modal-list"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={modalTransition}>
      <div className="modal-content w-3/5">
        <button
          onClick={onClose}
          className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-black">List Of Baptized</h2>
        <div className="pt-5">
          <div className="search-holder flex items-center gap-2 mt-10">
            <FontAwesomeIcon className="text-black text-xl" icon={faSearch} />
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
              </tr>
            </thead>
            <tbody>
              {filteredBaptizedYes.map((person, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-slate-300 p-2 ">
                    {person.user_id}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase">
                    {person.fname}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase">
                    {person.mname}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase">
                    {person.lname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function EventModals({ baptizedNo, onClose, searchTerm, setSearchTerm }) {
  const [filteredBaptizedNo, setFilteredBaptizedNo] = useState([]);
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

  useEffect(() => {
    const newFilteredData = baptizedNo.filter(
      (d) =>
        (d.fname && d.fname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.mname && d.mname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.lname && d.lname.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredBaptizedNo(newFilteredData);
  }, [searchTerm, baptizedNo]);

  return (
    <motion.div
      className="modal absolute event-modal modal-list"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={modalTransition}>
      <div className="modal-content w-3/5">
        <button
          onClick={onClose}
          className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-black">List of Those Not Yet Baptized</h2>
        <div className="pt-5">
          <div className="search-holder flex items-center gap-2 mt-10">
            <FontAwesomeIcon className="text-black text-xl" icon={faSearch} />
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
              </tr>
            </thead>
            <tbody>
              {filteredBaptizedNo.map((person, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-slate-300 p-2 ">
                    {person.user_id}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase">
                    {person.fname}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase">
                    {person.mname}
                  </td>
                  <td className="border border-slate-300 p-2 uppercase">
                    {person.lname}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Baptized;
