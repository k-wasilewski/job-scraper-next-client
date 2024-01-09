import React from "react";
import { setToLocalStorage } from "../utils/themeService";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, setTheme, Theme } from "../redux/slices";

const Navbar = () => {
    const theme = useSelector(selectTheme);

    const dispatch = useDispatch();

    const changeTheme = (theme: Theme) => {
        if (!theme) return;

        dispatch(setTheme(theme));
        setToLocalStorage(theme);
    }

    const isDark = theme === Theme.Dark;

    return (
        <nav className={`navbar navbar-expand-lg navbar-${isDark ? 'dark' : 'light'}`}>
            <a className={`navbar-brand ${isDark ? 'text-white' : ''}`}>job-scraper</a>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item mx-5">
                        <Link href="/">
                            <a className="nav-link">Home</a>
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav justify-content-end ms-auto">
                    <li className="nav-item dropdown mx-5">
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            Theme
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <button style={{fontWeight: theme === Theme.Light ? 'bold' : 'normal'}} className="dropdown-item" onClick={() => changeTheme(Theme.Light)}>Light</button>
                            <button style={{fontWeight: theme === Theme.Dark ? 'bold' : 'normal'}} className="dropdown-item" onClick={() => changeTheme(Theme.Dark)}>Dark</button>
                        </div>
                    </li>
                    <Link href="/login">
                        <a className="nav-link">Logout</a>
                    </Link>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;