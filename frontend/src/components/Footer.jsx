import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="container footer-container">
                <div className="footer-grid">
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <span className="logo-icon">🎓</span>
                            <span className="footer-logo-title">InternshipHub</span>
                        </div>
                        <p className="footer-desc">
                            A dedicated platform empowering students to discover verified internship opportunities,
                            connect with high-growth companies, and kickstart successful careers in tech.
                        </p>
                        <div className="stack-badges">
                            <span className="tech-badge">React.js</span>
                            <span className="tech-badge">Node.js</span>
                            <span className="tech-badge">Express</span>
                            <span className="tech-badge">MongoDB</span>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Quick Navigation</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Explore Internships</Link></li>
                            <li><Link to="/applications">Submitted Applications</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">For Students</h4>
                        <ul className="footer-links">
                            <li>Resume & Skills Guidelines</li>
                            <li>Interview Preparation</li>
                            <li>Application Tracker</li>
                            <li>Frequently Asked Questions</li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Platform Info</h4>
                        <p className="footer-note">
                            Full Stack Web Application developed for academic submission and production demonstration.
                        </p>
                        <div className="system-status">
                            <span className="status-dot"></span>
                            <span>API Systems Operational</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Student Internship Portal. All rights reserved.</p>
                    <p className="footer-credits">Engineered with React + Express + Mongoose</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

