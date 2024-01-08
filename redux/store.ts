import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { themeReducer } from "./reducers";

const middleware = [
    ...getDefaultMiddleware()
];

const toolkitStore = configureStore({
    reducer: {
        themeReducer
    },
    middleware
});

export default toolkitStore;