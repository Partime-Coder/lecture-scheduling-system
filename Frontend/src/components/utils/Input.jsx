import React, { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    placeholder = "Enter here...",
    id: customId,
    className = "",
    rounded = "rounded-md",
    disabled = false,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full
          border
          border-gray-300
          bg-white
          px-4
          py-2.5
          text-gray-900
          placeholder:text-gray-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
          focus:outline-none
          transition-all
          duration-200
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500
          ${rounded}
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

export default Input;