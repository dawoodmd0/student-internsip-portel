import { Link } from 'react-router-dom';

const InternshipCard = ({ internship }) => {
    const {
        _id,
        title,
        company,
        location,
        duration,
        stipend,
        description,
        skills = [],
        type = 'Remote',
        deadline,
    } = internship;

    // Truncate long descriptions cleanly
    const truncatedDesc =
        description.length > 140
            ? description.substring(0, 140).trim() + '...'
            : description;

    const getTypeBadgeClass = (locType) => {
        switch (locType?.toLowerCase()) {
            case 'remote':
                return 'badge-type-remote';
            case 'hybrid':
                return 'badge-type-hybrid';
            case 'in-office':
                return 'badge-type-office';
            default:
                return 'badge-type-default';
        }
    };

    return (
        <article className="internship-card">
            <div className="card-top">
                <div className="company-info">
                    <div className="company-avatar">
                        {company ? company.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                        <h4 className="company-name">{company}</h4>
                        <span className={`badge-type ${getTypeBadgeClass(type)}`}>
                            {type}
                        </span>
                    </div>
                </div>
                <span className="card-stipend">{stipend}</span>
            </div>

            <h3 className="card-title">
                <Link to={`/internships/${_id}`}>{title}</Link>
            </h3>

            <p className="card-description">{truncatedDesc}</p>

            <div className="card-meta-grid">
                <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span className="meta-text">{location}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span className="meta-text">{duration}</span>
                </div>
                {deadline && (
                    <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">Deadline: {deadline}</span>
                    </div>
                )}
            </div>

            {skills && skills.length > 0 && (
                <div className="card-skills-row">
                    {skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="skill-pill">
                            {skill}
                        </span>
                    ))}
                    {skills.length > 4 && (
                        <span className="skill-pill more-skills">
                            +{skills.length - 4} more
                        </span>
                    )}
                </div>
            )}

            <div className="card-actions">
                <Link to={`/internships/${_id}`} className="btn btn-outline card-btn">
                    View Details
                </Link>
                <Link to={`/apply/${_id}`} className="btn btn-primary card-btn">
                    Apply Now
                </Link>
            </div>
        </article>
    );
};

export default InternshipCard;

