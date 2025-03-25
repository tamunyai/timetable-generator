import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ViewTimetable, Home, CreateTimetable, About } from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create_timetable" element={<CreateTimetable />} />
        <Route path="/view_timetable" element={<ViewTimetable />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
