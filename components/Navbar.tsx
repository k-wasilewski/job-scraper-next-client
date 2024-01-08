import React from "react";
import { setTheme } from "../redux/actions";
import { Theme } from "../redux/reducers";
import { setToLocalStorage } from "../utils/themeService";
import {connect} from "react-redux";

const Navbar = (props) => {
    const {setTheme, theme} = props;

    const changeTheme = (theme: Theme) => {
        if (!theme) return;

        setTheme(theme);
        setToLocalStorage(theme);
    }

    const isDark = theme === Theme.Dark;

    return (
        <nav className={`navbar navbar-expand-lg navbar-${isDark ? 'dark' : 'light'}`}>
            <a className={`navbar-brand ${isDark ? 'text-white' : ''}`} href="#">job-scraper</a>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item mx-5">
                        <a className="nav-link" href="/">Home</a>
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
                    <a className="nav-link" href="login">Logout</a>
                </ul>
            </div>
        </nav>
    );
}

const mapStateToProps = (state) => ({
    theme: state.themeReducer.theme  
});

const mapDispatchToProps = {
    setTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);