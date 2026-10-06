import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';

import ScrollToTop from './lib/ScrollToTop';
import { supabase } from './lib/supabaseClient';


import Home from './pages/home/Home';
import Accommodation from './pages/accommodation/Accommodation';


import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
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

      { path: "/tours", lazy: async () => ({ Component: (await import("./pages/tours/Tours")).default }) },
      { path: "/gallery", lazy: async () => ({ Component: (await import("./pages/gallery/Gallery")).default }) },
      { path: "/inquire", lazy: async () => ({ Component: (await import("./pages/inquire/Inquire")).default }) },
      { path: "/about", lazy: async () => ({ Component: (await import("./pages/AboutUs")).default }) },
      { path: "/rooms/:roomId", lazy: async () => ({ Component: (await import("./pages/accommodation/RoomDetails")).default }) },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;