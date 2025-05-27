import { useEffect, useState } from "react";
import Layout from "./Layout";
import {
  Button,
  ErrorModal,
  LoadingOverlay,
  FormValidationModal,
  HelpIcon,
  PlusIcon,
  TrashIcon,
} from "../components";
import { useNavigate } from "react-router-dom";
import { useRouteGuard } from "../contexts";
import {
  API_URL,
  LECTURERS_KEY,
  PROGRAMMES_KEY,
  TIMETABLE_KEY,
} from "../constants";
import { isDev } from "../env";
import {
  loadFromSession,
  saveToSession,
  validateTimetableForm,
} from "../utils";
import { DUMMY_LECTURERS, DUMMY_PROGRAMMES } from "../data";

const CreateTimetable = () => {
  const navigate = useNavigate();
  const { setCanView } = useRouteGuard();

  const [lecturers, setLecturers] = useState<string[]>([""]);
  const [programmes, setProgrammes] = useState<Programme[]>([
    { name: "", modules: [{ name: "", year: NaN, units: NaN }] },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isDev) {
      setLecturers(DUMMY_LECTURERS);
      setProgrammes(DUMMY_PROGRAMMES);
    } else {
      setLecturers(loadFromSession<string[]>(LECTURERS_KEY) || [""]);
      setProgrammes(
        loadFromSession<Programme[]>(PROGRAMMES_KEY) || [
          { name: "", modules: [{ name: "", year: NaN, units: NaN }] },
        ]
      );
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
    saveToSession(LECTURERS_KEY, updatedLecturers);
  };

  // Update lecturer's name
  const updateLecturer = (index: number, value: string) => {
    const updatedLecturers = [...lecturers];
    updatedLecturers[index] = value;
    setLecturers(updatedLecturers);
    saveToSession(LECTURERS_KEY, updatedLecturers);
  };

  // Remove lecturer by index
  const removeLecturer = (index: number) => {
    if (lecturers.length > 1) {
      const updatedLecturers = lecturers.filter((_, i) => i !== index);
      setLecturers(updatedLecturers);
      saveToSession(LECTURERS_KEY, updatedLecturers);
    }
  };

  // Add new programme
  const addProgramme = () => {
    const updatedProgrammes = [
      ...programmes,
      { name: "", modules: [{ name: "", year: NaN, units: NaN }] },
    ];
    setProgrammes(updatedProgrammes);
    saveToSession(PROGRAMMES_KEY, updatedProgrammes);
  };

  // Update programme's name
  const updateProgramme = (index: number, value: string) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[index].name = value;
    setProgrammes(updatedProgrammes);
    saveToSession(PROGRAMMES_KEY, updatedProgrammes);
  };

  // Remove programme by index
  const removeProgramme = (index: number) => {
    if (programmes.length > 1) {
      const updatedProgrammes = programmes.filter((_, i) => i !== index);
      setProgrammes(updatedProgrammes);
      saveToSession(PROGRAMMES_KEY, updatedProgrammes);
    }
  };

  // Add module to a specific programme
  const addModule = (programmeIndex: number) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[programmeIndex].modules.push({
      name: "",
      year: NaN,
      units: NaN,
    });
    setProgrammes(updatedProgrammes);
    saveToSession(PROGRAMMES_KEY, updatedProgrammes);
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
    saveToSession(PROGRAMMES_KEY, updatedProgrammes);
  };

  // Remove module from a specific programme
  const removeModule = (programmeIndex: number, moduleIndex: number) => {
    const updatedProgrammes = [...programmes];
    if (updatedProgrammes[programmeIndex].modules.length > 1) {
      updatedProgrammes[programmeIndex].modules = updatedProgrammes[
        programmeIndex
      ].modules.filter((_, i) => i !== moduleIndex);
      setProgrammes(updatedProgrammes);
      saveToSession(PROGRAMMES_KEY, updatedProgrammes);
    }
  };

  // Handle form submission
  const handleGenerate = async () => {
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
      const response = await fetch(`${API_URL}/generate`, {
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

      saveToSession(TIMETABLE_KEY, data?.timetable);
      setCanView(true);
      navigate("/view");
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the timetable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="Generate Timetable"
      headerRight={
        <div className="hidden md:flex items-center gap-4">
          {!isFormValid && (
            <Button
              type="button"
              label={
                <div className="flex items-center gap-2 font-medium text-sm transition">
                  <HelpIcon />
                  <span>Why can't I submit?</span>
                </div>
              }
              onClick={() => setIsModalVisible(true)}
              className="border-0 text-blue-600 hover:text-blue-800"
            />
          )}
          <Button
            type="button"
            label="Generate Timetable"
            className="bg-black hover:bg-gray-700 text-white"
            disabled={!isFormValid}
            onClick={handleGenerate}
          />
        </div>
      }
    >
      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl text-gray-800">
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
                    className="px-3 py-2 border w-full text-sm"
                  />
                  <Button
                    type="button"
                    label={<TrashIcon />}
                    onClick={() => removeLecturer(index)}
                    className="border-0"
                    disabled={lecturers.length === 1}
                  />
                </div>
              ))}
            </div>
            <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-4 mt-4">
              <Button
                type="button"
                label={
                  <div className="flex items-center gap-2">
                    <PlusIcon />
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
                      className="px-3 py-2 border w-full text-sm"
                    />
                  </div>

                  {/* Modules*/}
                  <div className="space-y-2">
                    {programme.modules.map((module, moduleIndex) => (
                      <div
                        key={moduleIndex}
                        className="flex sm:flex-row flex-col sm:items-center gap-2 w-full"
                      >
                        <div className="flex">
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
                            className="px-3 py-2 border w-full text-sm"
                          />

                          <Button
                            type="button"
                            label={<TrashIcon />}
                            onClick={() =>
                              removeModule(programmeIndex, moduleIndex)
                            }
                            className="sm:hidden border-0"
                            disabled={programme.modules.length === 1}
                          />
                        </div>

                        <div className="flex flex-1 gap-2">
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
                            className="px-3 py-2 border w-full text-sm"
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
                            className={`px-3 py-2 border w-full text-sm ${
                              !module.units && "text-gray-400"
                            }`}
                          >
                            <option value="">Units</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                          </select>
                        </div>

                        <div className="hidden sm:block">
                          <Button
                            type="button"
                            label={<TrashIcon />}
                            onClick={() =>
                              removeModule(programmeIndex, moduleIndex)
                            }
                            className="border-0"
                            disabled={programme.modules.length === 1}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex sm:flex-row flex-col sm:justify-between items-stretch sm:items-center gap-4 sm:justify">
                    <Button
                      type="button"
                      label={
                        <div className="flex items-center gap-2">
                          <PlusIcon />
                          <span>Add Module</span>
                        </div>
                      }
                      onClick={() => addModule(programmeIndex)}
                    />

                    <Button
                      type="button"
                      label={
                        <div className="flex items-center gap-2">
                          <TrashIcon />
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

            <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-4 mt-4">
              <Button
                type="button"
                label={
                  <div className="flex items-center gap-2">
                    <PlusIcon />
                    <span>Add Degree Programme</span>
                  </div>
                }
                onClick={addProgramme}
              />
            </div>
          </div>

          <div className="md:hidden flex sm:flex-row flex-col items-stretch sm:items-center gap-4 py-3 border-t">
            {!isFormValid && (
              <Button
                type="button"
                label={
                  <div className="flex items-center gap-2 font-medium text-sm transition">
                    <HelpIcon />
                    <span>Why can't I submit?</span>
                  </div>
                }
                onClick={() => setIsModalVisible(true)}
                className="border-0 text-blue-600 hover:text-blue-800"
              />
            )}
            <Button
              type="button"
              label="Generate Timetable"
              className="bg-black hover:bg-gray-700 text-white"
              disabled={!isFormValid}
              onClick={handleGenerate}
            />
          </div>
        </form>
      </section>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}

      {isLoading && <LoadingOverlay />}

      {isModalVisible && (
        <FormValidationModal
          messages={errors}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </Layout>
  );
};

export default CreateTimetable;
