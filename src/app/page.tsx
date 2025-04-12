import type { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;
const appName = process.env.NEXT_PUBLIC_FRAME_NAME || "Your Collectible";
const appDescription = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "Generate your collectible!";

// frame preview metadata
const splashImageUrl = `${appUrl}/splash.png`;
const iconUrl = `${appUrl}/icon.png`;

const framePreviewMetadata = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT,
    action: {
      type: "launch_frame",
      name: appName,
      url: appUrl,
      splashImageUrl,
      iconUrl,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
  openGraph: {
    title: appName,
    description: appDescription,
    url: appUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: appDescription,
  },
  other: {
    "fc:frame": JSON.stringify(framePreviewMetadata),
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <App />
    </div>
  );
}
