import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import RoomDetails from './pages/RoomDetails';
import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Inquire from './pages/Inquire';


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
          <Route path="/rooms/:roomId" element={<RoomDetails />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/inquire" element={<Inquire />} />

        </Routes>

        <Footer />

      </section>
    </BrowserRouter>
  );
}

export default App;