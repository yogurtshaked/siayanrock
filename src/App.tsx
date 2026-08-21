import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import Tours from './pages/Tours';


import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {
  return (
    <BrowserRouter>
      <section id="center">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/tours" element={<Tours />} />

        </Routes>

        <Footer />

      </section>
    </BrowserRouter>
  );
}

export default App;