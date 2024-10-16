import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';
export const IoContext = createContext(null)
import config from '../config';
export function SocketContext({children}) {
  
   const socket = io("http://localhost:4000");
  useEffect(() => {
    return () => {
      socket.disconnect(); // Clean up the connection on unmount
    };
  }, [socket]); 
  return ( 

    <IoContext.Provider value={socket}>
      {children}
    </IoContext.Provider>
  )
}

export const  useSocket = ()=>{
  const context = useContext(IoContext)
  if(context === null){
     throw new Error('usecontext error')
  
  }
  return context
}
 