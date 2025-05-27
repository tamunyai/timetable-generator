import React from "react";
import { Button, AlertIcon } from "../ui";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => (
  <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white shadow-lg mx-4 p-4 sm:p-6 rounded-lg w-full max-w-lg">
      <div className="flex items-center gap-2">
        <AlertIcon />
        <h2 className="font-semibold text-gray-800 text-lg">
          Something went wrong
        </h2>
      </div>

      <div className="flex-1">
        <p className="mt-4 text-red-600">{message}</p>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          label="OK"
          onClick={onClose}
          className="border-0 text-blue-800"
        />
      </div>
    </div>
  </div>
);
