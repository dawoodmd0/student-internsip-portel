import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InternshipDetailsPage from './pages/InternshipDetailsPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationsListPage from './pages/ApplicationsListPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-layout">
                <Navbar />
                <div className="app-main">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/internships/:id" element={<InternshipDetailsPage />} />
                        <Route path="/apply/:id" element={<ApplicationFormPage />} />
                        <Route path="/apply" element={<ApplicationFormPage />} />
                        <Route path="/applications" element={<ApplicationsListPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

