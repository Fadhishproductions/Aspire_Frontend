import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    AdminInfo:localStorage.getItem('AdminInfo')?JSON.parse(localStorage.getItem('AdminInfo')):null
}

const adminAuthSlice = createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
           state.AdminInfo = action.payload;
           localStorage.setItem('AdminInfo',JSON.stringify(action.payload))
        },
        logout:(state,action)=>{
            state.AdminInfo = null;
            localStorage.removeItem('AdminInfo')
        }
    }
})

export const {setCredentials,logout} = adminAuthSlice.actions

export default adminAuthSlice.reducer;