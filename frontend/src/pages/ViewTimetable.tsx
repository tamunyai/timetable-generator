import { Layout } from "@/components";

const ViewTimetable = () => {
  return (
    <Layout title="View Timetable">
      <section className="section__timetable-view">
        <div>
          <h1>Your Generated Timetable</h1>
          <p>
            Here is the automatically generated timetable based on your input.
          </p>
        </div>

        {/* Placeholder for timetable display */}
        <div>
          <p>[Timetable will be displayed here]</p>
        </div>
      </section>
    </Layout>
  );
};

export default ViewTimetable;
