import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './slices/ScoreSlice';
import levelReducer from './slices/LevelSlice';

export default configureStore({
    reducer: {
        score: scoreReducer,
        level: levelReducer
    },
});