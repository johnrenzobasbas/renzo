'use client';

import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import Image from "next/image";

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export default function DashboardHome() {
  const token = getToken();
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.username) {
          setUsername(decoded.username);
        }
      } catch (e) {
        console.error("Token decoding failed:", e);
      }
    }
  }, [token]);

  return (
    <div className="relative min-h-screen">

      {/* Background Image */}
      <Image
        src="/pic1.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">

        {/* Hero Section */}
        <section className="py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Step Into Style
          </h1>
          <p className="text-xl md:text-2xl text-white mb-2 drop-shadow">
            Discover the best collection of stylish, comfortable, and affordable shoes.
          </p>
          <p className="text-lg md:text-xl text-white drop-shadow">
            Perfect for every step you take. Built for comfort. Designed for style.
          </p>
        </section>

        {/* Shoes Gallery */}
        <section className="py-12 px-8">
          <h3 className="text-2xl font-semibold mb-6 text-center text-white drop-shadow">
            Featured Shoes
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {["shoe1.jpg", "shoe2.jpg", "shoe3.jpg", "shoes4.jpg", "shoes5.jpg", "shoes6.jpg"].map((img, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={`/${img}`}
                  alt={`Shoe ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
