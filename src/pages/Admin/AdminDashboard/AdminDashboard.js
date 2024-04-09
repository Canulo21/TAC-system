import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import mensPic from "../../../Assets/images/mens.png";
import womensPic from "../../../Assets/images/womens.png";
import youngPeoplePic from "../../../Assets/images/yp.png";
import kidsPic from "../../../Assets/images/kid.png";
import ChurchPopulation from "./ChurchPopulation";
import ChurchExpenses from "./ChurchExpenses";
import ChurchEvents from "./ChurchEvents";

//motion
import { motion } from "framer-motion";
import { fadeIn } from "../../../variants";
import Baptized from "./Baptized";
import IsBirthday from "./IsBirthday";

function AdminDashboard() {
  const [categoryCounts, setCategoryCounts] = useState({
    Mens: 0,
    Womens: 0,
    "Young People": 0,
    Kids: 0,
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/categorized`);
      const jsonData = await response.json();

      const newCategoryCounts = {
        Mens: 0,
        Womens: 0,
        "Young People": 0,
        Kids: 0,
      };

      jsonData.forEach((user) => {
        const category = user.category;
        if (newCategoryCounts.hasOwnProperty(category)) {
          newCategoryCounts[category] += 1;
        }
      });

      setCategoryCounts(newCategoryCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="px-10">
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.3 }}
          className="category-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div
              key={category}
              className={`card rounded overflow-hidden shadow-lg bg-[#FBFADA] w-full ${
                category === "Mens"
                  ? "mens-class"
                  : category === "Womens"
                  ? "womens-class"
                  : category === "Young People"
                  ? "young-people-class"
                  : category === "Kids"
                  ? "kids-class"
                  : ""
              }`}>
              <div className="flex justify-center pt-5">
                <img
                  src={
                    category === "Mens"
                      ? mensPic
                      : category === "Womens"
                      ? womensPic
                      : category === "Young People"
                      ? youngPeoplePic
                      : category === "Kids"
                      ? kidsPic
                      : ""
                  }
                  alt={category}
                  title={category}
                  width="50px"
                />
              </div>

              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">
                  {category}
                </div>

                <p className="text-gray-700 font-bold text-xl text-center">
                  {count}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="middle-part flex justify-between pt-5 gap-5 px-10">
        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.5 }}
          className="p-5 border-2 border-green-50 rounded-xl w-4/5">
          <ChurchExpenses />
        </motion.div>
        <motion.div
          variants={fadeIn("left", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.5 }}
          className="p-5 border-2 border-green-50 rounded-xl w-1/3">
          <ChurchPopulation />
        </motion.div>
      </div>
      <div className="middle-part flex justify-between gap-5 px-10">
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.5 }}
          className="p-5 border-2 border-green-50 rounded-xl mt-5 w-3/5">
          <ChurchEvents />
        </motion.div>
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: true, amount: 0.5 }}
          className="p-5 border-2 border-green-50 rounded-xl mt-5 w-3/5">
          <Baptized />
        </motion.div>
      </div>

      {/* for birthday notification */}
      <div className="">
        <IsBirthday />
      </div>
    </>
  );
}

export default AdminDashboard;
