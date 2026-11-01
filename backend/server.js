const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables reliably from backend/.env and root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
            if (!origin) return callback(null, true);

            // Allow if in development list, matches vercel, or wildcard
            if (
                process.env.CORS_ORIGIN === '*' ||
                !process.env.CORS_ORIGIN ||
                allowedOrigins.includes(origin) ||
                origin.endsWith('.vercel.app') ||
                origin.includes('localhost')
            ) {
                return callback(null, true);
            }

            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
);

// Express JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'Student Internship Portal API',
        environment: process.env.NODE_ENV || 'development',
    });
});

// Root welcome endpoint (only if not serving static frontend)
app.get('/', (req, res, next) => {
    const publicPath = path.join(__dirname, 'public');
    if (fs.existsSync(publicPath)) {
        return next();
    }
    res.status(200).json({
        message: 'Welcome to the Student Internship Portal API',
        version: '1.0.0',
        documentation: {
            getInternships: 'GET /api/internships',
            getInternshipDetails: 'GET /api/internships/:id',
            submitApplication: 'POST /api/applications',
            getApplications: 'GET /api/applications',
            healthCheck: 'GET /api/health',
        },
    });
});

// Mount API Routes
app.use('/api/internships', require('./routes/internshipRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Serve static frontend if compiled into public/ (e.g. in Docker single-container builds)
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
    app.get('*', (req, res, next) => {
        if (req.originalUrl.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(publicPath, 'index.html'));
    });
}

// 404 Route Handler for undefined API routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on this server`,
    });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Application Error:', err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [http://localhost:${PORT}]`);
});
