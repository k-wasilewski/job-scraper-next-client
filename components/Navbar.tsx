import React from "react";
import { setToLocalStorage } from "../utils/themeService";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { isLoading, selectTheme, setTheme, Theme } from "../redux/slices";
import styles from "../styles/Navbar.module.css";
import { useWidth } from "../utils/useWidth";

const Navbar = () => {
    const theme = useSelector(selectTheme);
    const loading: boolean = useSelector(isLoading);

    const screenWidth = useWidth();

    const dispatch = useDispatch();

    const changeTheme = (theme: Theme) => {
        if (!theme) return;

        dispatch(setTheme(theme));
        setToLocalStorage(theme);
    }

    const dropdownClass = () => screenWidth > 991 ? 'dropdown' : 'dropend';

    const isDark = theme === Theme.Dark;

    const loader = (
        <div className="d-flex justify-content-center">
            <div className='spinner-border' style={{height: '3rem', width: '3rem', color: isDark ? 'white' : 'black'}}/>
        </div>
    );

    return (
        <nav className={`navbar navbar-expand-lg navbar-${isDark ? 'dark' : 'light'}`}>
            <a aria-label='Title' className={`navbar-brand ${isDark ? 'text-white' : ''}`}>job-scraper</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul aria-label='Links' className="navbar-nav mr-auto">
                    <li className="nav-item mx-5">
                        <Link className="nav-link" href="/">Home</Link>
                    </li>
                </ul>
                {loading && <ul aria-label='Loading' className="navbar-nav mx-auto justify-content-center">
                    {loader}
                </ul>}
                <ul aria-label='Profile' className="navbar-nav justify-content-end ms-auto">
                    <li className={`nav-item btn-group ${dropdownClass()} mx-5 ${styles.theme_dropdown}`}>
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                            Theme
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <button style={{fontWeight: theme === Theme.Light ? 'bold' : 'normal'}} className="dropdown-item" onClick={() => changeTheme(Theme.Light)}>Light</button>
                            <button style={{fontWeight: theme === Theme.Dark ? 'bold' : 'normal'}} className="dropdown-item" onClick={() => changeTheme(Theme.Dark)}>Dark</button>
                        </div>
                    </li>
                    <li>
                        <Link className="nav-link" href="/login">Logout</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;