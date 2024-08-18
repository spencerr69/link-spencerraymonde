import { Link } from "gatsby";
import { ReactElement, useState, useEffect, useRef, useCallback } from "react";
import * as React from "react";
import "../styles/index.scss";

export const LinkPage: React.FC = () => {
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      const mobileMediaQuery = matchMedia("(max-width: 800px)");

      const listener = () => {
         setIsMobile(mobileMediaQuery.matches);
      };

      mobileMediaQuery.addEventListener("change", listener);

      listener();

      return () => mobileMediaQuery.removeEventListener("change", listener);
   }, []);

   const mainRef = useRef<HTMLDivElement>(null);

   const mouseMoveHandle = useCallback(
      (e: any) => {
         if (!mainRef.current) {
            return;
         }

         if (!isMobile) {
            const size = (Math.max(innerWidth, innerHeight) / 50) * -1;
            const pageX = (e.clientX - window.innerWidth / 2) / size,
               pageY = (e.clientY - window.innerHeight / 2) / size;

            mainRef.current.querySelectorAll(".shit").forEach((element) => {
               const scale = +(
                  element.getAttribute("data-parallax-scale") ?? "1"
               );

               (element as HTMLElement).style.transform = `translateX(${
                  pageX * scale
               }px) translateY(${pageY * scale}px)`;
            });
         }
      },
      [isMobile]
   );

   return (
      <main ref={mainRef}>
         <div
            className="noisyBG"
            style={{
               backgroundColor: "#000",
            }}></div>
         <div
            className="splashBG splashContainer"
            onMouseMove={mouseMoveHandle}>
            <div className="leftList">
               <div className="listContainer shit" data-parallax-scale={0.2}>
                  <div className="titleBar">
                     <h1>Spencer Raymond</h1>
                     <div className="socialLinks">
                        <div className="social">
                           <Link to="/presskit">Press Kit</Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {isMobile ? (
               <></>
            ) : (
               <div className="rightShow">
                  <div>
                     <div className="showContainer">
                        <div className="imageDiv shit" data-parallax-scale={1}>
                           image!
                           <div
                              className="headingDiv shit"
                              data-parallax-scale={2}>
                              <h3 className="showText">title!</h3>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>
   );
};
