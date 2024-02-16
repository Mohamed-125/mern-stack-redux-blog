import { useEffect, useState } from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";

const Header = ({
  logo,
  normalLinks,
  sideLinks,
  boxShadow = true,
  rtlNav = false,
  backgroundColor,
  hoverColor,
  linkColor,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleNavbar = () => {
    setIsMobileNavOpen((pre) => !pre);
  };

  useEffect(() => {
    [...document.querySelectorAll("a")].forEach((link) => {
      link.style.setProperty("--link-color", linkColor);
      link.style.setProperty("--hover-color", hoverColor);
    });
  }, []);

  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const [logoutF, { isLoading, error }] = useLogoutMutation();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    console.log("tsrtsrtsrtsrtsr");
    try {
      const res = await logoutF().unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    dispatch(logout());
  };

  const Links = () => {
    return (
      <>
        <Link onClick={toggleNavbar} to="/" className="link">
          Home
        </Link>
        {user ? (
          <>
            <Link onClick={toggleNavbar} to="/blogs/new" className="link">
              New Blog
            </Link>
            <Link
              onClick={toggleNavbar}
              to={"/profile/" + user._id}
              className="link"
            >
              <img src={user.profileImg} className="rounded-full w-9 h-9" />
            </Link>

            <Button
              onClick={() => {
                logoutHandler();
                toggleNavbar();
              }}
              size="md"
              variant="danger"
            >
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link onClick={toggleNavbar} to="/login" className="link">
              Login
            </Link>
            <Link onClick={toggleNavbar} to="/register" className="link">
              Register
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header
      className={`${boxShadow && "box_shadow"}  ${rtlNav && "rtl_nav"}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="logo">
        <Link to="/">
          <h1>LOGO</h1>
        </Link>
      </div>

      <img
        onClick={toggleNavbar}
        className="nav_btn"
        src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/hamburger-menu-icon.png"
      ></img>

      <div className={`nav_mobile ${isMobileNavOpen && "nav_opened"}`}>
        <Links />
      </div>

      <div className="flex items-center gap-3 links_div-lg">
        <Links />
      </div>
    </header>
  );
};
export default Header;
