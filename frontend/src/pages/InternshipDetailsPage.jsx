import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import AlertBanner from '../components/AlertBanner';
import { getInternshipById } from '../services/api';

const InternshipDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getInternshipById(id);
                setInternship(response.data);
            } catch (err) {
                console.error('Failed to load internship details:', err);
                setError(err.message || 'Unable to retrieve internship details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container details-loading-wrap">
                <Loader message="Fetching detailed internship specifications..." />
            </div>
        );
    }

    if (error || !internship) {
        return (
            <div className="container details-error-wrap">
                <AlertBanner
                    type="error"
                    message={error || 'Internship not found or invalid link.'}
                />
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                    ← Back to All Internships
                </Link>
            </div>
        );
    }

    const {
        title,
        company,
        location,
        duration,
        stipend,
        description,
        eligibility,
        skills = [],
        type,
        deadline,
        createdAt,
    } = internship;

    return (
        <div className="internship-details-page">
            <div className="container details-container">
                {/* Back navigation */}
                <button onClick={() => navigate(-1)} className="back-link-btn">
                    ← Back to Opportunities
                </button>

                {/* Hero Header Card */}
                <div className="details-header-card">
                    <div className="details-header-main">
                        <div className="details-company-avatar">
                            {company ? company.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="details-title-group">
                            <span className="badge-type">{type || 'Remote'}</span>
                            <h1 className="details-role-title">{title}</h1>
                            <h2 className="details-company-subtitle">{company}</h2>
                        </div>
                    </div>

                    <div className="details-cta-block">
                        <div className="details-stipend-badge">
                            <span className="stipend-label">Offered Stipend</span>
                            <span className="stipend-val">{stipend}</span>
                        </div>
                        <Link to={`/apply/${id}`} className="btn btn-primary btn-large apply-cta-btn">
                            Apply for this Position 🚀
                        </Link>
                    </div>
                </div>

                {/* Highlights Bar */}
                <div className="details-meta-bar">
                    <div className="meta-box">
                        <span className="meta-box-icon">📍</span>
                        <div>
                            <span className="meta-box-label">Location</span>
                            <span className="meta-box-val">{location}</span>
                        </div>
                    </div>
                    <div className="meta-box">
                        <span className="meta-box-icon">⏱️</span>
                        <div>
                            <span className="meta-box-label">Duration</span>
                            <span className="meta-box-val">{duration}</span>
                        </div>
                    </div>
                    <div className="meta-box">
                        <span className="meta-box-icon">💼</span>
                        <div>
                            <span className="meta-box-label">Work Mode</span>
                            <span className="meta-box-val">{type || 'Flexible'}</span>
                        </div>
                    </div>
                    <div className="meta-box">
                        <span className="meta-box-icon">📅</span>
                        <div>
                            <span className="meta-box-label">Application Deadline</span>
                            <span className="meta-box-val">{deadline || 'Rolling basis'}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Sections Grid */}
                <div className="details-content-grid">
                    <div className="details-main-column">
                        {/* Role Description */}
                        <section className="detail-section-card">
                            <h3 className="section-heading">About the Internship</h3>
                            <div className="section-body text-paragraphs">
                                {description.split('\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Eligibility Criteria */}
                        <section className="detail-section-card">
                            <h3 className="section-heading">Eligibility Criteria</h3>
                            <div className="section-body">
                                <div className="eligibility-box">
                                    <span className="check-bullet">🎯</span>
                                    <p>{eligibility}</p>
                                </div>
                            </div>
                        </section>

                        {/* Required Skills */}
                        <section className="detail-section-card">
                            <h3 className="section-heading">Required Skills & Technologies</h3>
                            <div className="section-body">
                                <div className="skills-tags-wrap">
                                    {skills && skills.length > 0 ? (
                                        skills.map((skill, index) => (
                                            <span key={index} className="large-skill-pill">
                                                ⚡ {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-muted">No specific technology prerequisites listed.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="details-sidebar-column">
                        <div className="sidebar-card summary-card">
                            <h4 className="sidebar-card-title">Application Summary</h4>
                            <ul className="sidebar-summary-list">
                                <li>
                                    <span>Position:</span>
                                    <strong>{title}</strong>
                                </li>
                                <li>
                                    <span>Organization:</span>
                                    <strong>{company}</strong>
                                </li>
                                <li>
                                    <span>Stipend:</span>
                                    <strong>{stipend}</strong>
                                </li>
                                <li>
                                    <span>Posted:</span>
                                    <strong>{new Date(createdAt).toLocaleDateString()}</strong>
                                </li>
                            </ul>

                            <Link to={`/apply/${id}`} className="btn btn-primary btn-block">
                                Proceed to Application Form
                            </Link>
                        </div>

                        <div className="sidebar-card guidance-card">
                            <h4 className="sidebar-card-title">Application Tips</h4>
                            <ul className="tips-list">
                                <li>Ensure your university Roll Number is entered accurately.</li>
                                <li>Provide an active student email address to receive updates.</li>
                                <li>Double-check all fields before submitting.</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default InternshipDetailsPage;

