const mongoose = require('mongoose');
const Internship = require('../models/Internship');

// Sample initial internships dataset
const sampleInternships = [
    {
        title: 'Full Stack Web Developer Intern',
        company: 'Innovatech Solutions',
        location: 'Remote',
        duration: '3 Months',
        stipend: '₹20,000 / month',
        description:
            'Join our core engineering team to build scalable modern web applications. You will collaborate on both frontend interfaces using React.js and backend microservices using Node.js, Express, and MongoDB.',
        eligibility:
            'B.Tech / B.E. / BCA / MCA students in 3rd or 4th year with knowledge of JavaScript and web development fundamentals.',
        skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
        type: 'Remote',
        deadline: 'December 15, 2026',
    },
    {
        title: 'Frontend React Developer Intern',
        company: 'PixelCraft Digital',
        location: 'Bengaluru, India (Hybrid)',
        duration: '6 Months',
        stipend: '₹25,000 / month',
        description:
            'Design and develop high-performance, accessible, and responsive user interfaces. Work closely with UI/UX designers and translate wireframes into clean, reusable component libraries.',
        eligibility:
            'Undergraduate or graduate students with strong proficiency in HTML5, CSS3, modern JavaScript (ES6+), and React component architecture.',
        skills: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5/CSS3', 'Vite', 'Redux/Context API'],
        type: 'Hybrid',
        deadline: 'December 30, 2026',
    },
    {
        title: 'Backend Node.js & Cloud Intern',
        company: 'CloudScale Systems',
        location: 'Hyderabad, India (In-Office)',
        duration: '4 Months',
        stipend: '₹22,000 / month',
        description:
            'Architect secure RESTful APIs, manage database schemas, optimize queries, and implement authentication systems. Gain hands-on exposure to cloud deployment on AWS and containerization.',
        eligibility:
            'Computer Science / IT students with practical understanding of Node.js event loops, Express routing, and MongoDB or SQL databases.',
        skills: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Docker', 'JWT Authentication'],
        type: 'In-Office',
        deadline: 'January 10, 2027',
    },
    {
        title: 'AI & Machine Learning Research Intern',
        company: 'DataGenix AI Labs',
        location: 'Remote',
        duration: '3 Months',
        stipend: '₹30,000 / month',
        description:
            'Collaborate with research scientists to fine-tune open-source LLMs, build automated data preprocessing pipelines, and implement AI evaluation benchmarks.',
        eligibility:
            'Students with solid coursework in Linear Algebra, Statistics, Python, and Machine Learning frameworks like PyTorch or TensorFlow.',
        skills: ['Python', 'PyTorch', 'Hugging Face', 'Data Analysis', 'NumPy', 'Pandas'],
        type: 'Remote',
        deadline: 'December 25, 2026',
    },
    {
        title: 'Data Analyst & Visualization Intern',
        company: 'Insightful Metrics',
        location: 'Mumbai, India (Hybrid)',
        duration: '3 Months',
        stipend: '₹18,000 / month',
        description:
            'Extract actionable business insights from raw data, develop automated executive dashboards, and communicate findings to cross-functional stakeholders.',
        eligibility:
            'Open to all engineering, mathematics, or business analytics students with strong problem-solving skills and SQL proficiency.',
        skills: ['SQL', 'Python', 'Power BI', 'Excel', 'Data Cleaning', 'Tableau'],
        type: 'Hybrid',
        deadline: 'January 05, 2027',
    },
    {
        title: 'DevOps & Site Reliability Intern',
        company: 'Nexis Cloud Services',
        location: 'Remote',
        duration: '6 Months',
        stipend: '₹28,000 / month',
        description:
            'Automate CI/CD pipelines, monitor production cloud infrastructure, write infrastructure-as-code scripts, and ensure 99.9% uptime for client web applications.',
        eligibility:
            'Enthusiastic students familiar with Linux command line, Git workflows, Docker containers, and basic networking fundamentals.',
        skills: ['Linux', 'Docker', 'GitHub Actions', 'AWS', 'Bash Scripting', 'Kubernetes'],
        type: 'Remote',
        deadline: 'January 15, 2027',
    },
];

/**
 * @desc   Get all internships (with optional keyword search)
 * @route  GET /api/internships
 * @access Public
 */
const getInternships = async (req, res) => {
    try {
        const { search, type } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { company: { $regex: search.trim(), $options: 'i' } },
                { skills: { $regex: search.trim(), $options: 'i' } },
            ];
        }

        if (type && type !== 'All') {
            query.type = type;
        }

        let internships = await Internship.find(query).sort({ createdAt: -1 });

        // Auto-seed if database is empty and no search filters are applied
        if (internships.length === 0 && !search && (!type || type === 'All')) {
            const count = await Internship.countDocuments();
            if (count === 0) {
                console.log('🌱 No internships found in database. Auto-seeding initial sample opportunities...');
                internships = await Internship.insertMany(sampleInternships);
            }
        }

        return res.status(200).json({
            success: true,
            count: internships.length,
            data: internships,
        });
    } catch (error) {
        console.error('Error fetching internships:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching internships',
            error: error.message,
        });
    }
};

/**
 * @desc   Get single internship details by ID
 * @route  GET /api/internships/:id
 * @access Public
 */
const getInternshipById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid internship ID format',
            });
        }

        const internship = await Internship.findById(id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship opportunity not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: internship,
        });
    } catch (error) {
        console.error('Error fetching internship details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching internship details',
            error: error.message,
        });
    }
};

/**
 * @desc   Seed sample internships (manual trigger)
 * @route  POST /api/internships/seed
 * @access Public
 */
const seedInternships = async (req, res) => {
    try {
        await Internship.deleteMany({});
        const created = await Internship.insertMany(sampleInternships);

        return res.status(201).json({
            success: true,
            message: `Successfully seeded ${created.length} internship opportunities`,
            data: created,
        });
    } catch (error) {
        console.error('Error seeding internships:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to seed internships',
            error: error.message,
        });
    }
};

module.exports = {
    getInternships,
    getInternshipById,
    seedInternships,
    sampleInternships,
};

