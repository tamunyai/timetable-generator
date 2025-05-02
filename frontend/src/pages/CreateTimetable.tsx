import { useEffect, useState } from "react";
import Layout from "./Layout";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";

interface Module {
  name: string;
  year: number;
  units: number;
}

interface Programme {
  name: string;
  modules: Module[];
}

const LECTURERS_KEY = "ttg_lecturers";
const PROGRAMMES_KEY = "ttg_programmes";

const API_URL = "http://localhost:5000/api";

const DEFAULT_LECTURERS = [
  "Dr. Smith",
  "Prof. Johnson",
  "Dr. Williams",
  "Dr. Brown",
  "Prof. Jones",
  "Dr. Garcia",
  "Prof. Miller",
  "Dr. Davis",
];

const DEFAULT_PROGRAMMES = [
  {
    name: "Computer Science",
    modules: [
      { name: "Data Structures", year: 2, units: 3 },
      { name: "Algorithms", year: 2, units: 3 },
      { name: "Operating Systems", year: 3, units: 4 },
      { name: "Computer Networks", year: 3, units: 3 },
      { name: "Databases", year: 2, units: 2 },
      { name: "AI Basics", year: 4, units: 2 },
      { name: "Web Development", year: 2, units: 2 },
    ],
  },
  {
    name: "Information Systems",
    modules: [
      { name: "Systems Analysis", year: 2, units: 3 },
      { name: "Business Intelligence", year: 3, units: 3 },
      { name: "IT Governance", year: 3, units: 2 },
      { name: "Databases", year: 2, units: 2 },
      { name: "Enterprise Architecture", year: 4, units: 3 },
      { name: "Digital Transformation", year: 4, units: 2 },
      { name: "Cloud Systems", year: 4, units: 2 },
    ],
  },
  {
    name: "Software Engineering",
    modules: [
      { name: "Software Design", year: 3, units: 3 },
      { name: "Testing & QA", year: 3, units: 2 },
      { name: "Agile Dev", year: 2, units: 3 },
      { name: "System Architecture", year: 3, units: 4 },
      { name: "Mobile Dev", year: 4, units: 2 },
      { name: "DevOps", year: 4, units: 2 },
      { name: "Project Management", year: 4, units: 2 },
    ],
  },
  {
    name: "Data Science",
    modules: [
      { name: "Statistics", year: 2, units: 3 },
      { name: "Python for Data", year: 2, units: 3 },
      { name: "Machine Learning", year: 3, units: 4 },
      { name: "Data Mining", year: 3, units: 3 },
      { name: "Data Viz", year: 4, units: 2 },
      { name: "Big Data", year: 4, units: 3 },
      { name: "Capstone", year: 4, units: 2 },
    ],
  },
];

const CreateTimetable = () => {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState<string[]>([""]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // const savedLecturers = sessionStorage.getItem(LECTURERS_KEY);
    // const savedProgrammes = sessionStorage.getItem(PROGRAMMES_KEY);

    setLecturers(DEFAULT_LECTURERS);
    setProgrammes(DEFAULT_PROGRAMMES);

    // if (savedLecturers) {
    //   setLecturers(JSON.parse(savedLecturers));
    // }

    // if (savedProgrammes) {
    //   setProgrammes(JSON.parse(savedProgrammes));
    // }
  }, []);

  // Add new lecturer
  const addLecturer = () => {
    const updatedLecturers = [...lecturers, ""];
    setLecturers(updatedLecturers);
    sessionStorage.setItem(LECTURERS_KEY, JSON.stringify(updatedLecturers));
  };

  // Update lecturer's name
  const updateLecturer = (index: number, value: string) => {
    const updatedLecturers = [...lecturers];
    updatedLecturers[index] = value;
    setLecturers(updatedLecturers);
    sessionStorage.setItem(LECTURERS_KEY, JSON.stringify(updatedLecturers));
  };

  // Remove lecturer by index
  const removeLecturer = (index: number) => {
    if (lecturers.length > 1) {
      const updatedLecturers = lecturers.filter((_, i) => i !== index);
      setLecturers(updatedLecturers);
      sessionStorage.setItem(LECTURERS_KEY, JSON.stringify(updatedLecturers));
    }
  };

  // Add new programme
  const addProgramme = () => {
    const updatedProgrammes = [
      ...programmes,
      { name: "", modules: [{ name: "", year: 1, units: 2 }] },
    ];
    setProgrammes(updatedProgrammes);
    sessionStorage.setItem(PROGRAMMES_KEY, JSON.stringify(updatedProgrammes));
  };

  // Update programme's name
  const updateProgramme = (index: number, value: string) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[index].name = value;
    setProgrammes(updatedProgrammes);
    sessionStorage.setItem(PROGRAMMES_KEY, JSON.stringify(updatedProgrammes));
  };

  // Remove programme by index
  const removeProgramme = (index: number) => {
    if (programmes.length > 1) {
      const updatedProgrammes = programmes.filter((_, i) => i !== index);
      setProgrammes(updatedProgrammes);
      sessionStorage.setItem(PROGRAMMES_KEY, JSON.stringify(updatedProgrammes));
    }
  };

  // Add module to a specific programme
  const addModule = (programmeIndex: number) => {
    const currentModules = programmes[programmeIndex].modules;
    const fourUnitCount = currentModules.filter((m) => m.units === 4).length;

    if (fourUnitCount >= 2) {
      alert("Only two 4-unit modules allowed per programme.");
      return;
    }

    const updatedProgrammes = [...programmes];
    updatedProgrammes[programmeIndex].modules.push({
      name: "",
      year: 1,
      units: 2,
    });
    setProgrammes(updatedProgrammes);
    sessionStorage.setItem(PROGRAMMES_KEY, JSON.stringify(updatedProgrammes));
  };

  // Update module's name
  const updateModule = <K extends keyof Module>(
    programmeIndex: number,
    moduleIndex: number,
    field: K,
    value: Module[K]
  ) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[programmeIndex].modules[moduleIndex][field] = value;
    setProgrammes(updatedProgrammes);
    sessionStorage.setItem(PROGRAMMES_KEY, JSON.stringify(updatedProgrammes));
  };

  // Remove module from a specific programme
  const removeModule = (programmeIndex: number, moduleIndex: number) => {
    const updatedProgrammes = [...programmes];
    if (updatedProgrammes[programmeIndex].modules.length > 1) {
      updatedProgrammes[programmeIndex].modules = updatedProgrammes[
        programmeIndex
      ].modules.filter((_, i) => i !== moduleIndex);
      setProgrammes(updatedProgrammes);
      sessionStorage.setItem(PROGRAMMES_KEY, JSON.stringify(updatedProgrammes));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lecturers.length === 0 || programmes.length === 0) {
      setError("Please add at least one lecturer and one programme.");
      return;
    }

    const payload = {
      lecturers,
      programmes: programmes.map((programme) => ({
        name: programme.name,
        modules: programme.modules.map((module) => ({
          name: module.name,
          year: module.year,
          units: module.units,
        })),
      })),
    };

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to generate timetable");
      }

      const data = await response.json();

      sessionStorage.setItem("timetable", JSON.stringify(data?.timetable));
      navigate("/view");
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the timetable.");
    }

    console.log({ lecturers, programmes });
  };

  const handleReset = () => {
    setLecturers([""]);
    setProgrammes([{ name: "", modules: [{ name: "", year: 1, units: 2 }] }]);
    sessionStorage.removeItem(LECTURERS_KEY);
    sessionStorage.removeItem(PROGRAMMES_KEY);
  };

  const isFormValid =
    lecturers.length >= 8 &&
    programmes.length >= 4 &&
    programmes.every((p) => p.modules.length >= 7);

  return (
    <Layout title="Generate Timetable">
      <section className="mx-auto px-4 py-12 max-w-4xl text-gray-800">
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Lecturers */}
          <div>
            <h2 className="mb-2 font-semibold text-xl">Lecturers</h2>{" "}
            <div className="space-y-3">
              {lecturers.map((lecturer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    id={`Lecturer ${index + 1}`}
                    type="text"
                    value={lecturer}
                    onChange={(e) => updateLecturer(index, e.target.value)}
                    placeholder={`Lecturer ${index + 1}`}
                    className="flex-1 px-3 py-2 border text-sm"
                  />
                  <Button
                    type="button"
                    label={
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
                        className="w-4 h-4 lucide lucide-trash2-icon lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    }
                    onClick={() => removeLecturer(index)}
                    className="border-0"
                    disabled={lecturers.length === 1}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button
                type="button"
                label={
                  <div className="flex items-center">
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
                      className="mr-2 w-4 h-4 lucide lucide-circle-plus-icon lucide-circle-plus"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>

                    <span>Add Lecturer</span>
                  </div>
                }
                onClick={addLecturer}
              />
            </div>
          </div>

          {/* Degree Programmes */}
          <div>
            <h2 className="mb-2 font-semibold text-xl">Degree Programmes</h2>
            <div className="space-y-6">
              {programmes.map((programme, programmeIndex) => (
                <div key={programmeIndex} className="space-y-4 p-4 border">
                  <div className="flex">
                    <input
                      id={`Programme ${programmeIndex + 1}`}
                      type="text"
                      value={programme.name}
                      onChange={(e) =>
                        updateProgramme(programmeIndex, e.target.value)
                      }
                      placeholder={`Programme ${programmeIndex + 1}`}
                      className="flex-1 px-3 py-2 border text-sm"
                    />
                  </div>

                  {/* Modules*/}
                  <div className="space-y-2">
                    {programme.modules.map((module, moduleIndex) => (
                      <div
                        key={moduleIndex}
                        className="flex items-center gap-2 mb-2 w-full"
                      >
                        <input
                          id={`module-${moduleIndex + 1}-name`}
                          type="text"
                          value={module.name}
                          onChange={(e) =>
                            updateModule(
                              programmeIndex,
                              moduleIndex,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder={`Module Name ${moduleIndex + 1}`}
                          className="flex-1 px-2 py-1 border text-sm"
                        />

                        <input
                          id={`module-${moduleIndex + 1}-year`}
                          type="number"
                          value={module.year}
                          onChange={(e) =>
                            updateModule(
                              programmeIndex,
                              moduleIndex,
                              "year",
                              parseInt(e.target.value)
                            )
                          }
                          placeholder="Year"
                          min={1}
                          max={5}
                          className="px-2 py-1 border text-sm"
                        />

                        <select
                          id={`module-${moduleIndex + 1}-units`}
                          value={module.units}
                          onChange={(e) =>
                            updateModule(
                              programmeIndex,
                              moduleIndex,
                              "units",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-2 py-1 border text-sm"
                        >
                          <option value="">Units</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>

                        <Button
                          type="button"
                          label={
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
                              className="w-4 h-4 lucide lucide-trash2-icon lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          }
                          onClick={() =>
                            removeModule(programmeIndex, moduleIndex)
                          }
                          className="border-0"
                          disabled={programme.modules.length === 1}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    label={
                      <div className="flex items-center">
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
                          className="mr-2 w-4 h-4 lucide lucide-circle-plus-icon lucide-circle-plus"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12h8" />
                          <path d="M12 8v8" />
                        </svg>

                        <span>Add Module</span>
                      </div>
                    }
                    onClick={() => addModule(programmeIndex)}
                    className="mt-2"
                  />

                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      label={
                        <div className="flex items-center">
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
                            className="mr-2 w-4 h-4 lucide lucide-trash2-icon lucide-trash-2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>

                          <span>Remove Programme</span>
                        </div>
                      }
                      onClick={() => removeProgramme(programmeIndex)}
                      className="border-0"
                      disabled={programmes.length === 1}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                type="button"
                label={
                  <div className="flex items-center">
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
                      className="mr-2 w-4 h-4 lucide lucide-circle-plus-icon lucide-circle-plus"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>

                    <span>Add Degree Programme</span>
                  </div>
                }
                onClick={addProgramme}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <Button
              type="button"
              label="Reset All"
              onClick={handleReset}
              className="text-red-700"
            />
            <Button
              type="submit"
              label="Generate Timetable"
              className="bg-black hover:bg-gray-700 text-white"
              disabled={!isFormValid}
              title={
                !isFormValid
                  ? "You need at least 8 lecturers, 4 degree programmes, and 7 modules per programme."
                  : ""
              }
            />
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CreateTimetable;
