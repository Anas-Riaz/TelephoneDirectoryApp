import { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ isAdmin }) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  function toggleAdminMenu() {
    setIsAdminOpen((prev) => !prev);
  }

  return (
    <nav className="navbar">
      {isAdmin && (
        <ul className="admin-user">
          <li>
            <Link to="/user" className="nav-link">
              User
            </Link>
          </li>
          <li>
            <button className="nav-link admin-toggle" onClick={toggleAdminMenu}>
              Admin {isAdminOpen ? "▲" : "▼"}
            </button>
            {isAdminOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/admin/adding-records" className="nav-link">
                    New Records
                  </Link>
                </li>
                <li>
                  <Link to="/admin/searching-viewing" className="nav-link">
                    Searching
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
