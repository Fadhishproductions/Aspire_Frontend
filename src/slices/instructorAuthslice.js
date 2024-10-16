import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    instructorInfo : localStorage.getItem('instructorInfo') ? JSON.parse(localStorage.getItem('instructorInfo')) : null 
}

const instructorAuthslice = createSlice({
    name: "instructorAuth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
             state.instructorInfo = action.payload;
             localStorage.setItem("instructorInfo",JSON.stringify(action.payload))
        },
        logout:(state,action)=>{
            state.instructorInfo = null;
            localStorage.removeItem("instructorInfo")
        }
    }
})

export const {setCredentials,logout} = instructorAuthslice.actions;

export default instructorAuthslice.reducer;