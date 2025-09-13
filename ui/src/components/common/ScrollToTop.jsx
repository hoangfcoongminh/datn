import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0; // Cuộn lên đầu cho HTML
    document.body.scrollTop = 0; // Cuộn lên đầu cho body
  }, [pathname]);

  return null;
};

export default ScrollToTop;