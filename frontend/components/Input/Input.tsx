import React, { forwardRef } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", placeholder, children, className = "", ...props }, ref) => {
    const passwordType = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const actualType = passwordType && showPassword ? "text" : type;
    return (
      <div className="flex flex-col">
        {label && <label className="text-[#c8c8d8] text-[13px] mb-1">{label}</label>}

        <div
          className={`
    relative flex items-center
    w-[350px] h-[40px]
    bg-[var(--bg-color)]
    rounded-[8px]
    transition-all duration-200
    shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]
    hover:shadow-[inset_3px_3px_5px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]
    focus-within:shadow-[inset_4px_4px_6px_var(--shadow-dark),inset_-3px_-3px_5px_var(--shadow-light)]
  `}>
          {children && (
            <span className="flex items-center justify-center h-[24px] pl-3 text-[#5a5a72] text-base translate-y-[-2px]">
              {children}
            </span>
          )}

          <input
            autoComplete="off"
            ref={ref}
            type={actualType}
            placeholder={placeholder}
            className={`
              relative
      flex-1 h-[24px]
      pr-3
      text-[13px] tracking-[0.15px]
      bg-transparent
      text-[#c8c8d8]
      outline-none border-none
      rounded-[8px]
      placeholder:text-[#5a5a72]
      ${children ? "pl-1" : "pl-3"}
      leading-none
    `}
            {...props}
          />
          {passwordType && (
            <span
              className="absolute right-0 top-1/2 translate-y-[-50%] h-[24px] pr-3 text-[#5a5a72] text-base cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          )}
        </div>
      </div>
    );
  },
);


