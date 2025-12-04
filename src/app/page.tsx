'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">

      {/* Background Image */}
      <Image
        src="/pic3.jpg"
        alt="Store Background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-10 py-5 bg-blue-900/90">
        <h2 className="text-white text-xl font-bold tracking-wide">
          JRB
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 bg-blue-600 text-white rounded-md
            transition-all duration-300 ease-in-out
            hover:bg-white hover:text-black
            active:scale-95 font-semibold"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 bg-blue-600 text-white rounded-md
            transition-all duration-300 ease-in-out
            hover:bg-white hover:text-black
            active:scale-95 font-semibold"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Center Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-wide drop-shadow-lg mb-6">
          JOHN RENZO BASBAS
        </h1>
        <p className="text-gray-200 text-lg md:text-xl max-w-xl">
          Web Page
        </p>
      </div>

    </div>
  );
}
