import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import "./hero.css";

// 4 Commercial Promotional Videos in exact requested order
const HERO_VIDEOS = [
  {
    id: 1,
    title: "Product Reveal",
    subtitle: "High-Performance Running Footwear",
    filename: "Footwear_commercial_product_reveal_24105aeb_1080p.mp4",
    src: "/videos/Footwear_commercial_product_reveal_24105aeb_1080p.mp4",
    fallbackSrc: "/videos/video-1.mp4",
    poster: "/videos/poster-1.png",
  },
  {
    id: 2,
    title: "Stone Platform",
    subtitle: "Athletic Silhouette Edition",
    filename: "Sneakers_displayed_on_stone_plat\u2026_d92123d1_1080p.mp4",
    src: "/videos/Sneakers_displayed_on_stone_plat\u2026_d92123d1_1080p.mp4",
    fallbackSrc: "/videos/video-2.mp4",
    poster: "/videos/poster-2.png",
  },
  {
    id: 3,
    title: "Luxury Marble",
    subtitle: "Artisan Leather Streetwear",
    filename: "Luxury_footwear_commercial_concept_bdda442e_1080p.mp4",
    src: "/videos/Luxury_footwear_commercial_concept_bdda442e_1080p.mp4",
    fallbackSrc: "/videos/video-3.mp4",
    poster: "/videos/poster-3.png",
  },
  {
    id: 4,
    title: "Skyline High-Top",
    subtitle: "Metropolitan Collector's Series",
    filename: "Luxury_sneaker_advertisement_daf87bc2_1080p.mp4",
    src: "/videos/Luxury_sneaker_advertisement_daf87bc2_1080p.mp4",
    fallbackSrc: "/videos/video-4.mp4",
    poster: "/videos/poster-4.png",
  },
];

function Hero() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  // When a video finishes, automatically advance to the next sequentially.
  // After the fourth (index 3), restart from the first (index 0) and continue looping.
  const handleVideoEnded = (index) => {
    if (index === currentIndex) {
      const nextIndex = (currentIndex + 1) % HERO_VIDEOS.length;
      setCurrentIndex(nextIndex);
    }
  };

  // Manage playback whenever currentIndex changes
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];

    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.muted = true;

      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay notice:", err);
        });
      }
    }

    // Pause inactive videos after crossfade to conserve resources
    const timer = setTimeout(() => {
      videoRefs.current.forEach((vid, idx) => {
        if (idx !== currentIndex && vid && !vid.paused) {
          vid.pause();
        }
      });
    }, 700);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Smooth scroll to explore
  const handleExplore = () => {
    const target =
      document.querySelector(".products-container") ||
      document.querySelector(".categories");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      {/* 1. Full-Bleed Background Video Layer */}
      <div className="hero-video-bg">
        {HERO_VIDEOS.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <video
              key={item.id}
              ref={(el) => (videoRefs.current[index] = el)}
              poster={item.poster}
              autoPlay={index === 0}
              muted
              playsInline
              preload={
                index === currentIndex
                  ? "auto"
                  : index === (currentIndex + 1) % HERO_VIDEOS.length
                  ? "metadata"
                  : "none"
              }
              onEnded={() => handleVideoEnded(index)}
              onError={(e) => {
                // Seamless fallback if unicode path requires alternate URI
                if (e.currentTarget.currentSrc !== item.fallbackSrc) {
                  e.currentTarget.src = item.fallbackSrc;
                  if (isActive) e.currentTarget.play();
                }
              }}
              className={`hero-video-player ${isActive ? "active" : "inactive"}`}
            >
              <source src={item.src} type="video/mp4" />
              <source src={item.fallbackSrc} type="video/mp4" />
            </video>
          );
        })}
      </div>

      {/* 2. Cinematic Gradient Vignette Overlay (Ensures perfect text readability) */}
      <div className="hero-video-overlay" />

      {/* 3. Hero Content with Staggered Entrance & Reveal Animations */}
      <div className="hero-content">
        <div className="hero-left">
          {/* Animated Badge */}
          <div className="badge hero-anim-badge">
            <FaFire className="fire-icon" />
            <span>NEW ARRIVAL</span>
          </div>

          {/* Masked Line-by-Line Title Reveal */}
          <h1 className="hero-title">
            <span className="hero-title-line line-1">
              <span className="line-inner">Find Your</span>
            </span>
            <span className="hero-title-line line-2">
              <span className="line-inner highlight-text">Perfect Pair</span>
            </span>
          </h1>

          {/* Animated Description Paragraph */}
          <p className="hero-description hero-anim-desc">
            Step into comfort and style with our latest collection.
            Discover premium footwear designed for every occasion.
          </p>

          {/* Animated Call-to-Action Buttons */}
          <div className="hero-buttons hero-anim-buttons">
            <button className="shop-btn" onClick={() => navigate("/shop")}>
              Shop Now
            </button>
            <button className="explore-btn" onClick={handleExplore}>
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
