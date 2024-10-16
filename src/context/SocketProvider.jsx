import {SocketContext} from "./SocketContext.jsx";
import React from 'react'

function SocketProvider({children}) {
  return (
     <SocketContext>
        {children}
     </SocketContext>
  )
}

export default SocketProvider
