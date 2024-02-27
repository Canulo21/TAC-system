import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function EventModal({ event, onClose }) {
  return (
    <div className="modal absolute event-modal">
      <div className="modal-content">
        <button
          onClick={onClose}
          className="float-right pt-2 pb-2 pl-5 pr-5 bg-[#436850] hover:bg-[#12372A] text-white rounded-md">
          <FontAwesomeIcon icon={faClose} />
        </button>
        <h2 className="text-black">{event.title}</h2>
        <p className="text-black">
          <span>Location:</span> {event.location}
        </p>
        <p className="text-black">
          <span>Date:</span> {event.date}
        </p>
        <div className="pt-10 text-center description">
          <p className="text-black">
            <span>Desciption:</span>
          </p>
          <p className="text-black">{event.description}</p>
        </div>
      </div>
    </div>
  );
}

function ChurchEvents() {
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEventsPost();
  }, []);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/viewEvent/${id}`)
      .then((res) => {
        console.log("Server response:", res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      <h3 className="text-center">Events</h3>
      <div className="pt-5">
        {data.length > 0 ? (
          data.map((event, index) => (
            <div key={index} className="p-3">
              <p className="text-3xl py-1">
                <label className="w-36 inline-block text-bold">Title:</label>
                <button
                  onClick={() => openModal(event)}
                  className="link-button">
                  {event.title}
                </button>
              </p>
              <p className="text-3xl py-1">
                <label className="w-36 inline-block text-bold">Location:</label>
                <span className="uppercase">{event.location}</span>
              </p>
              <p className="text-3xl py-1">
                <label className="w-36 inline-block text-bold">Date:</label>
                <span className="uppercase">{event.date}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-3xl text-center text-bold">No Events Posted</p>
        )}
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={closeModal} />
      )}
    </>
  );
}

export default ChurchEvents;
