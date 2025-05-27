import React from "react";
import { LoaderIcon } from "../ui";

export const LoadingOverlay: React.FC = () => (
  <div className="z-50 fixed inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm text-gray-300">
    <LoaderIcon />
    <span className="mt-4 px-4 font-medium text-base sm:text-lg text-center">
      Generating Your Timetable...
    </span>
  </div>
);
