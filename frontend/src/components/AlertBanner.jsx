const AlertBanner = ({ type = 'error', message, onRetry, onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className={`alert-banner ${isSuccess ? 'alert-success' : 'alert-error'}`}>
            <div className="alert-content">
                <span className="alert-icon">{isSuccess ? '✅' : '⚠️'}</span>
                <span className="alert-message">{message}</span>
            </div>
            <div className="alert-actions">
                {onRetry && (
                    <button onClick={onRetry} className="btn-retry">
                        Retry
                    </button>
                )}
                {onClose && (
                    <button onClick={onClose} className="btn-close" aria-label="Dismiss alert">
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default AlertBanner;

