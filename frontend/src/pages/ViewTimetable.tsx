import { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import { Button } from "../components";
import { useRouteGuard } from "../contexts";
import { useNavigate } from "react-router-dom";

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

const ViewTimetable = () => {
  const navigate = useNavigate();
  const { canView } = useRouteGuard();
  const printRef = useRef<HTMLDivElement>(null);

  const [timetable, setTimetable] = useState<TimetableData>({});

  useEffect(() => {
    if (!canView) {
      navigate("/create");
    }
  }, [canView, navigate]);

  useEffect(() => {
    const stored = sessionStorage.getItem("timetable");
    if (stored) {
      setTimetable(JSON.parse(stored));
    }
  }, []);

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  return canView ? (
    <Layout
      title="View Timetable"
      headerRight={
        <Button
          onClick={handlePrint}
          label={
            <div title="Print">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 lucide lucide-file-down-icon lucide-file-down"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
            </div>
          }
          className="print:hidden border-0"
        />
      }
    >
      <section
        ref={printRef}
        className="mx-auto px-4 py-20 print:py-8 max-w-5xl text-gray-800 print:text-black"
      >
        <div className="mb-12 print:mb-6 text-center">
          <h1 className="mb-2 font-bold print:text-2xl text-3xl md:text-4xl">
            Your Timetable
          </h1>
          <p className="text-gray-600 print:text-black print:text-sm">
            Automatically generated based on your inputs.
          </p>
        </div>

        {Object.entries(timetable).map(([program, slots]) => (
          <div key={program} className="mb-10 break-inside-avoid-page">
            <h2 className="mb-4 font-semibold print:text-lg text-xl">
              {program}
            </h2>
            <div className="overflow-x-auto">
              <table className="border border-gray-200 min-w-full print:text-xs text-sm print:border-collapse">
                <thead className="bg-gray-100 print:bg-white text-left">
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
          <p className="print:hidden text-gray-500 text-center">
            No timetable data available.
          </p>
        )}
      </section>
    </Layout>
  ) : null;
};

export default ViewTimetable;
