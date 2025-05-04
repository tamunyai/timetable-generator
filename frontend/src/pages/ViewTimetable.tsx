import { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import { Button } from "../components";
import { useRouteGuard } from "../contexts";
import { useNavigate } from "react-router-dom";



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
        className="mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-8 sm:py-20 w-full max-w-6xl text-gray-800 print:text-black"
      >
        <div className="mb-10 print:mb-6 sm:mb-12 px-2 text-center">
          <h1 className="mb-2 font-bold text-2xl print:text-2xl sm:text-3xl md:text-4xl">
            Your Timetable
          </h1>
          <p className="text-gray-600 print:text-black text-sm print:text-sm sm:text-base">
            Automatically generated based on your inputs.
          </p>
        </div>

        {Object.entries(timetable).map(([program, slots]) => (
          <div
            key={program}
            className="mb-10 px-2 sm:px-0 break-inside-avoid-page"
          >
            <h2 className="mb-4 font-semibold text-lg print:text-lg sm:text-xl">
              {program}
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="border border-gray-200 min-w-full print:text-xs text-sm print:border-collapse">
                <thead className="bg-gray-100 print:bg-white text-left">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 border">Day</th>
                    <th className="px-2 sm:px-4 py-2 border">Time</th>
                    <th className="px-2 sm:px-4 py-2 border">Module</th>
                    <th className="px-2 sm:px-4 py-2 border">Lecturer</th>
                    <th className="px-2 sm:px-4 py-2 border">Year</th>
                    <th className="px-2 sm:px-4 py-2 border">Units</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, i) => (
                    <tr
                      key={i}
                      className="even:bg-gray-50 print:bg-transparent border-t"
                    >
                      <td className="px-2 sm:px-4 py-2 border">{slot.day}</td>
                      <td className="px-2 sm:px-4 py-2 border">
                        {slot.start_time} - {slot.end_time}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border">
                        {slot.module_name}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border">
                        {slot.lecturer}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border">{slot.year}</td>
                      <td className="px-2 sm:px-4 py-2 border">{slot.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {Object.keys(timetable).length === 0 && (
          <p className="print:hidden mt-10 text-gray-500 text-sm text-center">
            No timetable data available.
          </p>
        )}
      </section>
    </Layout>
  ) : null;
};

export default ViewTimetable;
