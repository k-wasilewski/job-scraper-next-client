import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { JobScraperState } from "./store";

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export interface ThemeState {
    themeState: Theme;
}

const initialState: ThemeState = {
  themeState: Theme.Light
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state: ThemeState, action) => {
      state.themeState = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state: ThemeState, action) => {
      return {
        ...state,
        ...action.payload.theme,
      };
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state: JobScraperState) => state.theme.themeState;

export default themeSlice.reducer;