import { createReducer } from "@reduxjs/toolkit";
import { setTheme } from "./actions";

export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

const themeState = {
    theme: Theme.Light
};

export const themeReducer = createReducer(themeState, {
    [setTheme]: (state, action) => {
        state.theme = action.payload;
    },
});