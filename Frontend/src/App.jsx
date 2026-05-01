import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintHistory from "./pages/ComplaintHistory";
import Performance from "./pages/Performance";
function Layout() {

const location = useLocation();

/* Hide navbar on admin login */
const hideNavbar = location.pathname === "/admin/login";

return (

<>
{!hideNavbar && <Navbar />}

<Routes>

<Route path="/" element={<Home />} />

<Route path="/submit" element={<SubmitComplaint />} />

<Route path="/track" element={<TrackComplaint />} />

<Route path="/admin/login" element={<AdminLogin />} />

<Route path="/admin" element={<AdminDashboard />} />
<Route path="/history" element={<ComplaintHistory />} />
  {/* <Route path="/performance" element={<Performance />} /> */}


</Routes>

</>

);

}

function App() {

return (

<Router>

<Layout />

</Router>

);

}

export default App;