import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="navbar-header">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
                    <div className="logo-icon">🎓</div>
                    <div className="logo-text">
                        <span className="logo-title">InternshipHub</span>
                        <span className="logo-subtitle">Student Career Portal</span>
                    </div>
                </Link>

                <button
                    className="mobile-toggle-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                >
                    <span className={`hamburger ${mobileOpen ? 'open' : ''}`}></span>
                </button>

                <nav className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Browse Internships
                    </NavLink>
                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Applications Registry
                    </NavLink>
                    <Link
                        to="/"
                        className="btn btn-primary nav-cta"
                        onClick={() => setMobileOpen(false)}
                    >
                        Find Opportunities
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

