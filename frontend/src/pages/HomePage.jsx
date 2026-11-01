import { useState, useEffect, useCallback } from 'react';
import InternshipCard from '../components/InternshipCard';
import Loader from '../components/Loader';
import AlertBanner from '../components/AlertBanner';
import { getInternships } from '../services/api';

const HomePage = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');

    const loadInternships = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getInternships(searchTerm, selectedType);
            setInternships(response.data || []);
        } catch (err) {
            console.error('Failed to load internships:', err);
            setError(err.message || 'Unable to connect to the backend server. Ensure the API is running.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedType]);

    useEffect(() => {
        // Debounce search slightly
        const timer = setTimeout(() => {
            loadInternships();
        }, 200);

        return () => clearTimeout(timer);
    }, [loadInternships]);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <span className="hero-pill">🚀 Find Verified Tech Internships</span>
                    <h1 className="hero-title">
                        Kickstart Your Career with <span className="highlight-text">Leading Companies</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore curated student internships across Software Engineering, Web Development,
                        Cloud, AI/ML, and Data Analytics. Apply in seconds.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="search-filter-card">
                        <div className="search-input-group">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by role, company, or tech stack (e.g. React, Node, Python)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    className="clear-search-btn"
                                    onClick={() => setSearchTerm('')}
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="filter-pill-group">
                            {['All', 'Remote', 'Hybrid', 'In-Office'].map((type) => (
                                <button
                                    key={type}
                                    className={`filter-pill ${selectedType === type ? 'active' : ''}`}
                                    onClick={() => setSelectedType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="container main-content">
                {error && (
                    <AlertBanner
                        type="error"
                        message={error}
                        onRetry={loadInternships}
                        onClose={() => setError(null)}
                    />
                )}

                {/* Section Header */}
                <div className="listing-header">
                    <div>
                        <h2 className="section-title">Available Opportunities</h2>
                        <p className="section-subtitle">
                            {loading
                                ? 'Loading verified opportunities...'
                                : `Showing ${internships.length} open internship position${internships.length === 1 ? '' : 's'}`}
                        </p>
                    </div>
                </div>

                {/* Content States */}
                {loading ? (
                    <Loader message="Loading latest internship opportunities..." />
                ) : internships.length === 0 ? (
                    <div className="empty-state-card">
                        <div className="empty-icon">📂</div>
                        <h3>No Internships Found</h3>
                        <p>
                            No opportunities match your filter &quot;{searchTerm || selectedType}&quot;.
                        </p>
                        <button
                            className="btn btn-outline"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedType('All');
                            }}
                        >
                            Reset Search Filters
                        </button>
                    </div>
                ) : (
                    <div className="internships-grid">
                        {internships.map((internship) => (
                            <InternshipCard key={internship._id} internship={internship} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
