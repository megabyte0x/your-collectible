"use client";

import dynamic from "next/dynamic";

// Dynamic import for form component
const FormPreview = dynamic(() => import("../components/FormPreview"), {
  ssr: false,
});

export default function App() {
  return <FormPreview />;
}
