import "./Hero.css";
import { FaFire } from "react-icons/fa";
import shoeLogo from "../../assets/image/shoe-image.jpg";


function Hero() {
  
  return (
    <section className="hero">
      <div className="hero-left">

        <div className="badge">
          <FaFire className="fire-icon" />
          <span>NEW ARRIVAL</span>
        </div>

  

        <h1>
          Find Your <br />
          Perfect Pair
        </h1>

        <p>
          Step into comfort and style with our latest collection.
          Discover premium footwear designed for every occasion.
        </p>

        <div className="hero-buttons">
          <button className="shop-btn">Shop Now</button>
          <button className="explore-btn">Explore</button>
        </div>

      </div>

      <div className="hero-right">
        <img src={shoeLogo} alt="Shoe" />
      </div>
    </section>
  );
}

export default Hero;