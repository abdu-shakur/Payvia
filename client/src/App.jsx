import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/others/About';
import Explore from './pages/others/Explore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/others/PrivacyPolicy';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ForgotPassword from './pages/forgotPassword';
import PaystackPaymentForm from './components/PaystackPaymentForm';
import DashboardLayout from './components/DashboardLayout';
import LocalPaymentForm from './components/LocalPaymentForm';
import {LoggedIn, AllowAuthUser, DenyAuthUser} from './utils/LoggedIn';



function App() {
  return (
    <Router>
      <div className="flex flex-col content-between min-h-screen">
        {/* Show Header only for non-dashboard routes */}
        <Routes>
          
          <Route path="/dashboard/*" element={AllowAuthUser(<DashboardLayout/>)}>
            <Route path="" element={<Dashboard />} />
            <Route path="initiateTransaction" element={<PaystackPaymentForm />} />
            <Route path="payviaTransfer" element={<LocalPaymentForm/>}/>
            {/* Add other dashboard-related routes here */}
          </Route>

          <Route path="/" element={<Header />} />
          <Route path="/about" element={<Header />} />
          <Route path="/explore" element={<Header />} />
          <Route path="/login" element={<Header />} />
          <Route path="/signup" element={<Header />} />
          <Route path="/privacy-policy" element={<Header />} />
          <Route path="/forgot-password" element={<Header />} />
        </Routes>
        <main className="flex-1 text-text">
          <Routes>
            <Route path="/" element={DenyAuthUser(<Home />)} />
            <Route path="/about" element={<About />} />
            <Route path="/explore" element={DenyAuthUser(<Explore />)} />
            <Route path="/login" element={DenyAuthUser(<Login/>)} />
            <Route path="/signup" element={DenyAuthUser(<Signup/>)} />
            <Route path="/privacy-policy" element={DenyAuthUser(<PrivacyPolicy />)} />
            <Route path="/forgot-password" element={DenyAuthUser(<ForgotPassword />)} />
            {/* Other routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
