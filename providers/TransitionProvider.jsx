
"use client";

import { useRef, useLayoutEffect } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

const BLOCK_SIZE = 60;

export default function TransitionProvider({ children }) {
  const transitionGridRef = useRef(null);
  const blocksRef = useRef([]);

  const createTransitionGrid = () => {
    if (!transitionGridRef.current) return;

    const container = transitionGridRef.current;
    container.innerHTML = "";
    blocksRef.current = [];

    const gridWidth = window.innerWidth;
    const gridHeight = window.innerHeight;
    const columns = Math.ceil(gridWidth / BLOCK_SIZE);
    const rows = Math.ceil(gridHeight / BLOCK_SIZE) + 1;
    const offsetX = (gridWidth - columns * BLOCK_SIZE) / 2;
    const offsetY = (gridHeight - rows * BLOCK_SIZE) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const block = document.createElement("div");
        block.className = "transition-block";
        block.style.cssText = `
          width: ${BLOCK_SIZE}px;
          height: ${BLOCK_SIZE}px;
          left: ${col * BLOCK_SIZE + offsetX}px;
          top: ${row * BLOCK_SIZE + offsetY}px;
        `;
        container.appendChild(block);
        blocksRef.current.push(block);
      }
    }

    gsap.set(blocksRef.current, { opacity: 0 });
  };

  // Build the grid before first paint so transitions always have targets.
  useLayoutEffect(() => {
    createTransitionGrid();
    window.addEventListener("resize", createTransitionGrid);
    return () => window.removeEventListener("resize", createTransitionGrid);
  }, []);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        // Safety: never block the navigation if targets aren't ready.
        if (!blocksRef.current?.length) {
          next();
          return () => {};
        }
        const tween = gsap.to(blocksRef.current, {
          opacity: 1,
          duration: 0.05,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
      enter={(next) => {
        // Safety: never block the navigation if targets aren't ready.
        if (!blocksRef.current?.length) {
          next();
          return () => {};
        }
        gsap.set(blocksRef.current, { opacity: 1 });
        const tween = gsap.to(blocksRef.current, {
          opacity: 0,
          duration: 0.05,
          delay: 0.3,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
    >
      <div ref={transitionGridRef} className="transition-grid" />
      {children}
    </TransitionRouter>
  );
}
