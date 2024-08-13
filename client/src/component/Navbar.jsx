import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
  const [dropdown, setDropdownMenu] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>
      <div className="navbar_search">
        <input type="text" placeholder="Search..." />
        <IconButton>
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>
      <button
        className="navbar_right_account"
        onClick={() => setDropdownMenu(!dropdown)}
      >
        <Menu sx={{ color: variables.darkgrey }} />
        {!user ? (
          <Person sx={{ color: variables.darkgrey }} />
        ) : (
          <img
            src={`http://localhost:3001/${user.profileImagePath.replace(
              "public",
              ""
            )}`}
            alt="profile photo"
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        )}
      </button>
      {dropdown && (
        <div className="navbar_right_accountmenu">
          <Link to="">Recipies</Link>
          <Link to="">Courses</Link>
          <Link to="">Food & Beverage</Link>
          <Link to="">Resturents</Link>
          {user && (
              <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
              }}
            >
              Log Out
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;