import React from "react";
import { GitHubIcon } from "../ui";

export const Footer: React.FC = () => {
  return (
    <footer className="flex sm:flex-row flex-col justify-between items-center sm:space-y-0 mx-auto mt-24 px-4 py-6 border-t max-w-5xl text-gray-600 text-sm text-center">
      <div className="mb-2 hover:underline">
        <a
          href="https://github.com/tamunyai/timetable-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center space-x-2 hover:text-black"
        >
          <GitHubIcon />
          <span>GitHub</span>
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} Group 15. All rights reserved.</p>
    </footer>
  );
};
