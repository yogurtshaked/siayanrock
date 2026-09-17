import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import RoomDetails from './pages/RoomDetails';
import BookRoom from './pages/BookRoom';
import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Inquire from './pages/Inquire';

import Navbar from './components/navbar';
import Footer from './components/footer';


function AppLayout() {
  const location = useLocation();

  // Hide footer on RoomDetails and BookRoom
  const hideFooter =
    location.pathname.startsWith('/rooms/') ||
    location.pathname.startsWith('/book');

  return (
    <section id="center">

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/rooms/:roomId" element={<RoomDetails />} />

        <Route path="/book" element={<BookRoom />} />
        <Route path="/book/:roomId" element={<BookRoom />} />

        <Route path="/tours" element={<Tours />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/inquire" element={<Inquire />} />
      </Routes>

      {!hideFooter && <Footer />}

    </section>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
