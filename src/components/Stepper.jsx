// src/components/Stepper.jsx
export default function Stepper({ steps, current }) {
  return (
    <div className="flex space-x-4 items-center mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${i === current ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {i + 1}
          </div>
          <span className={`ml-2 ${i === current ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className="flex-1 border-t border-gray-300 mx-4"></div>}
        </div>
      ))}
    </div>
  );
}
