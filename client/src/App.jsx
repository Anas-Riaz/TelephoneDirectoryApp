import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useRef, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import AddingRecords from "./components/AddingRecords/AddingRecords";
import SearchingViewing from "./components/SearchingViewing/SearchingViewing";
import User from "./pages/User.jsx";
import Header from "./components/Header/Header.jsx";
import Admin from "./pages/Admin.jsx";
import AuthModal from "./components/AuthModal/AuthModal.jsx";

function Layout() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("token"));
  const loginModalRef = useRef();
  const navigate = useNavigate();

  function handleAdminClick() {
    loginModalRef.current.showModal();
  }

  function handleLoginSuccess() {
    setIsAdmin(true);
    navigate("/admin/searching-viewing");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAdmin(false);
    navigate("/user");
  }

  return (
    <>
      <Header
        isAdmin={isAdmin}
        onAdminClick={handleAdminClick}
        onLogout={handleLogout} // pass down
      />
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/user" element={<User />} />
        <Route element={<ProtectedRoute isAllowed={isAdmin} />}>
          <Route path="/admin" element={<Admin />}>
            <Route path="searching-viewing" element={<SearchingViewing />} />
            <Route path="adding-records" element={<AddingRecords />} />
          </Route>
        </Route>
        <Route path="*" element={<User />} />
      </Routes>

      <AuthModal ref={loginModalRef} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
