import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="container not-found-page">
            <div className="not-found-card">
                <span className="not-found-code">404</span>
                <h1 className="not-found-title">Page Not Found</h1>
                <p className="not-found-text">
                    The requested page could not be found. It may have been moved, deleted, or the URL might be mistyped.
                </p>
                <Link to="/" className="btn btn-primary">
                    ← Return to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;

