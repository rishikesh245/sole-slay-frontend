import './Features.css';

function Features() {
    return (
        <section className="features">
            <h2>Why Choose Sole Slay?</h2>
            <p>Discover the features that make our shoes the perfect choice for every step of your journey.</p>
            <div className="feature-list">
                <div className="feature-card">
                    <h3>Free Delivery</h3>
                    <p>Enjoy fast and free shipping on all orders, no matter the size or destination.</p>
                </div>
                <div className="feature-card">
                    <h3>30-Day Returns</h3>
                    <p>Not satisfied with your purchase? Return it within 30 days for a full refund.</p>
                </div>
                <div className="feature-card">
                    <h3>24/7 Customer Support</h3>
                    <p>Our dedicated support team is always ready to assist you with any questions or concerns.</p>
                </div>
            </div>
        </section>
    );
}

export default Features;