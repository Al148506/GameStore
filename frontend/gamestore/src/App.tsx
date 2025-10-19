import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <Router>
        <main className="App">
          <Routes>
            {/* Redirigir la raíz hacia /login */}
            <Route path="/" element={<Navigate to="/login" />} />
            {/* Login Route */}
            <Route path="/login" element={<Login />} />
            {/* Register Route */}
            <Route path="/register" element={<Register />} />
            {/* Home Route */}
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
