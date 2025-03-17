import React, { useState, Suspense ,memo} from "react";
import { Outlet } from "react-router-dom";
import AdminAside from "./AdminAside"; // Sidebar component
import Header from "./Header";
import Loader from './Loader2'; // Import Loader

const MainLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
    <Header open={open} setOpen={setOpen} />
    <div className="flex flex-1 overflow-y-auto">
      <AdminAside open={open} setOpen={setOpen} /> {/* No need for useMemo */}
      <div className="flex-1 overflow-y-auto bg-white h-screen pt-16">
        <Suspense fallback={<Loader />}>
          <Outlet key={location.pathname} /> {/* This ensures only content updates */}
        </Suspense>
      </div>
    </div>
  </div>
  );
};

export default MainLayout;
