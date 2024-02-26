import { useState, useEffect } from "react";
import axios from "axios";

function ChurchEvents() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
  });
  const fetchEventsPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getEventsBoard`);
      const jsonData = await response.json();
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
    fetchEventsPost();
  }, []);
  return (
    <>
      <h3 className="text-center">Events</h3>
      <div className="pt-5">
        {data.length > 0 ? (
          data.map((d, index) => (
            <div key={index} className="p-3 ">
              <p className="text-3xl py-1">
                <label className="w-36 inline-block text-bold">Title:</label>
                <span className="uppercase">{d.title}</span>
              </p>
              <p className="text-3xl py-1">
                <label className="w-36 inline-block text-bold">Location:</label>
                <span className="uppercase">{d.location}</span>
              </p>
              <p className="text-3xl py-1">
                <label className="w-36 inline-block text-bold">Date:</label>
                <span className="uppercase">{d.date}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-3xl text-center text-bold">No Events Posted</p>
        )}
      </div>
    </>
  );
}

export default ChurchEvents;
