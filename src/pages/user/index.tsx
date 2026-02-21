import { useRouter } from "next/router";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useState } from "react";

export default function UserHomePage() {
  useAuthGuard();

  const router = useRouter();

  // banner logic
  const banners = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
  ];

  const [indexAktif, setIndexAktif] = useState(0);

  const keSebelumnya = () => {
    setIndexAktif((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const keSelanjutnya = () => {
    setIndexAktif((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#3E3F29]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[calc(100vh-64px)] max-h-175 ">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${banners[indexAktif]}')` }}
        />
        <div className="absolute inset-0 bg-black/55" />

        {/* Tombol Gambar */}
        <button
          onClick={keSebelumnya}
          className="absolute bottom-0 left-4 xl:top-1/2 -translate-y-1/2 z-20 text-white text-4xl md:p-8 lg:p-4 select-none"
        >
          ‹
        </button>
        <button
          onClick={keSelanjutnya}
          className="absolute bottom-0 right-4 xl:top-1/2 -translate-y-1/2 z-20 text-white text-4xl md:p-8 lg:p-4 select-none"
        >
          ›
        </button>

        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 max-w-6xl mx-auto w-full">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-5">
                DISCOVER & ORDER YOUR FAVORITE FOOD
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed text-justify font-amarante mb-8">
                Explore a wide selection of Indonesian cuisine and order your
                favorite dishes easily in one place. Find authentic flavors,
                read reviews, and enjoy a simple food ordering experience.
              </p>
              <button
                onClick={() => router.push("/user/foodlist")}
                className="bg-[#A89276] hover:bg-[#BCA88D] transition px-8 py-3 rounded-full font-semibold text-sm md:text-base"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us dan Sosmed*/}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 ">
          <div className="max-w-3xl">
            <h2 className="text-3xl text-[#F1F0E4] font-bold mb-6">About Us</h2>
            <p className="text-[#F1F0E4] leading-relaxed text-justify">
              Dawn Winery is a food platform designed to help users explore a
              wide variety of Indonesian dishes and easily order their favorite
              meals online. We bring together authentic flavors from across the
              archipelago, complete with detailed information, ratings, and a
              simple ordering experience that connects users with local food
              providers.
            </p>
          </div>

          <div>
            <h2 className="flex text-3xl text-[#F1F0E4] font-bold items-center justify-center mb-6">
              Follow Us
            </h2>
            <div className="flex items-center justify-center gap-6 text-[#F1F0E4]">
              <a href="#" className="text-2xl hover:text-rose-500 transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl hover:text-blue-500 transition">
                <FaFacebookF />
              </a>
              <a href="#" className="text-2xl hover:text-blue-400 transition">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
