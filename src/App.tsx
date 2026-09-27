import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';

import ScrollToTop from './lib/ScrollToTop';
import { supabase } from './lib/supabaseClient';

import Home from './pages/Home';
import Accommodation from './pages/Accommodation';
import RoomDetails from './pages/RoomDetails';

import Tours from './pages/Tours';
import Gallery from './pages/Gallery';
import Inquire from './pages/Inquire';

import Navbar from './components/navbar';
import Footer from './components/footer';
import { useLenis } from './lib/useLenis';


function AppLayout() {
  useLenis();
  const location = useLocation();

  // Hide footer on RoomDetails and BookRoom
  const hideFooter =
    location.pathname.startsWith('/rooms/') ||
    location.pathname.startsWith('/book');

  return (
    <section id="center">
      <ScrollToTop />

      <Navbar />

      <Outlet />

      {!hideFooter && <Footer />}

    </section>
  );
}


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/accommodation",
        element: <Accommodation />,
        loader: async () => {
          const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('is_active', true)
            .order('room_number');
          if (error) throw error;
          return data;
        },
      },
      { path: "/rooms/:roomId", element: <RoomDetails /> },

      { path: "/tours", element: <Tours /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/inquire", element: <Inquire /> },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;