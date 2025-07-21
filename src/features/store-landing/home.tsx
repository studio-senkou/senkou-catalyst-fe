import { useEffect, useState } from "react";

import Navbar from "./components/sections/navbar";
import Announcement from "./components/sections/announcement";
import Hero from "./components/sections/hero";
import Category from "./components/sections/category";
import NewArrivals from "./components/sections/new-arrivals";
import Popular from "./components/sections/popular";
import Footer from "./components/sections/footer";

export default function Home() {
  const [getRandomImage, setRandomImage] = useState<((w: number, h: number) => string) | null>(
    null,
  );

  useEffect(() => {
    setRandomImage(() => (width: number, height: number) => {
      const randomSeed = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/seed/${randomSeed}/${width}/${height}`;
    });
  }, []);

  if (!getRandomImage) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Announcement Bar*/}
      <Announcement />

      {/*Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero getRandomImage={getRandomImage} />

      {/* Categories Section */}
      <Category getRandomImage={getRandomImage} />

      {/* New Arrivals Section */}
      <NewArrivals getRandomImage={getRandomImage} />

      {/* Popular Products */}
      <Popular getRandomImage={getRandomImage} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
