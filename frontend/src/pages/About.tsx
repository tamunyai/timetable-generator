import { Layout } from "@/components";
import { contributors } from "@/constants";

const About = () => {
  return (
    <Layout title="About">
      <section className="section__about" id="section-about">
        <div className="section__container">
          <h1>
            What is the <strong>Timetable Generator</strong>?
          </h1>
        </div>

        <div>
          <p>
            The <strong>Timetable Generator</strong> is an innovative web-based
            tool created as the final project for the{" "}
            <strong>Programming & GRIT Bootcamp</strong> offered by{" "}
            <strong>GRIT Lab Africa</strong>.
          </p>
          <p>
            It provides students and academic institutions with an automated
            solution to generate timetables that fit their unique constraints
            and needs. Users can input details such as the number of lecturers,
            available modules, and course durations to generate an optimized
            timetable.
          </p>
          <p>
            Our backend is powered by <strong>Python and Flask</strong>,
            ensuring efficiency and scalability. The frontend is built using{" "}
            <strong>React, TypeScript, and TailwindCSS</strong> to provide a
            seamless user experience.
          </p>
          <p>
            This project is the result of months of hard work, collaboration,
            and problem-solving.
          </p>
        </div>

        <div>
          <h2>Meet the Contributors</h2>
          <p>
            We are a group of passionate students who came together to work on
            this project.
          </p>

          <ul className="contributor__list">
            {contributors.map((contributor, index) => (
              <li key={index} className="contributor__item">
                <h3 className="contributor__name">{contributor.name}</h3>
                <p className="contributor__role">{contributor.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default About;
