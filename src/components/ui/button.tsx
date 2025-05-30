// src/components/ui/button.tsx
import React from "react";

export const Button = ({ children, className = "", ...props }: any) => {
  return (
    <button
      className={`px-4 py-2 rounded-xl text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
