import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`w-[180px] h-[50px] rounded-[25px] 
        font-bold text-[14px] tracking-[1.15px] 
        bg-[#4b70e2] text-[#f9f9f9] 
        border-none outline-none 
        transition-all duration-300  
        disabled:opacity-60 disabled:pointer-events-none 
        ${className}`}
      {...props}>
      {children}
    </button>
  );
};
