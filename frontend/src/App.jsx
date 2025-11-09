import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import CourseChatPage from "./pages/CourseChatPage";
import CICS110 from "./pages/CICS110";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/CICS110" element={<CICS110/>} />
            <Route path="/:courseId" element={<CourseChatPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}