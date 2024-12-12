# Timetable Generator

A Python program that creates a semester lecture timetable for a university department.

## Description

The **Timetable Generator** is a Python-based tool that assists universities in creating semester lecture schedules for departments. The program ensures fair and efficient distribution of modules across various degree programmes and year groups, adhering to multiple constraints. This automation reduces manual work and minimizes potential scheduling errors.

## Problem Statement

- [x] The department includes various degree programmes which contain various modules being taken across different years.

- [x] Lecturers cannot teach more than one module within the same year but must teach at least 2 modules across different years.

- [x] Classes must be scheduled from 8:00 am to 5:00 pm, Monday to Thursday, and 8:00 am to 2:00 pm on Fridays, with a mandatory break from 2:00 pm to 3:00 pm each applicable day.

- [x] The department must have at least four degree programmes, each with at least seven modules per semester.

- [x] Each class must last between one and two hours.

- [x] Students in a particular degree programme should not have more than two hours of free time between lectures.

- [x] Lecturers should not teach for more than two consecutive hours without a one-hour break.

- [x] Modules must be scheduled according to their units (e.g., a 2-unit module requires 2 hours of classes per week). The total number of units for each student should be between 16 and 24 per semester.

- [x] Modules can be 2, 3, or 4 units, with no more than two 4-unit courses.

## Solution

### Key Features

1. **Module and Lecturer Allocation**:

   - The program organizes modules across different year groups and ensures that no lecturer has back-to-back classes exceeding 2 hours without a break.

   - Lecturers are assigned based on the modules and their availability while fulfilling teaching obligations (minimum 2 modules across different years).

2. **Class Scheduling**:

   - Classes are scheduled within university working hours, with breaks factored in as per policy.

   - The algorithm prevents overlapping lectures for both lecturers and students.

   - Modules are assigned according to unit requirements, ensuring that total class hours meet departmental needs.

3. **Constraints Handling**:

   - Includes checks to prevent student schedules from having long gaps and ensures lecturer work is balanced with required breaks.

### Sample Workflow

1. **User Input**:

   - At the start of the program, users are prompted to input necessary information such as module details, lecturer assignments, and degree programme specifics.

2. **Timetable Generation**:

   - The algorithm processes the input to create a schedule that meets all constraints.

3. **Output**:

   - A complete, readable timetable is displayed in the console.

## Getting Started

### Language

- Python 3.12.3

### Running the Timetable Generator

Execute the script from the command line:

```bash
python3 timetable_generator.py
```

Follow the prompts to input data for the modules, lectures, and degree programmes.

### Example Results

The output will display a timetable that adheres to the department's constraints, ensuring effective use of university resources and balanced schedules for lecturers and students.

## Future Enhancements

- [x] Adding a graphical user interface (GUI) for easier data input.
- [ ] Implementing a database connection for persistent data storage.
- [ ] Enhancing the algorithm to handle more complex constraints or add optimization for classroom utilization.

## Authors

- **Kamogelo Selepe** (Project Lead)
- **Nobuhle Ndlovu** (Backend Developer)
- **Amon Munyai** <[tamunyai](https://github.com/tamunyai)> (Frontend Developer)
- **Njabulo Zulu** (Documentation & Research)

## Acknowledgements

- Special thanks to the contributors and the educational resources provided by the **JBS Innovation Lab Team** for their support in the development of this project.
