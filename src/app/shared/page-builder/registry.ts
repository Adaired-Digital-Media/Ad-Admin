export interface SectionConfig {
  type: string;
  label: string;
  image: string;
  component: string;
}

export const sectionRegistry: SectionConfig[] = [
  {
    type: "featureSection",
    label: "Feature Section",
    image: "",
    component: "feature-section.tsx",
  },
  {
    type: "testimonialSection",
    label: "Testimonial Section",
    image: "",
    component: "testimonial-section.tsx",
  },
  {
    type: "gallerySection",
    label: "Gallery Section",
    image: "",
    component: "gallery-section.tsx",
  },
];