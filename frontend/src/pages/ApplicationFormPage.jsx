import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import AlertBanner from '../components/AlertBanner';
import { getInternshipById, getInternships, submitApplication } from '../services/api';

const ApplicationFormPage = () => {
    const { id: routeInternshipId } = useParams();
    const navigate = useNavigate();

    // Form fields
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [selectedInternshipId, setSelectedInternshipId] = useState(routeInternshipId || '');

    // Internships data for dropdown or auto-population
    const [allInternships, setAllInternships] = useState([]);
    const [currentInternship, setCurrentInternship] = useState(null);
    const [loadingInternship, setLoadingInternship] = useState(true);

    // Submission states
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(null);

    // Fetch internship(s) on mount
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                setLoadingInternship(true);
                setServerError(null);

                if (routeInternshipId) {
                    // Fetch the specific internship
                    const res = await getInternshipById(routeInternshipId);
                    if (isMounted) {
                        setCurrentInternship(res.data);
                        setSelectedInternshipId(res.data._id);
                    }
                } else {
                    // Load all internships for dropdown selection
                    const res = await getInternships();
                    if (isMounted) {
                        const list = res.data || [];
                        setAllInternships(list);
                        if (list.length > 0) {
                            setSelectedInternshipId(list[0]._id);
                            setCurrentInternship(list[0]);
                        }
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching internship details for form:', err);
                    setServerError(err.message || 'Unable to load internship details.');
                }
            } finally {
                if (isMounted) setLoadingInternship(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [routeInternshipId]);

    // Handle change of selected internship dropdown
    const handleInternshipSelectChange = (e) => {
        const selectedId = e.target.value;
        setSelectedInternshipId(selectedId);
        const match = allInternships.find((item) => item._id === selectedId);
        setCurrentInternship(match || null);
        if (errors.internshipId) {
            setErrors((prev) => ({ ...prev, internshipId: null }));
        }
    };

    // Client-side Validation
    const validate = () => {
        const validationErrors = {};
        const trimmedName = studentName.trim();
        const trimmedEmail = email.trim();
        const trimmedRoll = rollNumber.trim();

        if (!trimmedName) {
            validationErrors.studentName = 'Student Name is required';
        } else if (trimmedName.length < 2) {
            validationErrors.studentName = 'Name must be at least 2 characters long';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail) {
            validationErrors.email = 'Email address is required';
        } else if (!emailRegex.test(trimmedEmail)) {
            validationErrors.email = 'Please enter a valid email format (e.g., student@university.edu)';
        }

        if (!trimmedRoll) {
            validationErrors.rollNumber = 'Roll number is required';
        } else if (trimmedRoll.length < 2) {
            validationErrors.rollNumber = 'Please enter a valid roll number';
        }

        if (!selectedInternshipId) {
            validationErrors.internshipId = 'Please select an internship opportunity';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) return;

        setServerError(null);

        // Validate
        if (!validate()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                studentName: studentName.trim(),
                email: email.trim().toLowerCase(),
                rollNumber: rollNumber.trim(),
                internshipId: selectedInternshipId,
            };

            const response = await submitApplication(payload);

            if (response.success) {
                setSubmissionSuccess(response);
            } else {
                setServerError(response.message || 'Failed to submit application');
            }
        } catch (err) {
            console.error('Error submitting application:', err);
            setServerError(err.message || 'An unexpected error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingInternship) {
        return (
            <div className="container form-page-container">
                <Loader message="Preparing application form..." />
            </div>
        );
    }

    // Success View
    if (submissionSuccess) {
        const appData = submissionSuccess.data;
        return (
            <div className="container form-page-container">
                <div className="success-confirmation-card">
                    <div className="success-icon">🎉</div>
                    <h2 className="success-title">Application Submitted Successfully!</h2>
                    <p className="success-subtitle">
                        Your application details have been recorded in MongoDB Atlas. Our evaluation team
                        will review your profile and reach out via email.
                    </p>

                    <div className="submitted-details-box">
                        <div className="detail-row">
                            <span className="detail-label">Application ID:</span>
                            <span className="detail-value code-font">{appData?._id}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Applicant Name:</span>
                            <span className="detail-value">{appData?.studentName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Roll Number:</span>
                            <span className="detail-value">{appData?.rollNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email ID:</span>
                            <span className="detail-value">{appData?.email}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Internship Position:</span>
                            <span className="detail-value font-semibold">
                                {currentInternship?.title || appData?.internshipId?.title || 'Selected Position'}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Company:</span>
                            <span className="detail-value">
                                {currentInternship?.company || appData?.internshipId?.company || 'Verified Partner'}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Submission Timestamp:</span>
                            <span className="detail-value">
                                {new Date(appData?.createdAt || Date.now()).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="success-actions-row">
                        <Link to="/applications" className="btn btn-secondary">
                            View All Submitted Applications
                        </Link>
                        <Link to="/" className="btn btn-primary">
                            Explore More Opportunities
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container form-page-container">
            <button onClick={() => navigate(-1)} className="back-link-btn">
                ← Back
            </button>

            <div className="form-card-wrapper">
                <div className="form-header-box">
                    <span className="form-pill">Official Candidate Submission</span>
                    <h1 className="form-heading">Internship Application Form</h1>
                    <p className="form-subheading">
                        Complete your personal and academic credentials below to apply directly.
                    </p>
                </div>

                {serverError && (
                    <AlertBanner
                        type="error"
                        message={serverError}
                        onClose={() => setServerError(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="portal-form" noValidate>
                    {/* Selected Internship (Auto-populated or Dropdown) */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="selectedInternship">
                            Selected Internship <span className="required-star">*</span>
                        </label>

                        {routeInternshipId && currentInternship ? (
                            <div className="prefilled-internship-card">
                                <div className="prefilled-icon">🏢</div>
                                <div className="prefilled-details">
                                    <h4 className="prefilled-title">{currentInternship.title}</h4>
                                    <p className="prefilled-sub">
                                        {currentInternship.company} • {currentInternship.location} • {currentInternship.stipend}
                                    </p>
                                </div>
                                <span className="prefilled-tag">Auto-Selected</span>
                            </div>
                        ) : (
                            <div>
                                <select
                                    id="selectedInternship"
                                    className={`form-input select-input ${errors.internshipId ? 'input-error' : ''}`}
                                    value={selectedInternshipId}
                                    onChange={handleInternshipSelectChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="">-- Choose an Internship --</option>
                                    {allInternships.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.title} at {item.company} ({item.stipend})
                                        </option>
                                    ))}
                                </select>
                                {errors.internshipId && (
                                    <span className="field-error-msg">{errors.internshipId}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Student Full Name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="studentName">
                            Student Name <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            id="studentName"
                            className={`form-input ${errors.studentName ? 'input-error' : ''}`}
                            placeholder="Enter your full name (e.g. Alex Johnson)"
                            value={studentName}
                            onChange={(e) => {
                                setStudentName(e.target.value);
                                if (errors.studentName) setErrors((prev) => ({ ...prev, studentName: null }));
                            }}
                            disabled={isSubmitting}
                            autoComplete="name"
                        />
                        {errors.studentName && (
                            <span className="field-error-msg">{errors.studentName}</span>
                        )}
                    </div>

                    {/* Email ID */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email ID <span className="required-star">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`form-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                            }}
                            disabled={isSubmitting}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="field-error-msg">{errors.email}</span>
                        )}
                        <span className="field-hint">
                            We will send interview invites and status updates to this email address.
                        </span>
                    </div>

                    {/* Roll Number */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="rollNumber">
                            Roll Number / Student ID <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            id="rollNumber"
                            className={`form-input ${errors.rollNumber ? 'input-error' : ''}`}
                            placeholder="e.g. 21BCE1045 or CS202409"
                            value={rollNumber}
                            onChange={(e) => {
                                setRollNumber(e.target.value);
                                if (errors.rollNumber) setErrors((prev) => ({ ...prev, rollNumber: null }));
                            }}
                            disabled={isSubmitting}
                        />
                        {errors.rollNumber && (
                            <span className="field-error-msg">{errors.rollNumber}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="form-action-group">
                        <button
                            type="submit"
                            className="btn btn-primary btn-block submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="button-spinner-wrap">
                                    <span className="small-spinner"></span>
                                    Submitting Application...
                                </span>
                            ) : (
                                'Submit Application 🚀'
                            )}
                        </button>
                        <p className="privacy-notice">
                            🔒 By submitting, you confirm that the academic details provided are authentic.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationFormPage;

