import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
function PageLoadWrap({ children }) {
  const { loading } = useAuth();
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    // Show loader for at least 1 second for better UX
    const minLoadTime = setTimeout(() => {
      if (!loading) {
        setShowLoader(false);
      }
    }, 700);

    return () => clearTimeout(minLoadTime);
  }, [loading]);

  useGSAP(
    () => {
      if (!showLoader && !isAnimationDone) {
        const tl = gsap.timeline({
          onComplete: () => setIsAnimationDone(true),
        });

        tl.to(".loader-orb", {
          scale: 15,
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
        })
          .set(".page-content", { visibility: "visible" })
          .to(
            ".page-content",
            {
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.5,
            },
            "-=0.4",
          );
      }
    },
    { scope: containerRef, dependencies: [showLoader] },
  );

  return (
    <div
      ref={containerRef}
      className="position-relative vh-100 bg-dark overflow-hidden"
    >
      {!isAnimationDone && (
        <div className="loader-wrapper position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark">
          <div className="loader-orb bg-primary rounded-circle" style={{ width: 50, height: 50 }}></div>
        </div>
      )}
      <div className="page-content h-100">{children}</div>
    </div>
  );
}

export default PageLoadWrap;
