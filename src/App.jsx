import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/others/About';
import Explore from './pages/others/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col content-between min-h-screen">
        <Header />
        <hr />
        <main className='flex-1 text-text'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path='/dashboard' element={<Dashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <hr />
        <footer>
          <Footer />
        </footer>
        
      </div>
    </Router>
  );
}

export default App;
