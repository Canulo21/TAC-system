import { useEffect, useState } from "react";
import cake from "../../../Assets/images/cake.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { fadeIn } from "../../../variants";

function EventModal({ onClose, birthdays }) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
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
  const currentMonthName = monthNames[currentMonth];

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
        <h2 className="text-black">
          Happy Birthday month of {currentMonthName} !!
        </h2>
        <div className="pt-10">
          {birthdays.map((person, index) => (
            <h4 className="text-gray-900 text-2xl pb-2 text-center" key={index}>
              {person}
            </h4>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function IsBirthday() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [birthdays, setBirthdays] = useState([]);
  const [getNum, setGetNum] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getBirthday = async () => {
    try {
      const res = await fetch("http://localhost:8080/getIsBirthday");
      const data = await res.json();

      const birthdaysList = data.map((person) => person.fullname);
      setBirthdays(birthdaysList);
      const numberOfBirthdays = birthdaysList.length;
      setGetNum(numberOfBirthdays);
    } catch (err) {
      console.error("Error fetching birthdays:", err);
    }
  };

  useEffect(() => {
    getBirthday();
  }, []);

  return (
    <>
      {getNum !== 0 && (
        <>
          {isModalOpen && (
            <EventModal onClose={closeModal} birthdays={birthdays} />
          )}
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true, amount: 0.3 }}
            className="fixed top-10 right-10">
            <div className="flex bg-[#FBFADA] w-fit p-3 rounded-full shadow-lg relative wiggle">
              <button onClick={openModal} className="link-button">
                <span className="absolute bg-red-700 text-xl font-semibold text-gray-50 px-3 py-1 rounded-full -right-1 -top-1">
                  {getNum}
                </span>
                <img src={cake} alt="cake" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default IsBirthday;
