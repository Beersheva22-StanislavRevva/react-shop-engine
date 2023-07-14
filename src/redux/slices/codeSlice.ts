import { createSlice } from "@reduxjs/toolkit";
import CodeType from "../../model/CodeType";
import CodePayload from "../../model/CodePayload";

const initialState: { codeMessage: CodePayload } = {
    codeMessage: {code:CodeType.OK, message: ''}
}

const codeSlice = createSlice({
    initialState,
    name: 'codeState',
    reducers: {
        set: (state, data) => {
            state.codeMessage = data.payload;
            
        },
        reset: (state) => {
            state.codeMessage = initialState.codeMessage;
        }
    }
})

export const codeActions = codeSlice.actions
export const codeReducer = codeSlice.reducer