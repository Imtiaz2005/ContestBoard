
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

function Discover() {
  return <h1 className="text-2xl font-bold">Discover Contests</h1>;
}

function Saved() {
  return <h1 className="text-2xl font-bold">Saved Contests</h1>;
}

function Dashboard() {
  return <h1 className="text-2xl font-bold">Dashboard</h1>;
}

function Portfolio() {
  return <h1 className="text-2xl font-bold">Portfolio</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
