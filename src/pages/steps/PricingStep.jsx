// src/pages/steps/PricingStep.jsx
import { useState, useEffect } from 'react';

const tiers = [
  { key: 'basic', label: 'Basic' },
  { key: 'standard', label: 'Standard' },
  { key: 'premium', label: 'Premium' },
];

export default function PricingStep({ formData, setFormData, onBack, onNext }) {
  const [packages, setPackages] = useState(formData.packages);

  useEffect(() => {
    // Initialize packages if empty
    if (!packages || Object.keys(packages).length === 0) {
      const initial = {};
      tiers.forEach(t => {
        initial[t.key] = { price: '', days: '', revisions: '' };
      });
      setPackages(initial);
      setFormData(f => ({ ...f, packages: initial }));
    }
  }, []);

  const updatePkg = (tier, field, value) => {
    const updated = {
      ...packages,
      [tier]: { ...packages[tier], [field]: value }
    };
    setPackages(updated);
    setFormData(f => ({ ...f, packages: updated }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-600">Pricing</h2>
      <p className="text-gray-600">
        Set up to three packages: Basic, Standard, and Premium — each with its own price, delivery time, and number of revisions. 
        {/* :contentReference[oaicite:1]{index=1} */}
      </p>

      {tiers.map(tier => (
        <div key={tier.key} className="p-4 border rounded space-y-4">
          <h3 className="text-lg font-semibold">{tier.label} Package</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Price (USD)</label>
              <input
                type="number" min="1"
                placeholder="e.g. 50"
                value={packages[tier.key]?.price || ''}
                onChange={e => updatePkg(tier.key, 'price', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-300"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Delivery Time (days)</label>
              <input
                type="number" min="1"
                placeholder="e.g. 3"
                value={packages[tier.key]?.days || ''}
                onChange={e => updatePkg(tier.key, 'days', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-300"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Revisions</label>
              <input
                type="number" min="0"
                placeholder="e.g. 2"
                value={packages[tier.key]?.revisions || ''}
                onChange={e => updatePkg(tier.key, 'revisions', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-300"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Next: Description
        </button>
      </div>
    </div>
  );
}
