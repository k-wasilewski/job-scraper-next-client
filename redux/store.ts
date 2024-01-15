import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { jobSlice, themeSlice, loadingSlice } from "./slices";
import { createWrapper } from "next-redux-wrapper";

const createToolkitStore = ()  => store;

export const store = configureStore({
    reducer: {
        [themeSlice.name]: themeSlice.reducer,
        [jobSlice.name]: jobSlice.reducer,
        [loadingSlice.name]: loadingSlice.reducer
    }
});

export type JobScraperStore = ReturnType<typeof createToolkitStore>;
export type JobScraperState = ReturnType<JobScraperStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  JobScraperState,
  unknown,
  Action
>;

export const wrapper = createWrapper(createToolkitStore);