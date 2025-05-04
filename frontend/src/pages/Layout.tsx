import React from "react";
import { Link } from "react-router-dom";
import { TableIcon } from "../components";

type LayoutProps = {
  title?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ title, children, headerRight }) => {
  document.title = `${title ? title + " :: " : ""}Timetable Generator`;

  return (
    <main>
      <header className="top-0 z-50 sticky flex justify-between items-center bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur mx-auto px-4 py-4 border-b max-w-5xl">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-800 hover:text-blue-600"
        >
          <TableIcon />
          <span className="font-semibold text-lg">Timetable Generator</span>
        </Link>

        {headerRight && headerRight}
      </header>

      {children}
    </main>
  );
};

export default Layout;
