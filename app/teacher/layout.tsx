"use client"


import TeacherHeader from "@/components/teacher/header";
import TeacherSideBar from "@/components/teacher/sidebar";
import { useState } from "react";

  
export default function AdminLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {

    const [openSidebar, setOpenSidebar] = useState(false);
    return (
      
      <div className="flex min-h-screen w-full">
      {/* admin sidebar */}
      <TeacherSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <TeacherHeader setOpen={setOpenSidebar} />
        <main className="">
          {children}
        </main>
      </div>
    </div>
    );
  }
  