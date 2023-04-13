import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
};

export const scoreSlice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 2;
        },
        decrement: (state) => {
            state.value -= 3;
        },
    },
});

export const { increment, decrement } = scoreSlice.actions;

export default scoreSlice.reducer;