// src/components/ui/input.jsx
import React from 'react';

export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-md ${className}`}
      ref={ref}
      {...props}
    />
  );
});
