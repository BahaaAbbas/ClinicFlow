import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>ClinicFlow</h1>
        <div className="navbar-right">
          {user && (
            <>
              <span className="navbar-user">
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogOut} className="btn btn-secondary">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
