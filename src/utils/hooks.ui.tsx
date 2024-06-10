import { useState, useRef, useEffect } from "react";

export const useScroll = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<any>(null);
  const checkVisible = () => {
    const offset = ((element) => {
      let offset = 0;
      while (element) {
        offset += element.offsetTop;
        element = element.offsetParent;
      }
      return offset;
    })(ref.current);
    const scrollY = window.scrollY;
    if (offset - scrollY > (window.innerHeight * 3) / 4) return false;
    else return true;
  };
  useEffect(() => {
    setVisible(checkVisible());
    const scrollHandler = (_: Event) => {
      setVisible(checkVisible());
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
  return { visible, element: ref };
};
