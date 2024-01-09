import { Theme } from "../redux/slices";

export const getFromLocalStorage: () => Theme | null = () => {
    return localStorage.getItem('theme') as Theme || null;
}

export const setToLocalStorage: (theme: Theme) => void = (theme: Theme) => {
    localStorage.setItem('theme', theme);
}