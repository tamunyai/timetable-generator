import React from "react";
import { Button } from "../ui";

interface FormValidationModalProps {
  messages: string[];
  onClose: () => void;
}

export const FormValidationModal: React.FC<FormValidationModalProps> = ({
  messages,
  onClose,
}) => (
  <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white shadow-lg mx-4 p-4 sm:p-6 rounded-lg w-full max-w-lg">
      <h2 className="mb-4 font-semibold text-gray-800 text-lg">
        Fix the following issues:
      </h2>
      <ul className="space-y-1 text-red-700 text-sm list-disc list-inside">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
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
