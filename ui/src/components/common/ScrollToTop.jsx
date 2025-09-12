import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("Pathname changed:", pathname);
    document.documentElement.scrollTop = 0; // Cuộn lên đầu cho HTML
    document.body.scrollTop = 0; // Cuộn lên đầu cho body
  }, [pathname]);

  return null;
};

export default ScrollToTop;