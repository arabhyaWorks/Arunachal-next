import "@/styles/globals.css";
import { useEffect } from 'react';
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;