
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Discover from "./pages/Discover";
import ContestDetails from "./pages/ContestDetails";
import { SavedProvider } from "./context/SavedContext";
import Saved from "./pages/Saved";


function Dashboard() {
  return <h1 className="text-2xl font-bold">Dashboard</h1>;
}

function Portfolio() {
  return <h1 className="text-2xl font-bold">Portfolio</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <SavedProvider>
        <Navbar />

        <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/contests/:id" element={<ContestDetails />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>
      </SavedProvider>
    </BrowserRouter>
  );
}

export default App;
