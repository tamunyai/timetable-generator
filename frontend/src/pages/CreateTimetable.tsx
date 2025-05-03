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

const CreateTimetable = () => {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState<string[]>([""]);
  const [programmes, setProgrammes] = useState<Programme[]>([
    { name: "", modules: [{ name: "", year: 1, units: 2 }] },
  ]);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const savedLecturers = sessionStorage.getItem(LECTURERS_KEY);
    const savedProgrammes = sessionStorage.getItem(PROGRAMMES_KEY);

    if (savedLecturers) {
      setLecturers(JSON.parse(savedLecturers));
    }

    if (savedProgrammes) {
      setProgrammes(JSON.parse(savedProgrammes));
    }
  }, []);

  useEffect(() => {
    const newErrors = validateTimetableForm(lecturers, programmes);
    setErrors(newErrors);
    setIsFormValid(newErrors.length === 0);
  }, [lecturers, programmes]);

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
  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate timetable");
      }

      const data = await response.json();

      sessionStorage.setItem("timetable", JSON.stringify(data?.timetable));
      navigate("/view");
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the timetable.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateTimetableForm = (
    lecturers: string[],
    programmes: Programme[]
  ): string[] => {
    const errors: string[] = [];

    // Lecturers
    const uniqueLecturers = Array.from(new Set(lecturers.filter(Boolean)));
    if (lecturers.length < 8) {
      errors.push("You need at least 8 lecturers to generate a timetable.");
    } else if (uniqueLecturers.length < 8) {
      errors.push("You need at least 8 unique lecturers.");
    }

    // Programmes
    const nonEmptyProgrammes = programmes.filter((p) => p.name.trim() !== "");
    if (programmes.length < 4) {
      errors.push("You need at least 4 degree programmes.");
    } else if (nonEmptyProgrammes.length < 4) {
      errors.push("You need at least 4 unique degree programmes.");
    }

    // Per programme checks
    for (const programme of nonEmptyProgrammes) {
      const { name, modules } = programme;
      if (!modules || modules.length === 0) {
        errors.push(`Programme "${name}" must have at least 1 module.`);
        continue;
      }

      let totalUnits = 0;
      let fourUnitCount = 0;

      for (const mod of modules) {
        if (!mod.name || !mod.units || !mod.year) {
          errors.push(`Invalid module data in programme "${name}".`);
          break;
        }

        if (![2, 3, 4].includes(mod.units)) {
          errors.push(
            `Module "${mod.name}" in "${name}" has invalid unit count.`
          );
          continue;
        }

        if (mod.units === 4) {
          fourUnitCount++;
          if (fourUnitCount > 2) {
            errors.push(`"${name}" cannot have more than two 4-unit courses.`);
            break;
          }
        }

        totalUnits += mod.units;
      }

      if (modules.length < 7) {
        errors.push(`Programme "${name}" must have at least 7 modules.`);
      }

      if (totalUnits > 24) {
        errors.push(`Total units for "${name}" exceed 24.`);
      } else if (totalUnits < 16) {
        errors.push(
          `Total units for "${name}" is less than the minimum required (16).`
        );
      }
    }

    return errors;
  };

  return (
    <Layout
      title="Generate Timetable"
      headerRight={
        <div className="flex items-center gap-4">
          {!isFormValid && (
            <Button
              type="button"
              label={
                <div className="flex items-center font-medium text-sm transition">
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
                    className="mr-2 w-4 h-4 lucide lucide-circle-help-icon lucide-circle-help"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>Why can't I submit?</span>
                </div>
              }
              onClick={() => setIsModalVisible(true)}
              className="border-0 text-blue-600 hover:text-blue-800"
            />
          )}
          <Button
            type="submit"
            label="Generate Timetable"
            className="bg-black hover:bg-gray-700 text-white"
            disabled={!isFormValid}
            onClick={handleSubmit}
          />
        </div>
      }
    >
      <section className="mx-auto px-4 py-12 max-w-4xl text-gray-800">
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <form className="space-y-10">
          {/* Lecturers */}
          <div>
            <h2 className="mb-2 font-semibold text-xl">Lecturers</h2>{" "}
            <div className="space-y-3">
              {lecturers.map((lecturer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    id={`lecturer-${index + 1}`}
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

                  <div className="flex justify-end">
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
        </form>
      </section>

      {error && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 5a7 7 0 110 14 7 7 0 010-14z"
                />
              </svg>
              <h2
                id="error-title"
                className="font-semibold text-gray-800 text-lg"
              >
                Something went wrong
              </h2>
            </div>

            <div className="flex-1">
              <p id="error-message" className="mt-4 text-red-600">
                {error}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                label="OK"
                onClick={() => setError(null)}
                className="border-0 text-blue-800"
              />
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="z-50 fixed inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm text-gray-300">
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
            className="mb-4 w-12 h-12 animate-spin lucide lucide-loader-icon lucide-loader"
          >
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
          </svg>
          <span className="font-medium text-lg">
            Generating Your Timetable...
          </span>
        </div>
      )}

      {isModalVisible && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg">
            <h2 className="mb-4 font-semibold text-gray-800 text-lg">
              Fix the following issues:
            </h2>
            <ul className="space-y-1 text-red-700 text-sm list-disc list-inside">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            <div className="flex justify-end mt-6">
              <Button
                label="OK"
                onClick={() => setIsModalVisible(false)}
                className="border-0 text-blue-800"
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateTimetable;
