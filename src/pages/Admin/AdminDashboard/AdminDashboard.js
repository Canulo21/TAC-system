import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import mensPic from "../../../Assets/images/mens.png";
import womensPic from "../../../Assets/images/womens.png";
import youngPeoplePic from "../../../Assets/images/yp.png";
import kidsPic from "../../../Assets/images/kid.png";
import ChurchPopulation from "./ChurchPopulation";
import ChurchExpenses from "./ChurchExpenses";

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
      <div className="">
        <div className="category-wrapper flex justify-between flex-wrap">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div
              key={category}
              className={`max-w-sm card rounded overflow-hidden shadow-lg bg-[#FBFADA] w-full ${
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
        </div>
      </div>
      <div className="middle-part flex justify-between pt-14 gap-5">
        <div className="p-5 border-2 border-green-50 rounded-xl w-full">
          <ChurchExpenses />
        </div>
        <div className="p-5 border-2 border-green-50 rounded-xl w-1/3">
          <ChurchPopulation />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
