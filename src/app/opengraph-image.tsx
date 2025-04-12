import { ImageResponse } from "next/og";
import { getTotalImagesGenerated } from "~/lib/supbase";
export const alt = process.env.NEXT_PUBLIC_FRAME_NAME || "Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

const totalImagesGenerated = await getTotalImagesGenerated();

// dynamically generated OG image for frame preview
export default async function Image() {
  return totalImagesGenerated > 0 ? new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-[#f8f9fa]">
        <div tw="flex flex-col items-center justify-center p-8 rounded-xl bg-white shadow-sm">
          <p tw="text-[#6b7280] text-3xl uppercase tracking-widest mb-2">Collectibles</p>
          <p tw="text-7xl font-bold text-[#111827]">{totalImagesGenerated}</p>
          <div tw="w-16 h-1 bg-[#6366f1] mt-4 mb-2" />
          <p tw="text-[#4b5563] text-sm">Generated so far</p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  ) : new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-[#000000]">
        <div tw="flex flex-col items-center justify-center p-8 rounded-xl shadow-sm">
          <p tw="text-[#FFFFFF] text-4xl uppercase tracking-widest mb-2">Collectibles</p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
