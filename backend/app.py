import random
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS

from config import FLASK_DEBUG, FLASK_HOST, FLASK_PORT
from timetable_generator import DegreeProgram, Module, TimetableGenerator

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate


@app.route("/api/timetable", methods=["POST"])
def create_timetable():
    """
    Generates a timetable based on user input received as JSON data.

    This route processes lecturer names, programme information, and modules
    from the incoming JSON body and performs validation. If valid, a timetable
    is generated using the TimetableGenerator class and returned as a JSON response.

    Returns:
        flask.Response: JSON response with the result of the timetable generation.
    """
    try:
        data = request.get_json()

        # Extract lecturer names and validate
        lecturer_names = data.get("lecturers", [])
        if len(lecturer_names) < 8:
            return jsonify(
                {
                    "error": "You need at least 8 lecturers to generate a timetable."
                }
            ), 400

        lecturer_names = list(
            filter(bool, set(lecturer_names))
        )  # Remove duplicates
        if len(lecturer_names) < 8:
            return jsonify(
                {
                    "error": "You need at least 8 unique lecturers to generate a timetable."
                }
            ), 400

        # Initialize the timetable generator with the lecturers
        generator = TimetableGenerator()
        generator.lecturers = set(lecturer_names)

        # Extract programme information and validate
        programme_data = data.get("programmes", [])
        if len(programme_data) < 4:
            return jsonify(
                {
                    "error": "You need at least 4 degree programmes to generate a timetable."
                }
            ), 400

        programme_data = [
            p for p in programme_data if p.get("name")
        ]  # Remove empty programmes
        if len(programme_data) < 4:
            return jsonify(
                {"error": "You need at least 4 unique degree programmes."}
            ), 400

        # Process each programme and its modules
        for programme in programme_data:
            programme_name = programme.get("name")
            module_data = programme.get("modules", [])

            if not module_data:
                return jsonify(
                    {
                        "error": f"Programme {programme_name} must have at least 1 module."
                    }
                ), 400

            modules = []
            total_units = 0
            four_unit_count = 0

            for module in module_data:
                module_name = module.get("name")
                units = module.get("units")
                year = module.get("year")

                if not module_name or not units or not year:
                    return jsonify(
                        {
                            "error": f"Invalid module data in programme {programme_name}."
                        }
                    ), 400

                try:
                    units = int(units)
                    year = int(year)

                    # Validate the module's unit count and the total units
                    if units == 4:
                        if four_unit_count >= 2:
                            return jsonify(
                                {
                                    "error": "Cannot add more 4-unit courses (maximum 2 allowed)."
                                }
                            ), 400
                        four_unit_count += 1

                    new_total = total_units + units
                    if new_total > 24:
                        return jsonify(
                            {
                                "error": f"Total units for {programme_name} exceed 24 (current: {total_units})"
                            }
                        ), 400
                    total_units = new_total

                    # Ensure there are available lecturers for the module
                    available_lecturers = generator.get_available_lecturers(
                        year, modules
                    )
                    if not available_lecturers:
                        return jsonify(
                            {
                                "error": f"No available lecturers for {module_name} in {programme_name}. Please adjust assignments."
                            }
                        ), 400

                    # Assign a random lecturer from available lecturers
                    lecturer = random.choice(available_lecturers)
                    modules.append(Module(module_name, units, lecturer, year))

                except ValueError:
                    return jsonify(
                        {
                            "error": f"Invalid unit or year value for module {module_name} in {programme_name}."
                        }
                    ), 400

            # Validate the programme's total units and module count
            if len(modules) < 7:
                return jsonify(
                    {
                        "error": f"Programme {programme_name} must have at least 7 modules."
                    }
                ), 400

            if total_units < 16:
                return jsonify(
                    {
                        "error": f"Total units for {programme_name} is less than the minimum required (16)."
                    }
                ), 400

            # Add the validated modules to the generator
            generator.degree_programs.append(
                DegreeProgram(programme_name, modules)
            )

        # Validate all program constraints
        if not generator.validate_program_constraints():
            return jsonify(
                {"error": "Input data does not meet the program constraints."}
            ), 400

        # Generate the timetable
        timetable = generator.generate_timetable()

        # Prepare timetable response
        timetable_response = {
            program: [
                {
                    "day": slot.day,
                    "start_time": slot.start_time.strftime("%H:%M"),
                    "end_time": (
                        slot.start_time + timedelta(hours=slot.duration)
                    ).strftime("%H:%M"),
                    "module_name": module.name,
                    "lecturer": module.lecturer,
                    "year": module.year,
                    "units": module.units,
                }
                for slot, module in program_schedule
            ]
            for program, program_schedule in timetable.items()
        }

        return jsonify({"timetable": timetable_response}), 200

    except Exception as e:
        return jsonify({"error": f"Error generating timetable: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
