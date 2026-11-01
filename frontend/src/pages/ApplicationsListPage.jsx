import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import AlertBanner from '../components/AlertBanner';
import { getApplications } from '../services/api';

const ApplicationsListPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchApps = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getApplications();
            setApplications(response.data || []);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
            setError(err.message || 'Unable to retrieve applications from database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    // Filter by student name, roll number, or internship title
    const filteredApps = applications.filter((app) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;

        const nameMatch = app.studentName?.toLowerCase().includes(query);
        const rollMatch = app.rollNumber?.toLowerCase().includes(query);
        const emailMatch = app.email?.toLowerCase().includes(query);
        const titleMatch = app.internshipId?.title?.toLowerCase().includes(query);
        const companyMatch = app.internshipId?.company?.toLowerCase().includes(query);

        return nameMatch || rollMatch || emailMatch || titleMatch || companyMatch;
    });

    return (
        <div className="container applications-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-main-heading">Student Applications Registry</h1>
                    <p className="page-subheading">
                        All student submissions stored in MongoDB Mongoose database
                    </p>
                </div>
                <Link to="/" className="btn btn-primary">
                    + Apply for Another Internship
                </Link>
            </div>

            {error && (
                <AlertBanner
                    type="error"
                    message={error}
                    onRetry={fetchApps}
                    onClose={() => setError(null)}
                />
            )}

            {/* Filter Search */}
            <div className="apps-search-wrap">
                <input
                    type="text"
                    placeholder="Search by student name, roll number, email, or company..."
                    className="form-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader message="Fetching submitted applications from MongoDB..." />
            ) : applications.length === 0 ? (
                <div className="empty-state-card">
                    <div className="empty-icon">📝</div>
                    <h3>No Applications Submitted Yet</h3>
                    <p>Be the first student to apply for an exciting internship opportunity!</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Browse Open Roles
                    </Link>
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="empty-state-card">
                    <div className="empty-icon">🔍</div>
                    <h3>No Matching Applications</h3>
                    <p>No results match &quot;{searchTerm}&quot;. Try a different student name or roll number.</p>
                    <button className="btn btn-outline" onClick={() => setSearchTerm('')}>
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="applications-table-card">
                    <div className="table-responsive">
                        <table className="portal-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Roll Number</th>
                                    <th>Email ID</th>
                                    <th>Internship Title</th>
                                    <th>Company</th>
                                    <th>Submitted Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map((app, index) => (
                                    <tr key={app._id}>
                                        <td className="text-muted">{index + 1}</td>
                                        <td className="font-semibold">{app.studentName}</td>
                                        <td>
                                            <span className="badge-roll">{app.rollNumber}</span>
                                        </td>
                                        <td>
                                            <a href={`mailto:${app.email}`} className="table-link">
                                                {app.email}
                                            </a>
                                        </td>
                                        <td className="font-semibold text-primary">
                                            {app.internshipId ? (
                                                <Link to={`/internships/${app.internshipId._id}`}>
                                                    {app.internshipId.title}
                                                </Link>
                                            ) : (
                                                <span className="text-muted">Opportunity Archived</span>
                                            )}
                                        </td>
                                        <td>{app.internshipId?.company || 'N/A'}</td>
                                        <td className="text-muted font-sm">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className="badge-status status-submitted">
                                                Received
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsListPage;

