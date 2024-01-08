import { createAction } from "@reduxjs/toolkit";
import { SET_THEME } from "./types";

export const setTheme = createAction(SET_THEME, payload => ({payload}));