import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Accommodation from './pages/Accommodation';


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

        </Routes>

        <Footer />

      </section>
    </BrowserRouter>
  );
}

export default App;