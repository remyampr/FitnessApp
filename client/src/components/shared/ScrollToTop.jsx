import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation(); // Get the current URL's pathname.

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll the window to the top-left corner.
  }, [pathname]); // Run this effect every time the pathname changes.

  return null; // This component does not render anything in the UI.
};


