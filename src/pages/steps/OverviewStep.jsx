// src/pages/steps/OverviewStep.jsx
import { useState } from "react";
import { Switch, FormControlLabel, Typography } from "@mui/material";
import { useAppKitAccount } from "@reown/appkit/react";
import toast from "react-hot-toast";

const categories = {
  "Graphics & Design": [
    "Logo Design",
    "Brand Style Guides",
    "Business Cards & Stationery",
    "Fonts & Typography",
    "Art Direction",
    "Logo Maker Tool",
    "Illustration",
    "AI Artists",
    "AI Avatar Design",
    "Portraits & Caricatures",
    "Comic Illustration",
    "Cartoon Illustration",
    "Storyboards",
    "Album Cover Design",
    "Pattern Design",
    "Tattoo Design",
    "Miscellaneous",
    "Web & App Design",
    "Website Design",
    "App Design",
    "UX Design",
    "Landing Page Design",
    "Icon Design",
    "Industrial & Product Design",
    "Character Modeling",
    "Game Art",
    "Graphics for Streamers",
    "Print Design",
    "Brochure Design",
    "Flyer Design",
    "Packaging & Label Design",
    "Poster Design",
    "Catalog Design",
    "Menu Design",
    "Book Design",
    "Book Covers",
    "Book Layout Design & Typesetting",
    "Children’s Book Illustration",
    "Comic Book Illustration",
    "Visual Design",
    "Image Editing",
    "AI Image Editing",
    "Presentation Design",
    "Resume Design",
    "Infographic Design",
    "Vector Tracing",
    "Social Media Design",
    "Email Design",
    "Web Banners",
    "Signage Design",
    "Architecture & Interior Design",
    "Landscape Design",
    "Building Engineering",
    "Lighting Design",
    "T‑Shirts & Merchandise",
    "Fashion Design",
    "Jewelry Design",
    "3D Design",
    "3D Architecture",
    "3D Industrial Design",
    "3D Fashion & Garment",
    "3D Printing Characters",
    "3D Landscape",
    "3D Game Art",
    "3D Jewelry Design",
  ],

  "Programming & Tech": [
    "Website Development",
    "Business Websites",
    "E‑Commerce Development",
    "Custom Websites",
    "Landing Pages",
    "Dropshipping Websites",
    "Website Platforms",
    "WordPress",
    "Shopify",
    "Wix",
    "Webflow",
    "Bubble",
    "Website Maintenance",
    "Website Customization",
    "Bug Fixes",
    "Backup & Migration",
    "Speed Optimization",
    "Python",
    "React",
    "React Native",
    "Java",
    "Flutter",
    "AI Development",
    "AI Websites & Software",
    "AI Mobile Apps",
    "AI Integrations",
    "AI Automations & Agents",
    "AI Fine‑Tuning",
    "AI Technology Consulting",
    "Cloud Computing",
    "DevOps Engineering",
    "Cybersecurity",
    "Mobile App Development",
    "Cross‑platform Development",
    "Android App Development",
    "iOS App Development",
    "Chatbot Development",
    "AI Chatbot",
    "Rules‑Based Chatbot",
    "Discord",
    "Telegram",
    "Game Development",
    "Unreal Engine",
    "Unity Developers",
    "Roblox",
    "Fivem",
    "Software Development",
    "Web Applications",
    "Automations & Workflows",
    "APIs & Integrations",
    "Databases",
    "QA & Review",
    "User Testing",
    "Blockchain & Cryptocurrency",
    "Decentralized Apps (dApps)",
    "Cryptocurrencies & Tokens",
    "Electronics Engineering",
    "Support & IT",
    "Machine Learning",
    "Data Tagging & Annotation",
    "Convert Files",
  ],
  "Digital Marketing": [
    "Search Engine Optimization (SEO)",
    "Generative Engine Optimization",
    "Search Engine Marketing (SEM)",
    "Local SEO",
    "E‑Commerce SEO",
    "Video SEO",
    "Social Media Marketing",
    "Paid Social Media",
    "Social Commerce",
    "Influencer Marketing",
    "Community Management",
    "TikTok Shop",
    "Facebook Ads Campaign",
    "Instagram Marketing",
    "Google SEM",
    "Shopify Marketing",
    " Music Promotion",
    "Podcast Marketing",
    "Video Marketing",
    "E‑Commerce Marketing",
    "Email Marketing",
    "Email Automations",
    "Marketing Automation",
    "Guest Posting",
    "Display Advertising",
    "Public Relations",
    "Affiliate Marketing",
    "Text Message Marketing",
    "Crowdfunding",
    "Marketing Strategy",
    "Conversion Rate Optimization (CRO)",
    "Marketing Advice",
    "Marketing Concepts & Ideation",
    "Web Analytics",
    "Analytics & Tracking",
    "Content Strategy",
    "Other",
  ],
  "Video & Animation": [
    "Video Editing",
    "Visual Effects",
    "Video Art",
    "Intro & Outro Videos",
    "Video Templates Editing",
    "Subtitles & Captions",
    "Social & Marketing Videos",
    "Video Ads & Commercials",
    "Social Media Videos",
    "Music Videos",
    "Motion Graphics",
    "Logo Animation",
    "Lottie & Web Animation",
    "Text Animation",
    "Character Animation",
    "Animated GIFs",
    "Animation for Kids",
    "Animation for Streamers",
    "NFT Animation",
    "Filmed Video Production",
    "Explainer Videos",
    "3D Product Animation",
    "E‑Commerce Product Videos",
    "Presenter Videos",
    "Virtual & Streaming Avatars",
    "AI Video Art",
    "AI Music Videos",
    "Agent‑Related Video Services",
  ],
  "Writing & Translation": [
    "Articles & Blog Posts",
    "Content Strategy",
    "Website Content",
    "Scriptwriting",
    "Creative Writing",
    "Podcast Writing",
    "Speechwriting",
    "Research & Summaries",
    "Proofreading & Editing",
    "AI Content Editing",
    "Book & eBook Writing",
    "Book & eBook Editing",
    "Resume Writing",
    "Cover Letters",
    "LinkedIn Profiles",
    "Job Descriptions",
    "Brand Voice & Tone",
    "Business & Marketing Copy",
    "UX Writing",
    "Email Copy",
    "Technical Writing",
    "Custom Writing Prompts",
    "Translation",
    "Transcription",
    "Interpretation",
    "Handwriting",
  ],
  "Music & Audio": [
    "Music Production & Writing",
    "Music Producers",
    "Composers",
    "Singers & Vocalists",
    "Session Musicians",
    "Songwriters",
    "Jingles & Intros",
    "Custom Songs",
    "Audio Engineering & Post Production",
    "Voiceovers",
    "Podcast Production",
    "Audio Editing",
    "Sound Design",
  ],
  Business: [
    "Virtual Assistants",
    "Business Plans",
    "Project Management",
    "Market Research",
    "Presentations",
    "Brand Strategy",
    "Legal Consulting",
    "Financial Consulting",
    "Data Entry",
    "Business Advice",
  ],
  Photography: [
    "Product Photographers",
    "Portrait Photographers",
    "Lifestyle & Fashion Photographers",
    "Real Estate Photographers",
    "Event Photographers",
    "Food Photographers",
    "Scenic Photographers",
    "Photo Preset Creation",
    "Photography Advice",
  ],
  "Personal Growth & Hobbies": [],

  Finance: [],

  "End-to‑End Projects": [],

  "Fiverr Logo Maker": [],
};

export default function OverviewStep({ formData, setFormData, onNext }) {

   const { address} = useAppKitAccount()
  const [tagInput, setTagInput] = useState("");
  const [cryptoEnabled, setCryptoEnabled] = useState(false);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (
      trimmed &&
      formData.tags.length < 5 &&
      !formData.tags.includes(trimmed)
    ) {
      setFormData((f) => ({ ...f, tags: [...f.tags, trimmed] }));
      setTagInput("");
    }
  };

const handleCrypto = () => {
  if(address){
  const newValue = !cryptoEnabled;
  setCryptoEnabled(newValue);
  setFormData((f) => ({ ...f, cryptoEnabled: newValue,sellerAddress: address}));
  }else{
    toast.error("Please connect your wallet first")
  }

};

  const removeTag = (tag) => {
    setFormData((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };



  return (
    <div className="p-4 md:p-6 bg-white rounded shadow space-y-6">
  {/* Title Field */}
  <div>
    <label className="block font-semibold">Gig Title</label>
    <input
      type="text"
      maxLength={80}
      value={formData.title}
      onChange={(e) =>
        setFormData((f) => ({ ...f, title: e.target.value }))
      }
      placeholder="I will build your Web3 landing page"
      className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-300"
      required
    />
    <p className="mt-1 text-sm text-gray-500">
      As your Gig storefront, your title is the most important place to
      include keywords that buyers will use. 0 / 80 max.
    </p>
  </div>

  {/* Crypto Switch */}
  <FormControlLabel
    control={
      <Switch
        checked={cryptoEnabled}
        onChange={handleCrypto}
        color="success"
      />
    }
    label={
      <Typography variant="h6" fontWeight="bold">
        Accept Crypto Payments?
      </Typography>
    }
    labelPlacement="start"
  />

  {/* Category Selection */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block font-semibold">Category</label>
      <select
        value={formData.category}
        onChange={(e) =>
          setFormData((f) => ({
            ...f,
            category: e.target.value,
            subcategory: "",
          }))
        }
        className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-300"
        required
      >
        <option value="">Select a category</option>
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block font-semibold">Subcategory</label>
      <select
        value={formData.subcategory}
        onChange={(e) =>
          setFormData((f) => ({ ...f, subcategory: e.target.value }))
        }
        className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-300"
        required
        disabled={!formData.category}
      >
        <option value="">Select a subcategory</option>
        {formData.category &&
          categories[formData.category].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
      </select>
    </div>
  </div>

  {/* Search Tags */}
  <div>
    <label className="block font-semibold">Search tags</label>
    <p className="text-sm text-gray-500 mb-2">
      Tag your Gig with buzzwords relevant to your service. Up to 5 tags to
      improve discoverability. Use a mix of broad and specific terms.
    </p>

    {/* Tag List */}
    <div className="flex gap-2 flex-wrap mb-2">
      {formData.tags.map((tag) => (
        <span
          key={tag}
          className="bg-green-100 text-green-800 px-2 py-1 rounded inline-flex items-center"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 text-green-600 hover:text-green-800"
          >
            &times;
          </button>
        </span>
      ))}
    </div>

    {/* Tag Input */}
    <div className="flex flex-col sm:flex-row">
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && (e.preventDefault(), addTag())
        }
        placeholder="E.g. web3, landing page"
        className="flex-1 border border-gray-300 rounded-t sm:rounded-l sm:rounded-tr-none px-3 py-2 focus:ring-green-300"
      />
      <button
        type="button"
        onClick={addTag}
        className="bg-green-600 text-white px-4 py-2 rounded-b sm:rounded-r sm:rounded-bl-none hover:bg-green-700"
      >
        Add
      </button>
    </div>
  </div>

  {/* Negative Keywords Placeholder */}
  <div>
    <label className="block font-semibold">
      Negative keywords{" "}
      <span className="text-sm text-gray-500">(Premium)</span>
    </label>
    <p className="text-sm text-gray-500 mb-2">
      Prevent your Gig from matching irrelevant terms. Available for future
      Premium users.
    </p>
    <input
      type="text"
      disabled
      placeholder="Tell me more"
      className="mt-1 w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
    />
  </div>

  {/* Navigation */}
  <div className="flex justify-end md:justify-between">
    <button
      onClick={onNext}
      disabled={
        !formData.title || !formData.category || !formData.subcategory
      }
      className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
    >
      Save & Continue
    </button>
  </div>
</div>

  );
}
