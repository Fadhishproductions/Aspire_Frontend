import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';
export const IoContext = createContext(null)
 export function SocketContext({children}) {
  console.log(import.meta.env)
   const socket = io(import.meta.env.VITE_DOMAIN_SOCKET); 
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
 