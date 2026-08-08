"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 309;
const SCROLL_HEIGHT_MULTIPLIER = 6; // 6x viewport height of scroll runway

function getFrameSrc(index: number): string {
  const padded = String(index).padStart(5, "0");
  return `/frames/frame_${padded}.jpg`;
}

export function ScrollFrameAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const rafIdRef = useRef<number>(0);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[frameIndex];
    if (!canvas || !ctx || !img || !img.complete) return;

    // Cover the canvas — maintain aspect ratio
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const dx = (canvasW - drawW) / 2;
    const dy = (canvasH - drawH) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }, []);

  // Resize canvas to match viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Preload all images
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    // Load in batches for better performance
    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) {
            loaded++;
            setLoadProgress(Math.floor((loaded / TOTAL_FRAMES) * 100));
            if (loaded === TOTAL_FRAMES) {
              setIsLoaded(true);
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = getFrameSrc(index);
        images[index] = img;
      });
    };

    // Load first frame immediately, then batch load the rest
    const loadAll = async () => {
      // Load first frame first for instant display
      await loadImage(0);
      if (cancelled) return;
      imagesRef.current = images;
      drawFrame(0);

      // Load remaining frames in parallel batches
      const batchSize = 20;
      for (let i = 1; i < TOTAL_FRAMES; i += batchSize) {
        if (cancelled) return;
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
        imagesRef.current = images;
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [drawFrame]);

  // Setup GSAP ScrollTrigger + canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Animated frame object for GSAP to tween
    const frameObj = { frame: 0 };

    const tl = gsap.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        pin: false,
      },
      onUpdate: () => {
        const newFrame = Math.round(frameObj.frame);
        if (newFrame !== currentFrameRef.current) {
          currentFrameRef.current = newFrame;
          // Use rAF for smooth rendering
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = requestAnimationFrame(() => {
            drawFrame(newFrame);
          });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [resizeCanvas, drawFrame]);

  return (
    <div
      ref={containerRef}
      className="scroll-frame-container"
      style={{
        height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh`,
        position: "relative",
      }}
    >
      {/* Sticky canvas viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Cinematic vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Bottom gradient fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30vh",
            pointerEvents: "none",
            background:
              "linear-gradient(to top, oklch(0.13 0.015 265) 0%, transparent 100%)",
          }}
        />

        {/* Top subtle gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "15vh",
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, oklch(0.13 0.015 265 / 0.4) 0%, transparent 100%)",
          }}
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "oklch(0.13 0.015 265)",
              zIndex: 20,
              transition: "opacity 0.6s ease-out",
            }}
          >
            {/* Loading bar */}
            <div
              style={{
                width: "200px",
                height: "2px",
                borderRadius: "1px",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${loadProgress}%`,
                  borderRadius: "1px",
                  background:
                    "linear-gradient(90deg, #E10600, #FF8C00, #FFD400)",
                  transition: "width 0.3s ease-out",
                }}
              />
            </div>
            <span
              style={{
                marginTop: "12px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Loading Experience · {loadProgress}%
            </span>
          </div>
        )}

        {/* Scroll indicator at bottom */}
        <div
          className="scroll-hint-indicator"
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.5s",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "24px",
              height: "40px",
              borderRadius: "12px",
              border: "1.5px solid rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px",
            }}
          >
            <div
              style={{
                width: "3px",
                height: "8px",
                borderRadius: "1.5px",
                background: "rgba(255,255,255,0.4)",
                animation: "scrollBounce 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
