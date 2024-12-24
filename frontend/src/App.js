import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from './module/auth/LogIn';
import SignUp from './module/auth/SignUp';
import DashboardFrame from './components/DashboardFrame';
import app from './firebase';
import ForgotPassword from './module/auth/ForgotPassword';

console.log("Firebase App initialized:", app.name);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardFrame />} />
        <Route path="/pwd" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
