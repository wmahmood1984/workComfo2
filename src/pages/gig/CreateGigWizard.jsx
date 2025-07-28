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
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <Stepper steps={steps} current={step} />
      {StepComponent}
    </div>
  );
}
