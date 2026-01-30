import React from "react";
import { galleryItems } from "@/data/galleryItems";

const SLIDER_ANIMS = ["anim-4parts", "anim-9parts", "anim-5parts", "anim-3parts"] as const;

const Slider = () => {
  const slides = galleryItems.slice(0, 4);

  return (
    <div className="slider-page">
      <div className="slider">
        {slides.map((item, i) => (
          <input
            key={item.id}
            name="control"
            id={`page${i + 1}`}
            type="radio"
            defaultChecked={i === 0}
          />
        ))}
        {slides.map((item, i) => (
          <div
            key={item.id}
            className={`slider--el slider--el-${i + 1} ${SLIDER_ANIMS[i]}`}
            style={{ "--slide-image": `url(${item.image})` } as React.CSSProperties}
          >
            <div className="slider--el-bg">
              {SLIDER_ANIMS[i] === "anim-4parts" && (
                <>
                  <div className="part top left" />
                  <div className="part top right" />
                  <div className="part bot left" />
                  <div className="part bot right" />
                </>
              )}
              {SLIDER_ANIMS[i] === "anim-9parts" && (
                <>
                  <div className="part left-top" />
                  <div className="part mid-top" />
                  <div className="part right-top" />
                  <div className="part left-mid" />
                  <div className="part mid-mid" />
                  <div className="part right-mid" />
                  <div className="part left-bot" />
                  <div className="part mid-bot" />
                  <div className="part right-bot" />
                </>
              )}
              {SLIDER_ANIMS[i] === "anim-5parts" && (
                <>
                  <div className="part part-1" />
                  <div className="part part-2" />
                  <div className="part part-3" />
                  <div className="part part-4" />
                  <div className="part part-5" />
                </>
              )}
              {SLIDER_ANIMS[i] === "anim-3parts" && (
                <>
                  <div className="part left" />
                  <div className="part mid" />
                  <div className="part right" />
                </>
              )}
            </div>
            <div className="slider--el-content">
              <h2 className="slider--el-heading">{item.name}</h2>
              <p className="slider--el-price">{item.price}</p>
            </div>
          </div>
        ))}
        <div className="slider--control left">
          {slides.map((_, i) => (
            <label key={i} className={`page${i + 1}-left`} htmlFor={`page${i + 1}`} />
          ))}
        </div>
        <div className="slider--control right">
          {slides.map((_, i) => (
            <label key={i} className={`page${i + 1}-right`} htmlFor={`page${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider