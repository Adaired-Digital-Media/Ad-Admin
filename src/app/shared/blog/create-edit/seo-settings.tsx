"use client";
import SEOForm from "@/app/shared/seo-form";

export default function SeoSettings({ className }: { className?: string }) {
  return <SEOForm namespace="seo" className={className} />;
}
