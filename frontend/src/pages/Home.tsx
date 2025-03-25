import { Link } from "react-router-dom";
import { Layout } from "@/components";

const Home = () => {
  return (
    <Layout title="Home">
      <section className="section__home" id="section-home">
        <div className="section__container">
          <p>
            <strong>Site Under Construction:</strong> We're working hard to
            bring you an amazing experience. Please be patient as we finalize
            everything!
          </p>
        </div>

        <div>
          <h1>
            Welcome to the JBS GL Bootcamp <strong>Group 15</strong> Final
            Project
          </h1>
          <p>
            The <strong>Timetable Generator</strong> is our final group project
            for the intensive <strong>Programming & GRIT Bootcamp</strong>{" "}
            offered by <strong>GRIT Lab Africa</strong>. This free training and
            mentoring program focuses on{" "}
            <span>
              problem-solving, algorithms, and introductory programming with
              Python.
            </span>
          </p>
          <p>
            Through this project, we aim to provide an automated solution to
            create timetables for students, ensuring an efficient and easy way
            to manage class schedules.
          </p>
          <p>
            Curious to learn more?{" "}
            <Link to="/about">Discover how this project came to life →</Link>
          </p>
        </div>

        <div className="cta">
          <p>
            Ready to create your timetable? Simply click the button below to
            start generating your personalized schedule.
          </p>
          <Link to="/create">Get Started</Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
