import { useState } from "react";
import { Layout } from "@/components";

const CreateTimetable = () => {
  const [lecturers, setLecturers] = useState<string[]>([""]);
  const [programmes, setProgrammes] = useState<
    { name: string; modules: string[] }[]
  >([{ name: "", modules: [""] }]);
  const [error, setError] = useState<string | null>(null);

  // Add new lecturer
  const addLecturer = () => {
    setLecturers([...lecturers, ""]);
  };

  // Update lecturer's name
  const updateLecturer = (index: number, value: string) => {
    const updatedLecturers = [...lecturers];
    updatedLecturers[index] = value;
    setLecturers(updatedLecturers);
  };

  // Remove lecturer by index
  const removeLecturer = (index: number) => {
    if (lecturers.length > 1) {
      const updatedLecturers = lecturers.filter((_, i) => i !== index);
      setLecturers(updatedLecturers);
    }
  };

  // Add new programme
  const addProgramme = () => {
    setProgrammes([...programmes, { name: "", modules: [""] }]);
  };

  // Update programme's name
  const updateProgramme = (index: number, value: string) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[index].name = value;
    setProgrammes(updatedProgrammes);
  };

  // Remove programme by index
  const removeProgramme = (index: number) => {
    if (programmes.length > 1) {
      const updatedProgrammes = programmes.filter((_, i) => i !== index);
      setProgrammes(updatedProgrammes);
    }
  };

  // Add module to a specific programme
  const addModule = (programmeIndex: number) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[programmeIndex].modules.push("");
    setProgrammes(updatedProgrammes);
  };

  // Update module's name
  const updateModule = (
    programmeIndex: number,
    moduleIndex: number,
    value: string
  ) => {
    const updatedProgrammes = [...programmes];
    updatedProgrammes[programmeIndex].modules[moduleIndex] = value;
    setProgrammes(updatedProgrammes);
  };

  // Remove module from a specific programme
  const removeModule = (programmeIndex: number, moduleIndex: number) => {
    const updatedProgrammes = [...programmes];
    if (updatedProgrammes[programmeIndex].modules.length > 1) {
      updatedProgrammes[programmeIndex].modules = updatedProgrammes[
        programmeIndex
      ].modules.filter((_, i) => i !== moduleIndex);
      setProgrammes(updatedProgrammes);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lecturers.length === 0 || programmes.length === 0) {
      setError("Please add at least one lecturer and one programme.");
      return;
    }
    setError(null);
    // TODO: Submit form data to Flask backend
    console.log({ lecturers, programmes });
  };

  return (
    <Layout title="Generate Timetable">
      <section className="section__timetable-generate" id="section-timetable">
        <div className="section__timetable-container">
          {error && <p>{error}</p>}

          <form id="section__timetable-form" onSubmit={handleSubmit}>
            {/* Lecturers Management */}
            <div className="lecturers__container" id="lecturers-container">
              <h2>Lecturers Management</h2>
              <div>
                {lecturers.map((lecturer, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={lecturer}
                      onChange={(e) => updateLecturer(index, e.target.value)}
                      placeholder={`Lecturer ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeLecturer(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addLecturer} className="add-button">
                Add Lecturer
              </button>
            </div>

            {/* Degree Programmes */}
            <div className="programmes__container" id="programmes-container">
              <h2>Degree Programmes</h2>
              <div className="programmes__list" id="programmes-list">
                {programmes.map((programme, programmeIndex) => (
                  <div key={programmeIndex}>
                    <div>
                      <input
                        type="text"
                        value={programme.name}
                        onChange={(e) =>
                          updateProgramme(programmeIndex, e.target.value)
                        }
                        placeholder={`Programme ${programmeIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeProgramme(programmeIndex)}
                      >
                        Remove Programme
                      </button>
                    </div>

                    {/* Modules for each Programme */}
                    <div>
                      {programme.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex}>
                          <input
                            type="text"
                            value={module}
                            onChange={(e) =>
                              updateModule(
                                programmeIndex,
                                moduleIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Module ${moduleIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeModule(programmeIndex, moduleIndex)
                            }
                          >
                            Remove Module
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addModule(programmeIndex)}
                    >
                      Add Module
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addProgramme} className="add-button">
                Add Degree Programme
              </button>
            </div>

            {/* Submit Button */}
            <div className="section__timetable-cta">
              <button type="submit">Generate Timetable</button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default CreateTimetable;
