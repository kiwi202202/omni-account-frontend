import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Banner from "../components/Banner";
import UserOpExecution from "../pages/UserOpExecution";
import TicketInteractionPage from "../pages/TicketInteractionPage";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Banner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userop-execution" element={<UserOpExecution />} />
        <Route path="/ticket-interaction" element={<TicketInteractionPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
