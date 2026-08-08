import React from "react";

function Select(
    {
        label,
        options = [],
        ...props
    },
    ref
) {
    return (
        <div>
            {label && (
                <label className="mb-1 block text-sm text-gray-700">
                    {label}
                </label>
            )}

            <select
                ref={ref}
                {...props}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
            >
                <option value="">
                    Select {label}
                </option>

                {options.map((option, index) => {
                    const isObject =
                        typeof option === "object" &&
                        option !== null;

                    const value = isObject
                        ? option.value
                        : option;

                    const text = isObject
                        ? option.label
                        : option;

                    return (
                        <option
                            key={value ?? index}
                            value={value}
                        >
                            {text}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default React.forwardRef(Select);