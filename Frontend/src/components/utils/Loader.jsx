import React from 'react'

 function Loader({ size = 'md', color = 'border-t-amber-500' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`rounded-full border-gray-200 animate-spin ${sizes[size]} ${color}`}
    />
  );
}

export default Loader