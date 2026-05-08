import React from "react";
import { Outlet } from "react-router-dom";
import NavbarFMfull from "./NavbarFMfull";

const PublicLayout = () => {
  return (
    <div>
      <NavbarFMfull />
      {/* Outlet sẽ hiển thị các component con như SigninPage, Homepage... */}
      <Outlet />
    </div>
  );
};

export default PublicLayout;
