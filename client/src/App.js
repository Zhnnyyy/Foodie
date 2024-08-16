import "./App.css";
import Authentication from "./pages/Authentication/Authentication";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Verification from "./pages/Verification/Verification";
import _404 from "./pages/_404/_404";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact Component={Authentication} />
        <Route path="/verification" exact Component={Verification} />
        <Route path="/page_not_found" Component={_404} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/user/profile" Component={Profile} />
      </Routes>
    </Router>
  );
}

export default App;
