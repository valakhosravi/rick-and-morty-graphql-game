import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './slices/ScoreSlice';

export default configureStore({
    reducer: {
        score: scoreReducer,
    },
});