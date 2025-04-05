import React from "react";

const Navbar = () => {
  return (
    <header className="w-full sticky top-0">
      <nav className="h-16 w-full flex items-center z-10 bg-background">
        <div className="p-4 flex flex-col gap-1">
          <div className="bg-primary-light w-2 h-2"></div>
          <div className="bg-primary w-2 h-2"></div>
          <div className="bg-primary-dark w-2 h-2"></div>
        </div>
        <span className="text-xl p-4">bookshelf</span>
      </nav>
    </header>
  );
};

export default Navbar;
