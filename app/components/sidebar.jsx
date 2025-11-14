// components/sidebar.tsx
import React from "react";

function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 rounded-2xl">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex flex-col flex-1 overflow-y-auto bg-linear-to-b from-gray-700 to-blue-500 px-2 py-4 gap-10 rounded-2xl">
          <div>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
              {/* Dashboard icon */}
              Dashboard
            </a>
          </div>
          <div className="flex flex-col flex-1 gap-3">
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              {/* Home icon */}
              Home
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              {/* Profile icon */}
              Profile
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              {/* Article icon */}
              Article
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              {/* Users icon */}
              Users
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
              {/* Comments icon */}
              Comments
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
