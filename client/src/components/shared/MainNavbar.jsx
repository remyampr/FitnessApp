import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { DarkMode } from "./DarkMode";
import { useDispatch, useSelector } from "react-redux";


export const MainNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const trainer = useSelector((state) => state.trainer);

  const currentUser = user?.user || trainer?.trainer;
  console.log("cuurent user at landing page : ", currentUser);

  return (
    <div className="navbar bg-transparent backdrop-blur-sm border-none shadow-none rounded-lg flex justify-between items-center px-9">
      <Link to={"/"} className="btn btn-ghost text-xl mx-auto">
        FitIt
      </Link>

      <div className="navbar-end flex items-center space-x-4">
        <DarkMode />
      </div>
    </div>
  );
};
