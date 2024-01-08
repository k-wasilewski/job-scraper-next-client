import { createReducer } from "@reduxjs/toolkit";
import { SET_THEME } from "./types";

export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

const themeState = {
    theme: Theme.Light
};

export const themeReducer = createReducer(themeState, {
    SET_THEME: (state, action) => {
        state.theme = action.payload;
    },
});