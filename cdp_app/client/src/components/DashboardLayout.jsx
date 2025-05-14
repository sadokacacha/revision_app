import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function DashboardLayout() {
  return (
    <div className="layout">
      <NavBar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
