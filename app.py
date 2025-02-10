import random
from datetime import timedelta

from flask import Flask, redirect, render_template, request, session, url_for

from config import FLASK_DEBUG, FLASK_HOST, FLASK_PORT, SECRET_KEY
from timetable_generator import DegreeProgram, Module, TimetableGenerator

app = Flask(__name__)
app.secret_key = SECRET_KEY


@app.route("/")
def index():
    """
    Renders the index page.

    This route handles the display of the landing page for the application.

    Returns:
        flask.Response: The rendered index HTML template.
    """
    return render_template("index.html")


@app.route("/create_timetable", methods=["GET", "POST"])
def create_timetable():
    """
    Generates and displays the timetable based on user input.

    This route handles both the display of the timetable form and the logic for
    generating the timetable. It processes lecturer names, programme information,
    and modules based on POST data, and performs validation to ensure that input
    is correct. If valid, a timetable is generated using the TimetableGenerator class.

    Returns:
        flask.Response: The rendered timetable HTML template, with either
        an error message or the generated timetable.
    """
    if request.method == "GET":
        return render_template("create_timetable.html")

    try:
        lecturer_names = request.form.getlist("lecturer-name")
        if len(lecturer_names) < 8:
            return render_template(
                "create_timetable.html",
                error="You need at least 8 lecturers to generate a timetable.",
            )

        # Remove duplicates and empty entries
        lecturer_names = list(filter(bool, set(lecturer_names)))
        if len(lecturer_names) < 8:
            return render_template(
                "create_timetable.html",
                error="You need at least 8 unique lecturers to generate a timetable.",
            )

        generator = TimetableGenerator()
        generator.lecturers = set(lecturer_names)

        programme_names = request.form.getlist("programme-name")
        if len(programme_names) < 4:
            return render_template(
                "create_timetable.html",
                error="You need at least 4 degree programmes to generate a timetable.",
            )

        programme_names = list(filter(bool, set(programme_names)))
        if len(programme_names) < 4:
            return render_template(
                "create_timetable.html",
                error="You need at least 4 unique degree programmes.",
            )

        # FIX: Retrieve programme id for out of order operations

        for i, programme_name in enumerate(programme_names):
            module_names = request.form.getlist(f"module-name-{i}")
            module_units = request.form.getlist(f"module-units-{i}")
            module_years = request.form.getlist(f"module-year-{i}")

        if not (len(module_names) == len(module_units) == len(module_years)):
            return render_template(
                "create_timetable.html",
                error=f"Invalid input for programme {programme_name}.",
            )

        modules = []
        total_units = 0
        four_unit_count = 0

        for module_name, units, year in zip(
            module_names, module_units, module_years
        ):
            try:
                module_name = module_name.strip()
                units = int(units)
                year = int(year)

                if not module_name:
                    return render_template(
                        "create_timetable.html",
                        error=f"Empty module name in programme {programme_name}.",
                    )

                if units == 4:
                    if four_unit_count >= 2:
                        return render_template(
                            "create_timetable.html",
                            error="Cannot add more 4-unit courses (maximum 2 allowed).",
                        )
                    four_unit_count += 1

                new_total = total_units + units
                if new_total > 24:
                    return render_template(
                        "create_timetable.html",
                        error=f"Total units for {programme_name} exceed 24 (current: {total_units})",
                    )
                total_units = new_total

                available_lecturers = generator.get_available_lecturers(
                    year, modules
                )
                if not available_lecturers:
                    return render_template(
                        "create_timetable.html",
                        error=f"No available lecturers for {module_name} module. Please adjust previous assignments.",
                    )

                lecturer = random.choice(available_lecturers)
                modules.append(Module(module_name, units, lecturer, year))

            except ValueError:
                return render_template(
                    "create_timetable.html",
                    error=f"Invalid input for module in {programme_name}.",
                )

        if len(modules) < 7:
            return render_template(
                "create_timetable.html",
                error=f"Programme {programme_name} must have at least 7 modules",
            )

        if total_units < 16:
            return render_template(
                "create_timetable.html",
                error=f"Total units ({total_units}) is less than minimum required (16)",
            )

        generator.degree_programs.append(DegreeProgram(programme_name, modules))

        if not generator.validate_program_constraints():
            return render_template(
                "create_timetable.html",
                error="Input data does not meet the program constraints.",
            )

        # Generate timetable
        try:
            timetable = generator.generate_timetable()

            session["timetable"] = {
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

            return redirect(url_for("view_timetable"))

        except ValueError:
            return render_template(
                "create_timetable.html",
                error="Failed to generate valid timetable after maximum attempts",
            )

    except Exception as e:
        return render_template(
            "create_timetable.html", error=f"Error generating timetable: {str(e)}"
        )


@app.route("/view_timetable")
def view_timetable():
    if "timetable" not in session:
        return redirect(url_for("create_timetable"))

    return render_template("view_timetable.html", timetable=session["timetable"])


@app.route("/about")
def about():
    """
    Renders the about page.

    This route displays information about the application, such as its purpose
    and the team behind the project.

    Returns:
        flask.Response: The rendered about HTML template.
    """
    return render_template("about.html")


if __name__ == "__main__":
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
