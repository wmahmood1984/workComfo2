// src/components/Carousel.jsx
import React, { useEffect, useRef } from "react";
import Card from "./Card";

export default function Carousel({ items }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div
        ref={scrollRef}
        className="flex gap-4 transition-all ease-in-out duration-500"
      >
        {items.map((gig) => (
         // <div key={gig.id} className="min-w-[250px] max-w-xs">
            <Card gig={gig} />
         // </div>
        ))}
      </div>
    </div>
  );
}
