import { useEffect, useState } from "react";
import Layout from "./Layout";

interface ModuleSlot {
  day: string;
  start_time: string;
  end_time: string;
  module_name: string;
  lecturer: string;
  year: number;
  units: number;
}

interface TimetableData {
  [programme: string]: ModuleSlot[];
}

// const timetable: TimetableData = {
//   "Computer Science": [
//     {
//       day: "Monday",
//       start_time: "09:00",
//       end_time: "11:00",
//       module_name: "Data Structures",
//       lecturer: "Dr. Smith",
//       year: 2,
//       units: 3,
//     },
//     {
//       day: "Tuesday",
//       start_time: "10:00",
//       end_time: "12:00",
//       module_name: "Algorithms",
//       lecturer: "Prof. Lee",
//       year: 2,
//       units: 3,
//     },
//     {
//       day: "Wednesday",
//       start_time: "08:00",
//       end_time: "10:00",
//       module_name: "Operating Systems",
//       lecturer: "Dr. Kumar",
//       year: 3,
//       units: 4,
//     },
//     {
//       day: "Thursday",
//       start_time: "11:00",
//       end_time: "13:00",
//       module_name: "Databases",
//       lecturer: "Dr. Ahmed",
//       year: 2,
//       units: 3,
//     },
//     {
//       day: "Friday",
//       start_time: "09:00",
//       end_time: "11:00",
//       module_name: "Computer Networks",
//       lecturer: "Ms. Chen",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Monday",
//       start_time: "13:00",
//       end_time: "15:00",
//       module_name: "Web Development",
//       lecturer: "Mr. Adams",
//       year: 1,
//       units: 3,
//     },
//     {
//       day: "Tuesday",
//       start_time: "14:00",
//       end_time: "16:00",
//       module_name: "Machine Learning",
//       lecturer: "Dr. Grace",
//       year: 4,
//       units: 4,
//     },
//   ],
//   "Information Systems": [
//     {
//       day: "Monday",
//       start_time: "10:00",
//       end_time: "12:00",
//       module_name: "Business Intelligence",
//       lecturer: "Dr. Mokoena",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Tuesday",
//       start_time: "08:00",
//       end_time: "10:00",
//       module_name: "System Analysis",
//       lecturer: "Prof. Joubert",
//       year: 2,
//       units: 3,
//     },
//     {
//       day: "Wednesday",
//       start_time: "10:00",
//       end_time: "12:00",
//       module_name: "IT Governance",
//       lecturer: "Dr. Naidoo",
//       year: 4,
//       units: 2,
//     },
//     {
//       day: "Thursday",
//       start_time: "09:00",
//       end_time: "11:00",
//       module_name: "Database Design",
//       lecturer: "Mr. van Wyk",
//       year: 2,
//       units: 3,
//     },
//     {
//       day: "Friday",
//       start_time: "12:00",
//       end_time: "14:00",
//       module_name: "ERP Systems",
//       lecturer: "Ms. Nkosi",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Monday",
//       start_time: "14:00",
//       end_time: "16:00",
//       module_name: "Project Management",
//       lecturer: "Dr. Phiri",
//       year: 2,
//       units: 2,
//     },
//     {
//       day: "Thursday",
//       start_time: "13:00",
//       end_time: "15:00",
//       module_name: "Information Security",
//       lecturer: "Mr. Dlamini",
//       year: 4,
//       units: 4,
//     },
//   ],
//   "Software Engineering": [
//     {
//       day: "Monday",
//       start_time: "09:00",
//       end_time: "11:00",
//       module_name: "Software Design Patterns",
//       lecturer: "Dr. Banda",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Tuesday",
//       start_time: "11:00",
//       end_time: "13:00",
//       module_name: "Agile Development",
//       lecturer: "Ms. Radebe",
//       year: 2,
//       units: 3,
//     },
//     {
//       day: "Wednesday",
//       start_time: "08:00",
//       end_time: "10:00",
//       module_name: "Mobile App Development",
//       lecturer: "Mr. Sibanda",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Thursday",
//       start_time: "10:00",
//       end_time: "12:00",
//       module_name: "DevOps Fundamentals",
//       lecturer: "Dr. Masuku",
//       year: 4,
//       units: 3,
//     },
//     {
//       day: "Friday",
//       start_time: "13:00",
//       end_time: "15:00",
//       module_name: "Software Testing",
//       lecturer: "Ms. Petersen",
//       year: 2,
//       units: 2,
//     },
//     {
//       day: "Tuesday",
//       start_time: "14:00",
//       end_time: "16:00",
//       module_name: "Requirements Engineering",
//       lecturer: "Prof. Mahlangu",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Wednesday",
//       start_time: "12:00",
//       end_time: "14:00",
//       module_name: "Human-Computer Interaction",
//       lecturer: "Dr. Zulu",
//       year: 2,
//       units: 2,
//     },
//   ],
//   "Artificial Intelligence": [
//     {
//       day: "Monday",
//       start_time: "08:00",
//       end_time: "10:00",
//       module_name: "Intro to AI",
//       lecturer: "Dr. Opoku",
//       year: 3,
//       units: 3,
//     },
//     {
//       day: "Tuesday",
//       start_time: "13:00",
//       end_time: "15:00",
//       module_name: "Neural Networks",
//       lecturer: "Prof. Molefe",
//       year: 4,
//       units: 4,
//     },
//     {
//       day: "Wednesday",
//       start_time: "10:00",
//       end_time: "12:00",
//       module_name: "Natural Language Processing",
//       lecturer: "Ms. Kgatle",
//       year: 4,
//       units: 3,
//     },
//     {
//       day: "Thursday",
//       start_time: "09:00",
//       end_time: "11:00",
//       module_name: "Reinforcement Learning",
//       lecturer: "Dr. Mthimunye",
//       year: 4,
//       units: 4,
//     },
//     {
//       day: "Friday",
//       start_time: "14:00",
//       end_time: "16:00",
//       module_name: "Ethics in AI",
//       lecturer: "Dr. Lekota",
//       year: 3,
//       units: 2,
//     },
//     {
//       day: "Monday",
//       start_time: "11:00",
//       end_time: "13:00",
//       module_name: "AI in Robotics",
//       lecturer: "Mr. Okeke",
//       year: 4,
//       units: 3,
//     },
//     {
//       day: "Wednesday",
//       start_time: "14:00",
//       end_time: "16:00",
//       module_name: "Computer Vision",
//       lecturer: "Dr. Ferreira",
//       year: 4,
//       units: 3,
//     },
//   ],
// };

const ViewTimetable = () => {
  const [timetable, setTimetable] = useState<TimetableData>({});

  useEffect(() => {
    const stored = sessionStorage.getItem("timetable");
    if (stored) {
      setTimetable(JSON.parse(stored));
    }
  }, []);

  console.log(timetable);

  return (
    <Layout title="View Timetable">
      <section className="mx-auto px-4 py-20 max-w-5xl text-gray-800">
        <div className="mb-12 text-center">
          <h1 className="mb-2 font-bold text-3xl md:text-4xl">
            Your Timetable
          </h1>
          <p className="text-gray-600">
            Automatically generated based on your inputs.
          </p>
        </div>

        {Object.entries(timetable).map(([program, slots]) => (
          <div key={program} className="mb-10">
            <h2 className="mb-4 font-semibold text-xl">{program}</h2>
            <div className="overflow-x-auto">
              <table className="border border-gray-200 min-w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2 border">Day</th>
                    <th className="px-4 py-2 border">Time</th>
                    <th className="px-4 py-2 border">Module</th>
                    <th className="px-4 py-2 border">Lecturer</th>
                    <th className="px-4 py-2 border">Year</th>
                    <th className="px-4 py-2 border">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2 border">{slot.day}</td>
                      <td className="px-4 py-2 border">
                        {slot.start_time} - {slot.end_time}
                      </td>
                      <td className="px-4 py-2 border">{slot.module_name}</td>
                      <td className="px-4 py-2 border">{slot.lecturer}</td>
                      <td className="px-4 py-2 border">{slot.year}</td>
                      <td className="px-4 py-2 border">{slot.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {Object.keys(timetable).length === 0 && (
          <p className="text-gray-500 text-center">
            No timetable data available.
          </p>
        )}
      </section>
    </Layout>
  );
};

export default ViewTimetable;
