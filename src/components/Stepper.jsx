import React from "react";

export default function Stepper({ steps, current, mobile }) {
  return (
    <div>
      {/* Desktop Stepper */}
      {!mobile && (
        <div className="flex space-x-4 items-center mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center w-full">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${i === current
                    ? "bg-green-600 text-white"
                    : i < current
                    ? "bg-green-200 text-green-700"
                    : "bg-gray-200 text-gray-600"
                  }`}
              >
                {i + 1}
              </div>

              {/* Label */}
              <span
                className={`ml-2 text-sm md:text-base
                  ${i === current ? "text-green-600 font-medium" : "text-gray-500"}`}
              >
                {label}
              </span>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="flex-1 border-t border-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mobile Stepper */}
      {mobile && (
        <div className="w-full mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Step {current + 1}</span>
            <span>{steps.length} Steps</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="h-2 bg-green-600 rounded"
              style={{ width: `${((current + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
