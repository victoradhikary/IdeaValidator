import Image from "next/image";
import StartupIdeaValidator from "@/components/idea";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr] bg-white items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <StartupIdeaValidator />
    </div>
  );
}
