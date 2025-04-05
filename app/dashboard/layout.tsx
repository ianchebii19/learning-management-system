"use client"

import DashboardHeader from "@/components/dasboard/Header";
import DashboardSideBar from "@/components/dasboard/Sidebar";
import { useState } from "react";

  
export default function AdminLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {

    const [openSidebar, setOpenSidebar] = useState(false);
    return (
      
      <div className="flex min-h-screen w-full">
      {/* admin sidebar */}
      <DashboardSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <DashboardHeader setOpen={setOpenSidebar} />
        <main className="">
          {children}
        </main>
      </div>
    </div>
    );
  }
  