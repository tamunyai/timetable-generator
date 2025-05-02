import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CreateTimetable, Home, ViewTimetable } from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTimetable />} />
        <Route path="/view" element={<ViewTimetable />} />
      </Routes>
    </Router>
  );
};

export default App;
