"use client";

import {
  Globe,
  PanelLeftDashed,
} from "lucide-react";
import { Fragment } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useRouter } from "next/navigation";
import Image from "next/image";



type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
};

// Sidebar menu items
const adminSidebarMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <PanelLeftDashed />,
  },
  
  {
    id: "browse",
    label: "Browse",
    path: "dashboard/browse",
    icon: <Globe />,
  },
];

// Define prop types for MenuItems
type MenuItemsProps = {
  setOpen?: (open: boolean) => void;
};

const MenuItems: React.FC<MenuItemsProps> = ({ setOpen }) => {
  const router = useRouter();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            router.push(menuItem.path);
            setOpen?.(false);
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
};

// Define prop types for AdminSideBar
type AdminSideBarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardSideBar: React.FC<AdminSideBarProps> = ({ open, setOpen }) => {
  const router = useRouter();

  return (
    <Fragment>
      {/* Sidebar Drawer for Small Screens */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
              <Image
          src="/ramaaa.png"
          alt="logo"
          width={150}
          height={70}
          />
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar for Large Screens */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => router.push("/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <Image
          src="/ramaaa.png"
          alt="logo"
          width={150}
          height={100}
          />
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  );
};

export default DashboardSideBar;
