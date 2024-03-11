import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateValues(username, password));
    axios
      .post("http://localhost:8080/login", { username, password })
      .then((res) => {
        if (res.status === 200) {
          const {
            fname: inUsedBy,
            profile_pic_url: inPicBy,
            user_id: inUserId,
          } = res.data[0];
          console.log(inPicBy);
          onLogin(inUserId, inUsedBy, inPicBy);
          toast.success("Successfully Login! 👌", {
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
      })
      .catch((err) => {
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            toast.error("Incorrect username or password", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else if (status === 404) {
            toast.error("User not found", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else if (status === 400) {
            toast.error("Should not be Empty!!", {
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
            // Handle other errors
            console.log("here", err);
          }
        }
      });
  };

  const validateValues = (username, password) => {
    let errors = {};

    if (username.trim() === "") {
      errors.username = "Provide Username";
      console.log(errors.username);
    }
    if (password.trim() === "") {
      errors.password = "Provide Password";
      console.log(errors.password);
    }

    return errors;
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-holder w-2/6">
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-lg font-bold" htmlFor="username">
                Username:
              </label>
              <input
                className="appearance-none w-full  block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username ? (
                <p className="error text-red-600 text-sm font-bold">
                  {errors.username}
                </p>
              ) : null}
            </div>
            <div>
              <label className="text-lg font-bold" htmlFor="password">
                Password:
              </label>
              <input
                className="appearance-none w-full  block bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password ? (
                <p className="error text-red-600 text-sm font-bold">
                  {errors.password}
                </p>
              ) : null}
            </div>
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2 mt-2 mb-5 ml-2 hover:bg-[#2e5491]"
                type="submit">
                Login
              </button>
              <Link className="pt-5 font-medium underline" to={"/dashboard/"}>
                Go to dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
