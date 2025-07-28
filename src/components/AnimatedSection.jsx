// src/components/AnimatedSection.jsx
import { motion } from "framer-motion";

export default function AnimatedSection({ children, animation = "fade", delay = 0.2, duration = 1 }) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { delay, duration } },
    },
    slideLeft: {
      hidden: { x: -100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { delay, duration } },
    },
    slideRight: {
      hidden: { x: 100, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { delay, duration } },
    },
    slideUp: {
      hidden: { y: 100, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { delay, duration } },
    },
    zoomIn: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { delay, duration } },
    },
  };

  const selectedVariant = variants[animation] || variants.fade;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={selectedVariant}
    >
      {children}
    </motion.div>
  );
}
