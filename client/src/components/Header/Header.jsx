import logoutIcon from "../../assets/logout.png";
import "./Header.css";
import NavBar from "../Navbar/Navbar.jsx";

export default function Header({ isAdmin, onAdminClick, onLogout }) {
  return (
    <header className="header">
      <div className="header__left">
        <p className="header__logo">Logo</p>
        <h1 className="header__title">
          Telephone Directory{" "}
          {isAdmin && <span>: Admin Panel</span>}
        </h1>
      </div>

      <NavBar isAdmin={isAdmin} />

      <div className="header__right">
        {!isAdmin && (
          <button className="login__btn" onClick={onAdminClick}>
            Admin Login
          </button>
        )}

        {isAdmin && (
          <>
            <span className="user__name">User: Admin</span>
            <button className="logout__btn" onClick={onLogout}>
              <img src={logoutIcon} alt="Logout" />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
