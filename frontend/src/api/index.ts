const API_URL = "http://localhost:5000/api";

export const generateTimetable = async (inputData: any) => {
  const response = await fetch(`${API_URL}/timetable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  });

  return response.json();
};
