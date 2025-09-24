import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/sections/navbar";
import Announcement from "./components/sections/announcement";
import Hero from "./components/sections/hero";
import Category from "./components/sections/category";
import NewArrivals from "./components/sections/new-arrivals";
import Popular from "./components/sections/popular";
import Footer from "./components/sections/footer";
import { apiCategory } from "../store-admin/categories/api/api-category";

export default function Home() {
  const [getRandomImage, setRandomImage] = useState<((w: number, h: number) => string) | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ✅ pastikan param typed dengan benar
  const { merchantUsername } = useParams<{ merchantUsername: string }>();

  useEffect(() => {
    setRandomImage(() => (width: number, height: number) => {
      const randomSeed = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/seed/${randomSeed}/${width}/${height}`;
    });

    if (merchantUsername) {
      fetchCategories(merchantUsername);
    }
  }, [merchantUsername]);

  const fetchCategories = async (merchant: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiCategory.getCategories(merchant);
      setCategories(response.data.categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!getRandomImage) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Announcement />
      <Navbar />
      <Hero getRandomImage={getRandomImage} />

      {/* Categories Section */}
      <Category categories={categories} isLoading={isLoading} />

      <NewArrivals getRandomImage={getRandomImage} />
      <Popular getRandomImage={getRandomImage} />
      <Footer />
    </div>
  );
}
