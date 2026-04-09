import { useRouter } from "next/router";
import { logout } from "@/services/logout.service";
import { toast } from "sonner";
import {
  Utensils,
  Receipt,
  Users,
  LogOut,
  User,
  X,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/services/user.service";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}: Props) {
  const router = useRouter();

  const [namaUser, setNamaUser] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const profile = await getMyProfile(token);
        setNamaUser(profile.name);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const menu = [
    {
      name: "Food",
      path: "/admin/foods",
      icon: <Utensils size={20} />,
    },
    {
      name: "Transaction",
      path: "/admin/transaction",
      icon: <Receipt size={20} />,
    },
    {
      name: "User",
      path: "/admin/role",
      icon: <Users size={20} />,
    },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await logout(token);
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();
      toast.success("Logout berhasil");
      router.replace("/login");
    }
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          w-72 md:w-auto
          bg-[#7D8D86] border-r border-white/10 flex flex-col justify-between
          transform transition-all duration-300 ease-in-out shadow-xl md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`h-16 flex items-center ${
              isCollapsed
                ? "justify-center"
                : "justify-between px-6"
            } border-b border-white/10`}
          >
            {!isCollapsed && (
              <h1 className="font-bold text-sm text-[#F1F0E4] truncate max-w-35">
                Hello, {namaUser}
              </h1>
            )}

            {/* Toggle Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-md text-[#F1F0E4] hover:bg-[#3E3F29]"
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Close Mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 text-[#F1F0E4]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
            {menu.map((item) => {
              const isActive = router.pathname.startsWith(item.path);

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                  }}
                  title={isCollapsed ? item.name : ""}
                  className={`w-full flex items-center ${
                    isCollapsed
                      ? "justify-center"
                      : "justify-start"
                  } gap-3 px-3 py-2.5 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-[#3E3F29] text-[#F1F0E4]"
                      : "text-[#F1F0E4] hover:bg-[#3E3F29]"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => router.push("/user")}
            title={isCollapsed ? "Halaman User" : ""}
            className={`w-full flex items-center ${
              isCollapsed
                ? "justify-center"
                : "justify-start"
            } gap-3 px-3 py-2.5 rounded-lg font-medium text-[#F1F0E4] hover:bg-[#3E3F29]`}
          >
            <User size={20} />
            {!isCollapsed && "Halaman User"}
          </button>

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className={`w-full flex items-center ${
              isCollapsed
                ? "justify-center"
                : "justify-start"
            } gap-3 px-3 py-2.5 rounded-lg font-medium text-red-300 hover:bg-red-600`}
          >
            <LogOut size={20} />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}