import React, { useState } from "react";
import { TiUser } from "react-icons/ti";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogout } from "../redux/features/authSlice";
import img from "../assets/44-448187_download-user-icon-png-clipart-computer-icons-user-removebg-preview.png";
import logoutImg from "../assets/Logout.png";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [logout, setLogout] = useState(false);

  const handleLogoutButton = () => {
    setLogout(true);
  };

  const toggleProfileModal = () => {
    setProfileModalVisible(!profileModalVisible);
    setLogout(false);
  };

  const adminLogout = () => {
    dispatch(doLogout());
    navigate("/");
  };

  return (
    <header className="bg-white py-4 pl-64 text-gray-900 flex justify-end lg:justify-between pr-6 lg:pr-0 items-center w-full fixed top-0 z-50">
      <div className="items-center gap-4 relative hidden lg:flex">
        <h1 className="text-[18px] text-black font-semibold">
          {location.pathname.startsWith("/admin") && `Dashboard ${location.pathname.replace("/admin", "")}`}
        </h1>
      </div>

      <div className="relative flex items-center gap-x-4 lg:gap-x-8 pr-0 sm:pr-2 lg:pr-8">
        <button
          className="items-center ml-3 hidden md:flex shadow-md hover:bg-[#022213] hover:text-[#72B800] p-2 rounded-lg"
          onClick={toggleProfileModal}
        >
          <TiUser size={24} />
        </button>

        {profileModalVisible && (
          <div className="absolute top-12 mt-2 right-8 bg-white border border-gray-200 rounded-lg shadow-lg w-72 p-6 z-50">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleProfileModal()}
              onClick={toggleProfileModal}
              className="absolute top-2 right-2 text-2xl rounded-md border-2 border-gray-300 text-gray-600 hover:text-gray-900"
            >
              <IoIosClose />
            </div>


            <div className="flex flex-col items-center">
              <img src={logoutImg} alt="Logout" className="w-22 h-22 rounded-full mb-4" />
              <p className="text-lg font-semibold text-black text-center">Are You Sure You Want to Logout?</p>
              <div className="flex justify-center gap-x-4 mt-6 text-base">
                <button
                  onClick={() => setLogout(false)}
                  className="bg-white font-medium border px-6 text-sm text-gray-900 py-2 rounded-lg hover:bg-[#72B800]"
                >
                  Cancel
                </button>
                <button
                  onClick={adminLogout}
                  className="bg-[#022213] text-white px-6 py-2 text-sm rounded-lg hover:bg-[#72B800]"
                >
                  Logout
                </button>
              </div>
            </div>



          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
