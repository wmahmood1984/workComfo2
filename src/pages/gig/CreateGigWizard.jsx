// src/pages/CreateGigWizard.jsx
import { useState } from "react";
import Stepper from "../../components/Stepper";
import OverviewStep from "../steps/OverviewStep";
import PricingStep from "../steps/PricingStep";
import GigDescriptionStep from "../steps/DescriptionStep";

import { db } from "../../lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import GigRequirementsStep from "../steps/GigRequirementsStep";
import GigGallery from "../steps/GigGallery";
import { useAuth } from "../../hooks/useAuth";

const steps = [
  "Overview",
  "Pricing",
  "Description",
  "Requirements",
  "Gallery",

];

export default function CreateGigWizard() {

  const user = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
  title: "",
  description: "",
  
  userId:"",
  category: "",
  subcategory: "",
  budget: "0",
  deadline: "0",
  tags: [],
  cryptoEnabled:"",
  sellerAddress:"",
   packages: {
    basic: { price: '', days: '', revisions: '' },
    standard: { price: '', days: '', revisions: '' },
    premium: { price: '', days: '', revisions: '' },
  }
});

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "gigs"), {
        ...formData,
        status: "open",
        created_at: Timestamp.now(),
        userId: user.id
        
      });
      toast.success("Gig submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit gig");
    }
  };

  const StepComponent = [
    <OverviewStep formData={formData} setFormData={setFormData} onNext={next} />,
    <PricingStep formData={formData} setFormData={setFormData} onNext={next} onBack={back} />,
    <GigDescriptionStep formData={formData} setFormData={setFormData} onNext={next} onBack={back} />,
<GigRequirementsStep formData={formData} setFormData={setFormData} onNext={next} onBack={back} />, 
   <GigGallery formData={formData} setFormData={setFormData} onNext={next} onBack={back} onSubmit={handleSubmit}/>,
    // <PublishStep formData={formData} onBack={back} onSubmit={handleSubmit} />
  ][step];

  return (
    <div className="w-full">
      {/* Desktop Wrapper */}
      <div className="hidden md:block max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
        <Stepper steps={steps} current={step} />
        <div className="mt-6">{StepComponent}</div>
      </div>

      {/* Mobile Wrapper */}
      <div className="block md:hidden h-screen flex flex-col">
        {/* Mobile Stepper */}
        <div className="bg-white shadow p-2 sticky top-0 z-10">
          <Stepper steps={steps} current={step} mobile />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4">{StepComponent}</div>

        {/* Fixed Bottom Nav (Back / Next) */}
        <div className="bg-white shadow p-3 flex justify-between gap-2 sticky bottom-0">
          {step > 0 && (
            <button
              onClick={back}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600"
            >
              Back
            </button>
          )}
          <button
            onClick={step === steps.length - 1 ? handleSubmit : next}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
          >
            {step === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
