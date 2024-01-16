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

const initialThemeState: ThemeState = {
  themeState: Theme.Light
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState: initialThemeState,
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

export interface JobState {
  newJobLink: string;
}

const initialJobState: JobState = {
  newJobLink: ''
}

export const jobSlice = createSlice({
  name: 'job',
  initialState: initialJobState,
  reducers: {
    setJob: (state: JobState, action) => {
      state.newJobLink = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state: JobState, action) => {
      return {
        ...state,
        ...action.payload.theme,
      };
    },
  },
});

export const { setJob } = jobSlice.actions;

export const selectJob = (state: JobScraperState) => state.job.newJobLink;

export interface LoadingState {
  loading: boolean;
}

const initialLoadingState: LoadingState = {
  loading: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: initialLoadingState,
  reducers: {
    setLoading: (state: LoadingState, action) => {
      state.loading = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state: LoadingState, action) => {
      return {
        ...state,
        ...action.payload.loading,
      };
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export const isLoading = (state: JobScraperState) => state.loading.loading;