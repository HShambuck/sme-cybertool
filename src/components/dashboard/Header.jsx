import { Menu, Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const Header = ({
  setSidebarOpen,
  collapsed,
  userDropdown,
  setUserDropdown,
  user,
  setCurrentView,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Safely get names
  const fullName = user?.contactPerson || "John Doe";
  const firstName = fullName.split(" ")[0];

  // Generate initials
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const initials = getInitials(fullName);

  // 👉 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };

    if (userDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdown, setUserDropdown]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-slate-200 ${
        collapsed ? "lg:left-20" : "lg:left-64"
      }`}
    >
      {console.log("Is my sidebar open? " +  collapsed)}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            className="lg:hidden mr-4 cursor-pointer ease-in hover:bg-slate-100 p-2 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-slate-600" />
          </button>

          <h1 className="text-2xl font-semibold text-gray-800">
            {user?.companyName || "Dashboard"}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ease-in">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ✅ Attach ref here */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer ease-in"
              onClick={() => setUserDropdown(!userDropdown)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {initials}
                </span>
              </div>
              <span className="font-medium text-slate-700 text-sm hidden sm:block">
                {firstName}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <a
                  href="#"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Profile
                </a>
                <button
                  onClick={() => {
                    setCurrentView("settings");
                    setUserDropdown(false); // close dropdown after click
                  }}
                  className="w-full text-left block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Settings
                </button>

                <hr className="my-2 border-slate-200" />
                <a
                  href="#"
                  onClick={handleSignOut}
                  className="block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
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
