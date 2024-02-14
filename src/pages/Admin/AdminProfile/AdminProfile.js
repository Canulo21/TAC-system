import { useState } from "react";
import avatarProfile from "../../../Assets/images/avatar.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUpload } from "@fortawesome/free-solid-svg-icons";

function AdminProfile() {
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(avatarProfile);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      // Check if the selected file is an image
      setAvatar(selectedFile);
      setAvatarUrl(URL.createObjectURL(selectedFile));
    } else {
      // Handle the case where the selected file is not an image
      console.error("Invalid file type. Please select an image.");
      // You might want to set a default image or handle the error differently
    }
  };

  return (
    <>
      <h1>AdminProfile</h1>
      <div className="mt-10 mr-60 ml-60">
        <form className="bg-[#fafafa] shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="Avatar flex justify-center">
            {avatarUrl && (
              <img
                className="rounded-full ring-2 ring-gray-300 w-32 h-32 dark:ring-gray-500 p-1"
                src={avatarUrl}
                alt="Selected Avatar"
              />
            )}
          </div>
          <div className="flex items-center flex-col mb-10 mt-10">
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name">
                First Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-first-name"
                type="text"
                placeholder="eg. Juan"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name">
                Last Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="eg. Cruz"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username">
              Username
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="text-white bg-[#436850] hover:bg-[#12372a] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button">
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminProfile;
