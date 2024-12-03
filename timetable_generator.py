import random
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Set, Tuple


@dataclass
class Module:
    name: str
    units: int
    lecturer: str
    year: int


@dataclass
class DegreeProgram:
    name: str
    modules: List[Module]


@dataclass
class TimeSlot:
    day: str
    start_time: datetime
    duration: int  # in hours


class TimetableGenerator:
    def __init__(self):
        self.degree_programs: List[DegreeProgram] = []
        self.lecturers: Set[str] = set()
        self.timetable: Dict[str, List[Tuple[TimeSlot, Module]]] = {}
        self.working_hours = {
            "Monday": (8, 17),  # 8 AM - 5 PM
            "Tuesday": (8, 17),
            "Wednesday": (8, 17),
            "Thursday": (8, 17),
            "Friday": (8, 14),  # 8 AM - 2 PM
        }
        self.break_time = (14, 15)  # 2 PM - 3 PM

    def get_user_input(self) -> None:
        """Get all necessary information from the user"""
        print("\n=== Department Timetable Generator ===")

        # Get lecturers
        while True:
            num_lecturers = int(input("\nEnter the number of lecturers: "))
            if num_lecturers >= 8:  # Minimum needed for constraints
                break
            print("You need at least 8 lecturers to meet the teaching constraints.")

        print("\nEnter lecturer names:")
        self.lecturers = set()
        for i in range(num_lecturers):
            lecturer = input(f"Lecturer {i+1}: ")
            self.lecturers.add(lecturer)

        # Get degree programs
        while True:
            num_programs = int(
                input("\nEnter the number of degree programs (minimum 4): ")
            )
            if num_programs >= 4:
                break
            print("You need at least 4 degree programs.")

        self.degree_programs = []

        for i in range(num_programs):
            print(f"\nDegree Program {i+1}")
            program_name = input("Enter program name: ")

            # Get modules for this program
            modules = []
            total_units = 0
            four_unit_count = 0

            while True:
                num_modules = int(
                    input(f"Enter number of modules for {program_name} (minimum 7): ")
                )
                if num_modules >= 7:
                    break
                print("Each program must have at least 7 modules.")

            print(f"\nEnter module details for {program_name}:")
            for j in range(num_modules):
                while True:
                    print(f"\nModule {j+1}")
                    module_name = input("Module name: ")

                    while True:
                        units = int(input("Units (2-4): "))
                        if units in [2, 3, 4]:
                            if units == 4 and four_unit_count >= 2:
                                print(
                                    "Cannot add more 4-unit courses (maximum 2 allowed)."
                                )
                                continue
                            break
                        print("Units must be 2, 3, or 4.")

                    if units == 4:
                        four_unit_count += 1

                    while True:
                        year = int(input("Year (1-4): "))
                        if 1 <= year <= 4:
                            break
                        print("Year must be between 1 and 4.")

                    new_total = total_units + units
                    if new_total > 24:
                        print(
                            f"Total units would exceed 24 (current: {total_units}, adding: {units})"
                        )
                        continue

                    total_units = new_total
                    break

                # Automatically assign a lecturer to the current module
                available_lecturers = self.get_available_lecturers(year, modules)
                if not available_lecturers:
                    print(
                        "No available lecturers for this module. Please adjust previous assignments."
                    )
                    continue

                lecturer = random.choice(available_lecturers)
                modules.append(Module(module_name, units, lecturer, year))

            if total_units < 16:
                print(f"Total units ({total_units}) is less than minimum required (16)")
                continue

            self.degree_programs.append(DegreeProgram(program_name, modules))

    def get_available_lecturers(
        self, year: int, existing_modules: List[Module]
    ) -> List[str]:
        """Get available lecturers for a given year considering existing assignments"""
        # Get all the lecturers already assigned to this year
        assigned_to_year = {
            module.lecturer for module in existing_modules if module.year == year
        }

        # Get all the assigned years for each lecturer
        lecturer_years = {}
        for module in existing_modules:
            if module.lecturer not in lecturer_years:
                lecturer_years[module.lecturer] = set()
            lecturer_years[module.lecturer].add(module.year)

        # Find available lecturers
        available = []
        for lecturer in self.lecturers:
            if lecturer in assigned_to_year:
                continue

            years_teaching = lecturer_years.get(lecturer, set())
            if len(years_teaching) < 2 or year not in years_teaching:
                available.append(lecturer)

        return available

    def hours_difference(self, time1: datetime, time2: datetime) -> float:
        """Calculate the difference between two datetime objects in hours"""
        diff = time1 - time2
        return abs(diff.total_seconds() / 3600)

    def validate_lecturer_constraints(
        self, timetable: Dict[str, List[Tuple[TimeSlot, Module]]]
    ) -> bool:
        """Validate lecturer teaching constraints"""
        lecturer_schedules = {}

        for program in timetable:
            for slot, module in timetable[program]:
                if module.lecturer not in lecturer_schedules:
                    lecturer_schedules[module.lecturer] = []
                lecturer_schedules[module.lecturer].append((slot, module))

        for lecturer in lecturer_schedules:
            # Check if a lecturer teaches in multiple years 
            years_taught = set(
                module.year for _, module in lecturer_schedules[lecturer]
            )
            if len(years_taught) < 2:
                return False

            # Check consecutive teaching hours
            sorted_schedule = sorted(
                lecturer_schedules[lecturer], key=lambda x: (x[0].day, x[0].start_time)
            )
            consecutive_hours = 0
            last_end_time = None

            for slot, _ in sorted_schedule:
                if last_end_time:
                    if self.hours_difference(slot.start_time, last_end_time) < 1:
                        consecutive_hours += slot.duration
                        if consecutive_hours > 2:
                            return False
                    else:
                        consecutive_hours = slot.duration
                else:
                    consecutive_hours = slot.duration
                last_end_time = slot.start_time + timedelta(hours=slot.duration)

        return True

    def validate_free_periods(self) -> bool:
        """Validate that students don't have more than 2 hours free between lectures"""
        for _, schedule in self.timetable.items():
            # Group sessions by day
            daily_schedule = {}
            for slot, module in schedule:
                if slot.day not in daily_schedule:
                    daily_schedule[slot.day] = []
                daily_schedule[slot.day].append((slot, module))

            # Check each day's schedule
            for _, sessions in daily_schedule.items():
                sorted_sessions = sorted(sessions, key=lambda x: x[0].start_time)

                for i in range(len(sorted_sessions) - 1):
                    current_end = sorted_sessions[i][0].start_time + timedelta(
                        hours=sorted_sessions[i][0].duration
                    )
                    next_start = sorted_sessions[i + 1][0].start_time

                    # Calculate gap (in hours)
                    gap = self.hours_difference(next_start, current_end)

                    # If the gap is during break time (2 PM - 3 PM), subtract an hour
                    if current_end.hour <= 14 and next_start.hour >= 15:
                        gap -= 1

                    if gap > 2:
                        return False

        return True

    def check_slot_conflict(self, slot1: TimeSlot, slot2: TimeSlot) -> bool:
        """Check if two time slots conflict with each other"""
        if slot1.day != slot2.day:
            return False

        slot1_end = slot1.start_time + timedelta(hours=slot1.duration)
        slot2_end = slot2.start_time + timedelta(hours=slot2.duration)

        return not (slot1_end <= slot2.start_time or slot2_end <= slot1.start_time)

    def get_available_slots(self) -> List[TimeSlot]:
        """Generate all possible time slots"""
        available_slots = []
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        for day in days:
            start_hour, end_hour = self.working_hours[day]
            current_hour = start_hour

            while current_hour < end_hour:
                if current_hour == self.break_time[0]:
                    current_hour = self.break_time[1]
                    continue

                available_slots.append(
                    TimeSlot(day, datetime.strptime(f"{current_hour}:00", "%H:%M"), 1)
                )
                current_hour += 1

        return available_slots

    def is_valid_slot(self, slot: TimeSlot, program_name: str, lecturer: str) -> bool:
        """Check if a time slot is valid for a given program and lecturer"""
        # Check conflicts with program schedule
        for existing_slot, _ in self.timetable[program_name]:
            if self.check_slot_conflict(slot, existing_slot):
                return False

        # Check lecturer conflicts across all programs
        for _, schedule in self.timetable.items():
            for existing_slot, existing_module in schedule:
                if existing_module.lecturer == lecturer and self.check_slot_conflict(
                    slot, existing_slot
                ):
                    return False

        return True

    def generate_timetable(self) -> Dict[str, List[Tuple[TimeSlot, Module]]]:
        """Generate the timetable following all constraints"""
        max_attempts = 50  # Maximum number of attempts to generate a valid timetable
        attempt = 0

        while attempt < max_attempts:
            attempt += 1
            print(f"Attempt {attempt} of {max_attempts}")

            self.timetable = {}

            try:
                # Initialize empty timetable for each program
                for program in self.degree_programs:
                    self.timetable[program.name] = []

                # Get all possible time slots
                all_slots = self.get_available_slots()

                # Assign modules to time slots
                for program in self.degree_programs:
                    for module in program.modules:
                        hours_needed = module.units
                        slots_for_module = []
                        available_slots = all_slots.copy()

                        while hours_needed > 0 and available_slots:
                            # Try to find a suitable slot
                            valid_slots = [
                                slot
                                for slot in available_slots
                                if self.is_valid_slot(
                                    slot, program.name, module.lecturer
                                )
                            ]

                            if not valid_slots:
                                raise ValueError("No valid slots available")

                            slot = random.choice(valid_slots)
                            slots_for_module.append(slot)
                            available_slots.remove(slot)
                            hours_needed -= 1

                        # Add all slots for this module to the timetable
                        for slot in slots_for_module:
                            self.timetable[program.name].append((slot, module))

                if not self.validate_free_periods():
                    raise ValueError("Student free periods not satisfied")

                if not self.validate_lecturer_constraints(self.timetable):
                    raise ValueError("Lecturer constraints not satisfied")

                print("Valid timetable generated!")
                return self.timetable

            except ValueError as error:
                print(f"Failed attempt {attempt}: {error}")
                continue

        raise ValueError("Failed to generate valid timetable after maximum attempts")

    def display_timetable(self) -> None:
        """Display the generated timetable"""
        if not self.timetable:
            print("No timetable to display")
            return

        for program_name, schedule in self.timetable.items():
            print(f"\nTimetable for {program_name}")
            print("-" * 50)

            # Sort schedule by day and time
            sorted_schedule = sorted(
                schedule, key=lambda x: (x[0].day, x[0].start_time)
            )

            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            for day in days:
                print(f"\n{day}:")
                day_schedule = [s for s in sorted_schedule if s[0].day == day]
                if not day_schedule:
                    print("No classes scheduled")
                    continue

                for slot, module in day_schedule:
                    print(
                        f"{slot.start_time.strftime('%H:%M')} - "
                        f"{(slot.start_time + timedelta(hours=slot.duration)).strftime('%H:%M')}: "
                        f"{module.name} (Lecturer: {module.lecturer}, Year: {module.year}, Units: {module.units})"
                    )

    def validate_program_constraints(self) -> bool:
        """Validate all program constraints"""
        # Check that there are at least 4 degree programs
        if len(self.degree_programs) < 4:
            print("The department must have at least 4 degree programs.")
            print(f"The department has {len(self.degree_programs)}")
            return False

        for program in self.degree_programs:
            # Ensure each program has at least 7 modules
            if len(program.modules) < 7:
                print(f"The program '{program.name}' must have at least 7 modules.")
                return False

            # Check total units
            total_units = sum(module.units for module in program.modules)
            if total_units < 16 or total_units > 24:
                print(f"Invalid total units for {program.name}: {total_units}")
                return False

            # Check 4-unit course limit
            four_unit_courses = sum(
                1 for module in program.modules if module.units == 4
            )
            if four_unit_courses > 2:
                print(f"Too many 4-unit courses in {program.name}: {four_unit_courses}")
                return False

        return True


if __name__ == "__main__":
    generator = TimetableGenerator()
    generator.get_user_input()

    print("Generating timetable...")
    print("\nValidating program constraints...")

    if generator.validate_program_constraints():
        print("Program constraints validated successfully!")

        try:
            generator.generate_timetable()
            generator.display_timetable()
        except ValueError as error:
            print(f"Failed to generate timetable: {error}")
    else:
        print("Program constraints validation failed!")
