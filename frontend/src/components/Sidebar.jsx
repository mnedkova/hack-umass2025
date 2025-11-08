import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Circular Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all flex items-center justify-center border border-white border-opacity-30"
        aria-label="Toggle menu"
      >
        {/* Triangle/Hamburger Icon */}
        <div className="flex flex-col items-center justify-center space-y-1">
          {isOpen ? (
            // X icon when open
            <>
              <span className="block w-5 h-0.5 bg-white transform rotate-45 translate-y-1.5"></span>
              <span className="block w-5 h-0.5 bg-white transform -rotate-45 -translate-y-1"></span>
            </>
          ) : (
            // Hamburger/Triangle when closed
            <>
              <span className="block w-5 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
            </>
          )}
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white flex flex-col p-4 space-y-4 transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "13rem" }}
      >
        <h1 className="text-xl font-bold mb-4 mt-12">CICS Dashboard</h1>
        {["CICS110", "CICS160", "CICS210", "CICS220", "CICS230"].map((c) => (
          <Link
            key={c}
            to={`/${c}`}
            className="hover:bg-gray-700 rounded p-2"
            onClick={() => setIsOpen(false)} // Close sidebar on link click
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Overlay (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}