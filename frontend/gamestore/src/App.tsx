import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
function App() {
  return (
    <>
      <Router>
       
          <main className="App">
            <Routes>
              {/* Login Route */}

              {/* Register Route */}
              <Route path="/register" element={<Register />} />
              {/* Home Route */}
            </Routes>
          </main>
       
      </Router>
    </>
  );
}

export default App;
