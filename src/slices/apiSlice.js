import {createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
 
const baseQuery = fetchBaseQuery({baseUrl: import.meta.env.VITE_DOMAIN_SERVER, // Your API base URL
    credentials: 'include',  
    });

export const apiSlice = createApi({
    baseQuery,
    tagTypes:['User','Admin','Instructor'],
    endpoints:(builder)=>({}),
})  