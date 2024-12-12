import random
import traceback

from flask import Blueprint, render_template, request

from timetable_generator import DegreeProgram, Module, TimetableGenerator

# Create the Blueprint for the 'main' routes
main = Blueprint("main", __name__)


@main.route("/")
def index():
    """
    Renders the index page.

    This route handles the display of the landing page for the application.

    Returns:
        flask.Response: The rendered index HTML template.
    """
    return render_template("index.html")


@main.route("/timetable", methods=["GET", "POST"])
def timetable():
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
    if request.method == "POST":
        try:
            lecturer_names = request.form.getlist("lecturer-name")
            if len(lecturer_names) < 8:
                return render_template(
                    "timetable.html",
                    error="You need at least 8 lecturers to generate a timetable.",
                )

            # Remove duplicates and empty entries
            lecturer_names = list(filter(bool, set(lecturer_names)))
            if len(lecturer_names) < 8:
                return render_template(
                    "timetable.html",
                    error="You need at least 8 unique lecturers to generate a timetable.",
                )

            # Initialize TimetableGenerator
            generator = TimetableGenerator()
            generator.lecturers = set(lecturer_names)

            programme_names = request.form.getlist("programme-name")
            if len(programme_names) < 4:
                return render_template(
                    "timetable.html",
                    error="You need at least 4 degree programmes to generate a timetable.",
                )

            programme_names = list(filter(bool, set(programme_names)))
            if len(programme_names) < 4:
                return render_template(
                    "timetable.html",
                    error="You need at least 4 unique degree programmes.",
                )

            # FIX: Retrieve programme id for out of order operations

            for i, programme_name in enumerate(programme_names):
                module_names = request.form.getlist(f"module-name-{i}")
                module_units = request.form.getlist(f"module-units-{i}")
                module_years = request.form.getlist(f"module-year-{i}")

                if not (len(module_names) == len(module_units) == len(module_years)):
                    return render_template(
                        "timetable.html",
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
                                "timetable.html",
                                error=f"Empty module name in programme {programme_name}.",
                            )

                        if units == 4:
                            if four_unit_count >= 2:
                                return render_template(
                                    "timetable.html",
                                    error="Cannot add more 4-unit courses (maximum 2 allowed).",
                                )
                            four_unit_count += 1

                        new_total = total_units + units
                        if new_total > 24:
                            return render_template(
                                "timetable.html",
                                error=f"Total units for {programme_name} exceed 24 (current: {total_units})",
                            )
                        total_units = new_total

                        available_lecturers = generator.get_available_lecturers(
                            year, modules
                        )
                        if not available_lecturers:
                            return render_template(
                                "timetable.html",
                                error=f"No available lecturers for {module_name} module. Please adjust previous assignments.",
                            )

                        lecturer = random.choice(available_lecturers)
                        modules.append(Module(module_name, units, lecturer, year))

                    except ValueError:
                        return render_template(
                            "timetable.html",
                            error=f"Invalid input for module in {programme_name}.",
                        )

                if len(modules) < 7:
                    return render_template(
                        "timetable.html",
                        error=f"Programme {programme_name} must have at least 7 modules",
                    )

                if total_units < 16:
                    return render_template(
                        "timetable.html",
                        error=f"Total units ({total_units}) is less than minimum required (16)",
                    )

                generator.degree_programs.append(DegreeProgram(programme_name, modules))

            if not generator.validate_program_constraints():
                return render_template(
                    "timetable.html",
                    error="Input data does not meet the program constraints.",
                )

            # Generate timetable
            timetable = generator.generate_timetable()

            # TODO: Format timetable for the template

            return render_template("timetable.html", timetable=timetable)

        except Exception as e:
            traceback.print_exc()  # Log the full error for debugging
            return render_template(
                "timetable.html", error=f"Error generating timetable: {str(e)}"
            )

    return render_template("timetable.html")


@main.route("/about")
def about():
    """
    Renders the about page.

    This route displays information about the application, such as its purpose 
    and the team behind the project.

    Returns:
        flask.Response: The rendered about HTML template.
    """
    return render_template("about.html")
