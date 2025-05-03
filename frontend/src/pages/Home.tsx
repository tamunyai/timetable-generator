import Layout from "./Layout";
import { Button, Footer } from "../components";

interface Contributor {
  name: string;
  role: string;
}

const Home = () => {
  const contributors: Contributor[] = [
    { name: "Kamogelo Selepe", role: "Project Lead" },
    { name: "Nobuhle Ndlovu", role: "Backend Developer" },
    { name: "Thendo A Munyai", role: "Frontend & Backend Developer" },
    { name: "Njabulo Zulu", role: "Documentation & Research" },
  ];

  return (
    <Layout title="Home">
      <section className="flex flex-col justify-center items-center mx-auto px-4 py-24 max-w-3xl min-h-[80vh] text-center">
        <div className="inline-block bg-blue-100 mb-6 px-3 py-1 font-semibold text-blue-800 text-xs">
          Site Under Construction
        </div>

        <h1 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight">
          Timetable Generator
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-xl">
          Built during the <strong>GRIT Lab Africa Bootcamp</strong>, this tool
          helps students create custom timetables quickly and easily.
        </p>

        <Button to="/create" label="Generate Your Timetable" />
      </section>

      <section className="mx-auto mt-12 px-4 py-16 border-t max-w-6xl text-gray-800">
        <h2 className="mb-12 font-semibold text-3xl md:text-4xl text-center">
          What It Does
        </h2>

        <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3">
          {/* Card 1 */}
          <div className="shadow-sm hover:shadow-md p-6 border rounded-lg transition">
            <div className="mb-4 text-blue-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-xl">Smart Scheduling</h3>
            <p className="text-gray-600">
              Generate efficient class timetables with just a few inputs, no
              spreadsheets required.
            </p>
          </div>

          {/* Card 2 */}
          <div className="shadow-sm hover:shadow-md p-6 border rounded-lg transition">
            <div className="mb-4 text-green-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5l4 4-11 11H5v-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-xl">Modern Stack</h3>
            <p className="text-gray-600">
              Built with Python, Flask, React, TypeScript, and TailwindCSS; fast
              and scalable.
            </p>
          </div>

          {/* Card 3 */}
          <div className="shadow-sm hover:shadow-md p-6 border rounded-lg transition">
            <div className="mb-4 text-purple-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 3v4h14V3M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9z" />
              </svg>
            </div>
            <h3 className="mb-2 font-medium text-xl">Made for You</h3>
            <p className="text-gray-600">
              Designed for students, educators, and institutions to simplify
              schedule creation.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto px-4 py-16 max-w-6xl text-gray-800">
        <h2 className="mb-10 font-semibold text-3xl md:text-4xl text-center">
          Meet the Team
        </h2>

        <div className="relative overflow-hidden">
          {/* Scrolling content */}
          <div className="flex space-x-4 w-max animate-infinite-scroll">
            {[...contributors, ...contributors, ...contributors].map(
              (contributor, index) => (
                <div
                  key={index}
                  className="inline-block p-4 rounded-lg text-center transition"
                >
                  <div className="font-semibold text-lg">
                    {contributor.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {contributor.role}
                  </div>
                </div>
              )
            )}
          </div>
          {/* Left blur */}
          <div className="top-0 left-0 z-10 absolute bg-gradient-to-r from-gray-50 to-transparent w-16 h-full pointer-events-none" />
          {/* Right blur */}
          <div className="top-0 right-0 z-10 absolute bg-gradient-to-l from-gray-50 to-transparent w-16 h-full pointer-events-none" />{" "}
        </div>
      </section>

      <Footer />
    </Layout>
  );
};

export default Home;
