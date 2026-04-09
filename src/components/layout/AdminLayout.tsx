import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false); // mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop

  return (
    <div className="min-h-screen flex bg-[#3E3F29] font-sans">
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden absolute top-4 left-4 z-30 p-2 bg-white rounded-md shadow-sm border border-gray-200 text-gray-600"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-4 pt-16 md:pt-6 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}