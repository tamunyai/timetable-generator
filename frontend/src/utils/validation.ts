export const validateTimetableForm = (
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
