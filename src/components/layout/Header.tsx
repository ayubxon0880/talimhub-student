import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import React from "react";
const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(false);
    if (menuOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const links = [
    { to: "/", label: "Bosh sahifa" },
    { to: "/speaking", label: "Speakings" },
    { to: "/take-exam", label: "Speaking test" },
    { to: "/profile", label: "Profile" }, 
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#af8773] p-4 shadow-md relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold tracking-wide">
          Talimhub
        </Link>

       
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (  
            <Link
              key={link.label}
              to={link.to}
              className={`${
                location.pathname === link.to
                  ? "text-white border-b-2 border-[#ebeaea]"
                  : "text-white hover:opacity-75"
              } transition-colors pb-1`}
            >
              {link.label}  
            </Link>
          ))}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-white mt-[-4px] hover:opacity-75 transition-colors"
          >
            Chiqish
          </button>
        </div>

       
        <div className="md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

   
      {menuOpen && (
        <div className="md:hidden mt-3 bg-[#B28E7C] rounded-lg shadow-md p-4 animate-fadeIn">
          <div className="space-y-4">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`block ${
                  location.pathname === link.to
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                } transition-colors`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors"
            >
              Chiqish
            </button>
          </div>
        </div>
      )}

    
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          ></div>

        
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-80 z-10 animate-fadeIn scale-95">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Rostdan ham chiqmoqchimisiz?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Yo'q
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Ha 
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Header);
