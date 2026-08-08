import React from "react";

function Button({
    children,
    type = "button",
    rounded = "rounded-md",
    bgColor = "bg-blue-600",
    hoverBgColor = "hover:bg-blue-700",
    textColor = "text-white",
    className = "",
    disabled = false,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`
                inline-flex
                items-center
                justify-center
                px-4
                py-2
                font-medium
                transition-all
                duration-200
                focus:outline-none
                disabled:opacity-50
                cursor-pointer
                ${bgColor}
                ${hoverBgColor}
                ${textColor}
                ${rounded}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;