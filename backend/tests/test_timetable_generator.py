import pytest

from timetable_generator import TimetableGenerator


@pytest.fixture
def generator():
    return TimetableGenerator()


def test_generate_timetable_edge_cases(generator, monkeypatch):
    """Test edge cases for generating a timetable."""

    # Simulate user input
    inputs = [
        "8",  # Number of lecturers (minimum)
        "Dr. Smith", "Dr. Johnson", "Prof. Adams", "Dr. Clark",
        "Dr. Lewis", "Prof. Martinez", "Dr. Lopez", "Dr. Walker",
        
        # 4 degree programs
        "4",

        # Degree Program with minimal modules
        "Computer Science",
        "7",  # Number of modules (minimum)
        "Algorithms", "4", "1",
        "Data Structures", "3", "1",
        "Operating Systems", "4", "2",
        "Database Systems", "3", "2",
        "Artificial Intelligence", "3", "3",
        "Machine Learning", "2", "3",
        "Software Engineering", "3", "4",

        "Information Technology",
        "7",
        "Networks", "4", "1",
        "Web Development", "3", "1",
        "Cybersecurity", "4", "2",
        "Cloud Computing", "3", "2",
        "Project Management", "3", "3",
        "Systems Analysis", "2", "3",
        "IT Ethics", "2", "4",

        "Software Engineering",
        "7",
        "Software Architecture", "4", "1",
        "Design Patterns", "3", "1",
        "Testing and QA", "4", "2",
        "Agile Methodologies", "3", "2",
        "DevOps Practices", "3", "3",
        "Microservices", "2", "3",
        "Scalable Systems", "3", "4",

        "Data Science",
        "7",
        "Statistics", "4", "1",
        "Data Mining", "3", "1",
        "Big Data Technologies", "4", "2",
        "Data Visualization", "3", "2",
        "Natural Language Processing", "3", "3",
        "Deep Learning", "2", "3",
        "Predictive Analytics", "3", "4",
    ]

    monkeypatch.setattr("builtins.input", lambda _: inputs.pop(0))

    try:
        generator.get_user_input()
        generator.validate_program_constraints()
        generator.generate_timetable()
        generator.display_timetable()
    except ValueError as error:
        pytest.fail(f"Timetable generation failed with error: {error}")
