import React from "react";
import { Menu, Bell, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ setSidebarOpen, userDropdown, setUserDropdown }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            className="lg:hidden mr-4 cursor-pointer ease-in"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ease-in">
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2"
              onClick={() => setUserDropdown(!userDropdown)}
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer ease-in">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer ease-in">
                <User className="h-4 w-4 text-white" />
              </div>
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <hr className="my-2" />
                <a
                  href="#"
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
