import React from 'react'

function Container({ children, className = "" }) {
  return (
    <div className={`w-full h-full max-w-7xl mx-auto py-2.5 px-2 sm:px-4 ${className}`}>
      {children}
    </div>
  )
}

export default Container