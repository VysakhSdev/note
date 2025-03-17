import React, { useEffect, memo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { MdSpaceDashboard } from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";
import { motion } from "framer-motion";
// import logo from "../assets/Layer_1 (1).png";
import line from "../assets/line.png";

const Menus = [
  // { title: "Dashboard", path: "/overview", icon: <MdSpaceDashboard /> },
  { title: "My Tasks", path: "/overview/tasks", icon: <RiShieldUserFill /> },
  { title: "My Events", path: "/overview/events", icon: <RiShieldUserFill /> },

];

const AdminAside = memo(({ open, setOpen }) => {
  const location = useLocation();

  useEffect(() => {
    Aos.init({ duration: 1800, offset: 0 });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setOpen]);

  const handleMenuClick = useCallback(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [setOpen]);

  return (
    <div
      className={`z-50 sidebar ${open ? "sidebar-open shadow-xl px-3" : "sidebar-closed px-3"} bg-customGreen text-white h-screen py-5 pt-6`}
      style={{ width: open ? "auto" : "6rem", transition: "width 0.3s ease-in-out" }}
    >
    

      <div className="flex gap-x-4 items-center">
        {/* <img src={logo} className={`w-[39px] h-[39px] ${!open ? "ml-4" : "ml-0"}`} alt="Company logo" /> */}
        {open && (
          <span className="transition-all duration-500 ease-in-out pl-1 font-customBold">
            EVENT <span className="bg-gradient-to-br from-[#4aff5c] to-[#5d4fb2] bg-clip-text text-transparent">Manager</span>
          </span>
        )}
      </div>

      <ul className="pt-10 md:pt-6 space-y-0.2">
        {Menus.map((Menu) => (
          <li key={Menu.path} className="flex rounded-md py-1.5 px-2 font-normal cursor-pointer hover:bg-light-white text-sm items-center gap-x-4 transition-all duration-300 ease-in-out">
            <Link to={Menu.path} className="flex items-center gap-x-4">
              {location.pathname === Menu.path && (
                <motion.img
                  src={line}
                  alt=""
                  className="-ml-5 h-5 w-1"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
              <span className="text-xl">{Menu.icon}</span>
              {open && <span className="pl-1 font-customBold">{Menu.title}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default AdminAside;