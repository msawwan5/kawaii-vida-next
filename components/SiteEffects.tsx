"use client";

import { useEffect, useRef, useState } from "react";

export function SiteEffects() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [petals, setPetals] = useState<
    Array<{
      petal: string;
      key: string;
      left: string;
      size: string;
      duration: string;
      delay: string;
    }>
  >([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };

    const hoverables = Array.from(
      document.querySelectorAll("a,button,.activity-card,.shop-card,.event-card,.deco-item,.snack-row")
    );
    const addHover = () => cursor.classList.add("hovered");
    const removeHover = () => cursor.classList.remove("hovered");

    document.addEventListener("mousemove", onMove);
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 0.08}s`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPetals(
      ["🌸", "✿", "🌺", "💮", "✨", "💫", "🎀", "💖"].flatMap((petal) =>
        Array.from({ length: 3 }, (_, index) => ({
          petal,
          key: `${petal}-${index}`,
          left: `${Math.random() * 100}vw`,
          size: `${0.55 + Math.random() * 0.85}rem`,
          duration: `${7 + Math.random() * 11}s`,
          delay: `${-Math.random() * 14}s`,
        }))
      )
    );
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div className="petals" aria-hidden="true">
        {petals.map((item) => (
          <span
            className="petal"
            key={item.key}
            style={{
              left: item.left,
              fontSize: item.size,
              animationDuration: item.duration,
              animationDelay: item.delay,
            }}
          >
            {item.petal}
          </span>
        ))}
      </div>
    </>
  );
}

export function DecoCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const canvasW = 380;
    const canvasH = 620;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;

    const rows = [
      { name: "Sakura", col: "#ff9cc8", hi: "#fff0f8", sh: "#e8449a" },
      { name: "Lavender", col: "#c9a8e0", hi: "#f3eaff", sh: "#8e62be" },
      { name: "Vanilla", col: "#ffe0a6", hi: "#fff7de", sh: "#f0874a" },
      { name: "Mint", col: "#aee8cf", hi: "#e0fff2", sh: "#4aad8a" },
      { name: "Blueberry", col: "#b9ccff", hi: "#eaf0ff", sh: "#4a80e8" },
    ];
    type CharmKind = "bunny" | "kitty" | "puppy" | "bear" | "bow" | "berry" | "cloud" | "heart" | "star" | "pudding";
    const charms = [
      { kind: "bunny" as CharmKind, color: "#f7b5d7", name: "Bunny" },
      { kind: "kitty" as CharmKind, color: "#ffd3e8", name: "Kitty" },
      { kind: "puppy" as CharmKind, color: "#b8d6ff", name: "Pup" },
      { kind: "bear" as CharmKind, color: "#e9c3a6", name: "Bear" },
      { kind: "bow" as CharmKind, color: "#f49ac2", name: "Bow" },
      { kind: "berry" as CharmKind, color: "#ff8fb2", name: "Berry" },
      { kind: "cloud" as CharmKind, color: "#bde7ff", name: "Cloud" },
      { kind: "heart" as CharmKind, color: "#ff8fc1", name: "Heart" },
      { kind: "star" as CharmKind, color: "#ffe08a", name: "Star" },
      { kind: "pudding" as CharmKind, color: "#ffd695", name: "Pudding" },
    ] satisfies Array<{ kind: CharmKind; color: string; name: string }>;
    const bagTray = rows.map((row, index) => ({ ...row, x: 54 + index * 64, y: 490 }));
    const charmTray = charms.map((charm, index) => ({
      ...charm,
      x: 324 + (index % 2) * 32,
      y: 88 + Math.floor(index / 2) * 44,
    }));
    const restartButton = { x: 258, y: 416, w: 76, h: 28 };
    const px = 105;
    const py = 35;
    const pw = 170;
    const ph = 310;
    const pr = 22;
    const thick = 18;
    const rowSpacing = (ph - 50) / rows.length;
    const rowY = (i: number) => py + 28 + i * rowSpacing + rowSpacing / 2;
    const rowDir = (i: number) => (i % 2 === 0 ? 1 : -1);
    const progress = new Array(rows.length).fill(0);
    const sparkles: Array<{ x: number; y: number; life: number; size: number }> = [];
    const hearts: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];
    const userStrokes: Array<{ x: number; y: number; color: string; hi: string; sh: string; size: number; strokeId: number }> = [];
    const placedCharms: Array<{ x: number; y: number; kind: CharmKind; color: string; size: number; rot: number }> = [];
    const pointer = {
      active: false,
      mode: "none" as "none" | "bag" | "charm",
      hoveringTool: false,
      hoveringCharm: false,
      hoverCharmIndex: -1,
      bagX: px + pw - 8,
      bagY: rowY(0),
      dir: 1,
      lastPaintX: 0,
      lastPaintY: 0,
      colorIndex: 0,
      idleFrames: 0,
      hasInteracted: false,
      bagSelected: false,
      charmIndex: 0,
      charmX: 0,
      charmY: 0,
    };
    let current = 0;
    let activeStrokeId = 0;
    let phase: "piping" | "celebrate" | "reset" = "piping";
    let resetWait = 0;
    let frame = 0;
    let raf = 0;
    let isVisible = true;
    let pageVisible = document.visibilityState === "visible";

    const rrect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const addSparkle = (x: number, y: number) => sparkles.push({ x, y, life: 1, size: 4 + Math.random() * 5 });
    const addHeart = (x: number, y: number) =>
      hearts.push({ x, y, vx: Math.random() - 0.5, vy: -1.5 - Math.random() * 0.8, life: 1, size: 7 + Math.random() * 6 });

    const drawBackground = () => {
      ctx.fillStyle = "#fff4f9";
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = "#f9a0c8";
      ctx.beginPath();
      ctx.arc(190, 225, 190, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.07;
      ctx.fillStyle = "#e8449a";
      for (let x = 0; x < canvasW; x += 28) {
        for (let y = 0; y < canvasH; y += 28) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawPhone = () => {
      ctx.save();
      ctx.shadowColor = "rgba(232,68,154,0.18)";
      ctx.shadowBlur = 26;
      ctx.shadowOffsetY = 8;
      rrect(px, py, pw, ph, pr);
      ctx.fillStyle = "#fff0f6";
      ctx.fill();
      ctx.restore();
      rrect(px, py, pw, ph, pr);
      ctx.fillStyle = "#fff0f6";
      ctx.fill();
      ctx.strokeStyle = "#f2a7bf";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = "#f2a7bf";
      rrect(px - 5, py + 72, 5, 22, 2.5);
      ctx.fill();
      rrect(px + pw, py + 60, 5, 18, 2.5);
      ctx.fill();
      rrect(px + pw, py + 84, 5, 18, 2.5);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + 13, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#fce4ef";
      ctx.fill();
      ctx.strokeStyle = "#f2a7bf";
      ctx.stroke();
    };

    const drawCreamLine = (i: number, amount: number) => {
      if (amount <= 0) return;
      const dir = rowDir(i);
      const y = rowY(i);
      const left = px + 8;
      const right = px + pw - 8;
      const start = dir === 1 ? left : right;
      const end = start + (dir === 1 ? right - left : left - right) * amount;
      const row = rows[i];

      const strokeWave = (offset: number, width: number, color: string) => {
        ctx.beginPath();
        for (let step = 0; step <= 100; step += 1) {
          const t = step / 100;
          const x = start + (end - start) * t;
          const bump = Math.abs(Math.cos(t * Math.PI * 8 + i * 0.8)) * thick * 0.28;
          const wy = Math.sin(t * Math.PI * 5 + i) * 0.9;
          const yy = y + wy + offset - bump;
          if (step === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();
      };

      strokeWave(thick * 0.45, thick + 6, "rgba(0,0,0,0.09)");
      strokeWave(0, thick + 2, `${row.sh}55`);
      strokeWave(thick * 0.28, thick, row.col);
      strokeWave(-thick * 0.12, thick * 0.28, "rgba(255,255,255,0.5)");
    };

    const drawAllCream = () => {
      ctx.save();
      rrect(px, py, pw, ph, pr);
      ctx.clip();
      if (!pointer.hasInteracted) {
        progress.forEach((amount, i) => drawCreamLine(i, amount));
      }
      const strokeIds = [...new Set(userStrokes.map((dot) => dot.strokeId))];
      strokeIds.forEach((strokeId) => {
        const dots = userStrokes.filter((dot) => dot.strokeId === strokeId);
        if (!dots.length) return;
        const first = dots[0];

        const trace = (offsetY: number) => {
          ctx.beginPath();
          ctx.moveTo(dots[0].x, dots[0].y + offsetY);
          for (let i = 0; i < dots.length - 1; i += 1) {
            const currentDot = dots[i];
            const nextDot = dots[i + 1];
            const midX = (currentDot.x + nextDot.x) / 2;
            const midY = (currentDot.y + nextDot.y) / 2 + offsetY;
            ctx.quadraticCurveTo(currentDot.x, currentDot.y + offsetY, midX, midY);
          }
          const last = dots[dots.length - 1];
          ctx.lineTo(last.x, last.y + offsetY);
        };

        trace(3);
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = first.size * 2.55;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        trace(0);
        ctx.strokeStyle = `${first.sh}88`;
        ctx.lineWidth = first.size * 2.18;
        ctx.stroke();

        trace(-1);
        ctx.strokeStyle = first.color;
        ctx.lineWidth = first.size * 1.95;
        ctx.stroke();

        trace(-4);
        ctx.strokeStyle = "rgba(255,255,255,0.48)";
        ctx.lineWidth = first.size * 0.26;
        ctx.stroke();
      });
      ctx.restore();
    };

    const drawGems = () => {
      if (pointer.hasInteracted) return;
      ctx.save();
      rrect(px, py, pw, ph, pr);
      ctx.clip();
      progress.forEach((amount, i) => {
        if (amount < 0.99) return;
        const row = rows[i];
        for (let gem = 0; gem < 3; gem += 1) {
          const gx = px + 20 + ((i * 31 + gem * 47) % 130);
          const gy = rowY(i) + (gem % 2 === 0 ? -thick * 0.55 : thick * 0.55);
          const radius = 4.5 + gem * 0.8;
          const gradient = ctx.createRadialGradient(gx - radius * 0.35, gy - radius * 0.35, radius * 0.1, gx, gy, radius);
          gradient.addColorStop(0, "rgba(255,255,255,0.95)");
          gradient.addColorStop(0.4, row.col);
          gradient.addColorStop(1, `${row.sh}99`);
          ctx.beginPath();
          ctx.arc(gx, gy, radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.6)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
      ctx.restore();
    };

    const drawCharm = (x: number, y: number, kind: CharmKind, color: string, size: number, rot = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.shadowColor = "rgba(232,68,154,0.2)";
      ctx.shadowBlur = 8;

      const s = size / 20;
      const stroke = "#7a3a5c";
      const blush = "#ff9cc8";
      const eye = "#4b2536";

      ctx.fillStyle = "#fff8fb";
      ctx.strokeStyle = `${color}cc`;
      ctx.lineWidth = 1.4 * s;
      ctx.beginPath();
      ctx.arc(0, -18 * s, 4.2 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const face = (mouthY = 3 * s) => {
        ctx.fillStyle = eye;
        ctx.beginPath();
        ctx.arc(-5 * s, -2 * s, 1.35 * s, 0, Math.PI * 2);
        ctx.arc(5 * s, -2 * s, 1.35 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = blush;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.ellipse(-8 * s, 3 * s, 2.5 * s, 1.6 * s, 0, 0, Math.PI * 2);
        ctx.ellipse(8 * s, 3 * s, 2.5 * s, 1.6 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.1 * s;
        ctx.beginPath();
        ctx.arc(0, mouthY, 3 * s, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      };

      const fillShape = () => {
        ctx.fillStyle = color;
        ctx.strokeStyle = `${stroke}cc`;
        ctx.lineWidth = 1.45 * s;
        ctx.fill();
        ctx.stroke();
      };

      if (kind === "bunny") {
        ctx.fillStyle = color;
        ctx.strokeStyle = `${stroke}cc`;
        ctx.lineWidth = 1.4 * s;
        ctx.beginPath();
        ctx.ellipse(-6 * s, -14 * s, 4.5 * s, 11 * s, -0.18, 0, Math.PI * 2);
        ctx.ellipse(6 * s, -14 * s, 4.5 * s, 11 * s, 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffe4f1";
        ctx.beginPath();
        ctx.ellipse(-6 * s, -14 * s, 2 * s, 6.5 * s, -0.18, 0, Math.PI * 2);
        ctx.ellipse(6 * s, -14 * s, 2 * s, 6.5 * s, 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 1 * s, 12 * s, 0, Math.PI * 2);
        fillShape();
        face(4 * s);
      } else if (kind === "kitty") {
        ctx.beginPath();
        ctx.moveTo(-12 * s, -3 * s);
        ctx.lineTo(-9 * s, -15 * s);
        ctx.lineTo(-2 * s, -8 * s);
        ctx.lineTo(2 * s, -8 * s);
        ctx.lineTo(9 * s, -15 * s);
        ctx.lineTo(12 * s, -3 * s);
        ctx.bezierCurveTo(14 * s, 9 * s, 7 * s, 14 * s, 0, 14 * s);
        ctx.bezierCurveTo(-7 * s, 14 * s, -14 * s, 9 * s, -12 * s, -3 * s);
        fillShape();
        face(3 * s);
      } else if (kind === "puppy") {
        ctx.beginPath();
        ctx.ellipse(-12 * s, -3 * s, 5 * s, 9 * s, 0.35, 0, Math.PI * 2);
        ctx.ellipse(12 * s, -3 * s, 5 * s, 9 * s, -0.35, 0, Math.PI * 2);
        ctx.fillStyle = "#8ab8f6";
        ctx.fill();
        ctx.strokeStyle = `${stroke}cc`;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 12 * s, 0, Math.PI * 2);
        fillShape();
        face(4 * s);
      } else if (kind === "bear") {
        ctx.beginPath();
        ctx.arc(-8 * s, -10 * s, 5 * s, 0, Math.PI * 2);
        ctx.arc(8 * s, -10 * s, 5 * s, 0, Math.PI * 2);
        ctx.arc(0, 0, 12 * s, 0, Math.PI * 2);
        fillShape();
        face(4 * s);
      } else if (kind === "bow") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-8 * s, -11 * s, -20 * s, -9 * s, -18 * s, 2 * s);
        ctx.bezierCurveTo(-16 * s, 12 * s, -7 * s, 9 * s, 0, 1 * s);
        ctx.bezierCurveTo(7 * s, 9 * s, 16 * s, 12 * s, 18 * s, 2 * s);
        ctx.bezierCurveTo(20 * s, -9 * s, 8 * s, -11 * s, 0, 0);
        fillShape();
        ctx.beginPath();
        ctx.roundRect(-4 * s, -4 * s, 8 * s, 8 * s, 3 * s);
        ctx.fillStyle = "#fff4fb";
        ctx.fill();
        ctx.stroke();
      } else if (kind === "berry") {
        ctx.beginPath();
        ctx.moveTo(0, -12 * s);
        ctx.bezierCurveTo(13 * s, -10 * s, 14 * s, 8 * s, 0, 16 * s);
        ctx.bezierCurveTo(-14 * s, 8 * s, -13 * s, -10 * s, 0, -12 * s);
        fillShape();
        ctx.fillStyle = "#7aad8a";
        ctx.beginPath();
        ctx.moveTo(-7 * s, -11 * s);
        ctx.lineTo(0, -17 * s);
        ctx.lineTo(7 * s, -11 * s);
        ctx.lineTo(0, -13 * s);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fff7de";
        for (let i = 0; i < 5; i += 1) {
          ctx.beginPath();
          ctx.arc((-5 + (i % 3) * 5) * s, (-4 + Math.floor(i / 3) * 7) * s, 1.1 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (kind === "cloud") {
        ctx.beginPath();
        ctx.arc(-8 * s, 3 * s, 7 * s, Math.PI, 0);
        ctx.arc(-1 * s, -3 * s, 8 * s, Math.PI, 0);
        ctx.arc(8 * s, 2 * s, 6.5 * s, Math.PI, 0);
        ctx.lineTo(14 * s, 8 * s);
        ctx.lineTo(-14 * s, 8 * s);
        ctx.closePath();
        fillShape();
        face(6 * s);
      } else if (kind === "heart") {
        ctx.beginPath();
        ctx.moveTo(0, 14 * s);
        ctx.bezierCurveTo(-18 * s, 1 * s, -12 * s, -14 * s, 0, -6 * s);
        ctx.bezierCurveTo(12 * s, -14 * s, 18 * s, 1 * s, 0, 14 * s);
        fillShape();
      } else if (kind === "star") {
        ctx.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const radius = i % 2 === 0 ? 14 * s : 6.5 * s;
          const angle = -Math.PI / 2 + (i * Math.PI) / 5;
          const sx = Math.cos(angle) * radius;
          const sy = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        fillShape();
      } else {
        ctx.beginPath();
        ctx.roundRect(-12 * s, -8 * s, 24 * s, 21 * s, 7 * s);
        fillShape();
        ctx.fillStyle = "#c78a52";
        ctx.beginPath();
        ctx.ellipse(0, -7 * s, 11 * s, 5 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        face(5 * s);
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.ellipse(-5 * s, -8 * s, 3 * s, 1.5 * s, -0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawPlacedCharms = () => {
      ctx.save();
      rrect(px, py, pw, ph, pr);
      ctx.clip();
      placedCharms.forEach((charm) => drawCharm(charm.x, charm.y, charm.kind, charm.color, charm.size, charm.rot));
      ctx.restore();
    };

    const drawPipingBag = (x: number, y: number, dir: number, squeeze: number, creamColor: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(dir === 1 ? 0 : Math.PI);
      ctx.shadowColor = "rgba(122,58,92,0.16)";
      ctx.shadowBlur = 7;
      ctx.shadowOffsetY = 2;

      // Keep the metal tip exactly on the pointer so cream lands where the bag points.
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(15, -4.5);
      ctx.lineTo(15, 4.5);
      ctx.closePath();
      ctx.fillStyle = "#b8bec7";
      ctx.fill();
      ctx.strokeStyle = "#6d7480";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(14, -7, 11, 14, 4);
      ctx.fillStyle = "#f7f7f7";
      ctx.fill();
      ctx.strokeStyle = "#cfd1d6";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(24, -(10.5 - squeeze * 1.4));
      ctx.bezierCurveTo(42, -(19 - squeeze * 1.6), 68, -(19 - squeeze * 1.4), 82, -8);
      ctx.quadraticCurveTo(88, 0, 82, 8);
      ctx.bezierCurveTo(68, 19 - squeeze * 1.4, 42, 19 - squeeze * 1.6, 24, 10.5 - squeeze * 1.4);
      ctx.closePath();
      const body = ctx.createLinearGradient(20, -16, 86, 16);
      body.addColorStop(0, creamColor);
      body.addColorStop(0.58, creamColor);
      body.addColorStop(1, "#fff8fb");
      ctx.fillStyle = body;
      ctx.fill();
      ctx.strokeStyle = "#f2a7bf";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,255,255,0.62)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(37, -10);
      ctx.bezierCurveTo(52, -14, 72, -9, 79, 1);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.64)";
      ctx.beginPath();
      ctx.arc(38, 3, 2.4, 0, Math.PI * 2);
      ctx.arc(52, -5, 1.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = 0.82;
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.strokeStyle = "rgba(180,180,190,0.42)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(81, -8);
      ctx.lineTo(97, -16);
      ctx.lineTo(92, -3);
      ctx.lineTo(103, 7);
      ctx.lineTo(84, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    };

    const drawTrayPipingBag = (x: number, y: number, fill: string, stroke: string, selected: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.62, 0.62);
      ctx.rotate(-0.35);
      ctx.shadowColor = "rgba(122,58,92,0.16)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      ctx.beginPath();
      ctx.moveTo(-28, -8);
      ctx.bezierCurveTo(-4, -23, 25, -22, 38, -11);
      ctx.lineTo(44, 11);
      ctx.bezierCurveTo(30, 25, -4, 27, -24, 15);
      ctx.bezierCurveTo(-31, 8, -32, -1, -28, -8);
      ctx.closePath();
      const bagFill = ctx.createLinearGradient(-28, -17, 44, 17);
      bagFill.addColorStop(0, "#fff8fb");
      bagFill.addColorStop(0.28, fill);
      bagFill.addColorStop(1, stroke);
      ctx.fillStyle = bagFill;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = selected ? "#e8449a" : "rgba(46,16,32,0.9)";
      ctx.lineWidth = selected ? 3.4 : 1.3;
      ctx.stroke();

      ctx.save();
      ctx.globalAlpha = 0.56;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-6, -14);
      ctx.bezierCurveTo(11, -17, 30, -10, 37, 3);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.strokeStyle = "rgba(180,180,190,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-28, -9);
      ctx.lineTo(-44, -17);
      ctx.lineTo(-39, -3);
      ctx.lineTo(-48, 7);
      ctx.lineTo(-30, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#f7f7f7";
      ctx.strokeStyle = "#cfd1d6";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(37, 8, 10, 12, 4);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(46, 10);
      ctx.lineTo(60, 15);
      ctx.lineTo(48, 20);
      ctx.closePath();
      ctx.fillStyle = "#aeb3bb";
      ctx.fill();
      ctx.strokeStyle = "#6d7480";
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.62)";
      ctx.beginPath();
      ctx.arc(-5, 4, 2.3, 0, Math.PI * 2);
      ctx.arc(12, -7, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawParticles = () => {
      for (let i = sparkles.length - 1; i >= 0; i -= 1) {
        const s = sparkles[i];
        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.translate(s.x, s.y);
        ctx.strokeStyle = "#e8449a";
        ctx.lineWidth = 1.8;
        for (let arm = 0; arm < 4; arm += 1) {
          ctx.save();
          ctx.rotate(arm * Math.PI / 4 + (1 - s.life) * 0.4);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -s.size);
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
        s.life -= 0.045;
        if (s.life <= 0) sparkles.splice(i, 1);
      }
      for (let i = hearts.length - 1; i >= 0; i -= 1) {
        const h = hearts[i];
        ctx.save();
        ctx.globalAlpha = h.life * 0.9;
        ctx.translate(h.x, h.y);
        ctx.scale(h.size / 10, h.size / 10);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10, -8, -18, 2, -10, 10);
        ctx.lineTo(0, 18);
        ctx.lineTo(10, 10);
        ctx.bezierCurveTo(18, 2, 10, -8, 0, 0);
        ctx.fillStyle = "#e8449a";
        ctx.fill();
        ctx.restore();
        h.x += h.vx;
        h.y += h.vy;
        h.life -= 0.013;
        if (h.life <= 0) hearts.splice(i, 1);
      }
    };

    const drawBadge = () => {
      rrect(px - 8, py + ph + 16, pw + 16, 30, 15);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(232,68,154,0.45)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = "#7a3a5c";
      ctx.font = "800 11px Quicksand";
      ctx.textAlign = "center";
      ctx.fillText(pointer.hasInteracted ? "Draw cream, then add charms" : "Start with a cream bag", px + pw / 2, py + ph + 36);
    };

    const drawTray = () => {
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      rrect(20, 404, 340, 188, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(242,167,191,0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#7a3a5c";
      ctx.font = "800 11px Quicksand";
      ctx.textAlign = "left";
      const trayPrompt = !pointer.bagSelected
        ? "1. Choose a cream color"
        : userStrokes.length <= 12
          ? "2. Drag on the phone case"
          : "3. Drag charms onto your design";
      ctx.fillText(trayPrompt, 42, 426);
      if (userStrokes.length > 12) {
        ctx.fillStyle = "#e8449a";
        ctx.font = "800 10px Quicksand";
        ctx.textAlign = "center";
        ctx.fillText("Tip: pick another cream color anytime", 188, 579);
      }
      bagTray.forEach((bag, index) => {
        drawTrayPipingBag(bag.x, bag.y, bag.col, bag.sh, pointer.colorIndex === index && pointer.hasInteracted);
        ctx.fillStyle = "#7a3a5c";
        ctx.font = "700 9px Quicksand";
        ctx.textAlign = "center";
        ctx.fillText(bag.name, bag.x, bag.y + 48);
      });

      ctx.fillStyle = "#7a3a5c";
      ctx.font = "800 10px Quicksand";
      ctx.textAlign = "center";
      ctx.fillText("Charms", 342, 64);
      charmTray.forEach((charm, index) => {
        const isHovering = pointer.hoveringCharm && pointer.hoverCharmIndex === index && !pointer.active;
        drawCharm(charm.x, charm.y, charm.kind, charm.color, isHovering ? 22 : 18, isHovering ? Math.sin(frame * 0.12) * 0.08 : 0);
      });

      rrect(restartButton.x, restartButton.y, restartButton.w, restartButton.h, 14);
      ctx.fillStyle = pointer.hasInteracted ? "#fff0f6" : "rgba(255,240,246,0.55)";
      ctx.fill();
      ctx.strokeStyle = pointer.hasInteracted ? "#e8449a" : "rgba(232,68,154,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = pointer.hasInteracted ? "#e8449a" : "rgba(122,58,92,0.5)";
      ctx.font = "800 10px Quicksand";
      ctx.textAlign = "center";
      ctx.fillText("Restart", restartButton.x + restartButton.w / 2, restartButton.y + 18);
    };

    const getPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvasW,
        y: ((event.clientY - rect.top) / rect.height) * canvasH,
      };
    };

    const distance = (aX: number, aY: number, bX: number, bY: number) => Math.hypot(aX - bX, aY - bY);
    const inPhone = (x: number, y: number) => x >= px - 8 && x <= px + pw + 8 && y >= py + 8 && y <= py + ph + 8;
    const hitBag = (x: number, y: number) => bagTray.findIndex((bag) => distance(x, y, bag.x, bag.y) < 34);
    const hitCharm = (x: number, y: number) => charmTray.findIndex((charm) => distance(x, y, charm.x, charm.y) < 24);
    const hitRestart = (x: number, y: number) =>
      x >= restartButton.x && x <= restartButton.x + restartButton.w && y >= restartButton.y && y <= restartButton.y + restartButton.h;
    const overToolUi = (x: number, y: number) => hitBag(x, y) >= 0 || hitCharm(x, y) >= 0 || hitRestart(x, y);
    const updateCursor = (x: number, y: number) => {
      const charmIndex = hitCharm(x, y);
      const overTool = overToolUi(x, y);
      const canPaint = pointer.bagSelected && inPhone(x, y);
      canvas.style.cursor = charmIndex >= 0 ? "grab" : overTool ? "pointer" : canPaint ? "crosshair" : "grab";
      pointer.hoveringTool = overTool;
      pointer.hoveringCharm = charmIndex >= 0;
      pointer.hoverCharmIndex = charmIndex;
    };

    const blankCreation = () => {
      progress.fill(0);
      userStrokes.splice(0);
      placedCharms.splice(0);
      hearts.splice(0);
      sparkles.splice(0);
      current = 0;
      phase = "piping";
      resetWait = 0;
      pointer.hasInteracted = true;
      pointer.bagSelected = true;
      pointer.active = false;
      pointer.mode = "none";
      pointer.idleFrames = 0;
      pointer.lastPaintX = 0;
      pointer.lastPaintY = 0;
      activeStrokeId += 1;
    };

    const restartCreation = () => {
      blankCreation();
      pointer.bagX = px + pw / 2;
      pointer.bagY = py + ph / 2;
      addHeart(px + pw / 2, py + ph + 14);
    };

    const paintAt = (x: number, y: number) => {
      const clampedX = Math.max(px + 8, Math.min(px + pw - 8, x));
      const clampedY = Math.max(py + 28, Math.min(py + ph - 12, y));
      const row = rows[pointer.colorIndex % rows.length];
      if (distance(pointer.lastPaintX, pointer.lastPaintY, clampedX, clampedY) < 5) return;
      userStrokes.push({ x: clampedX, y: clampedY, color: row.col, hi: row.hi, sh: row.sh, size: 8.4, strokeId: activeStrokeId });
      if (userStrokes.length > 520) userStrokes.splice(0, userStrokes.length - 520);
      pointer.lastPaintX = clampedX;
      pointer.lastPaintY = clampedY;
      if (frame % 2 === 0) addSparkle(clampedX + (Math.random() - 0.5) * 14, clampedY + (Math.random() - 0.5) * 12);
    };

    const paintStrokeTo = (x: number, y: number) => {
      const clampedX = Math.max(px + 8, Math.min(px + pw - 8, x));
      const clampedY = Math.max(py + 28, Math.min(py + ph - 12, y));
      if (!pointer.lastPaintX && !pointer.lastPaintY) {
        paintAt(clampedX, clampedY);
        return;
      }
      const length = distance(pointer.lastPaintX, pointer.lastPaintY, clampedX, clampedY);
      const steps = Math.max(1, Math.ceil(length / 6));
      const fromX = pointer.lastPaintX;
      const fromY = pointer.lastPaintY;
      for (let step = 1; step <= steps; step += 1) {
        const t = step / steps;
        paintAt(fromX + (clampedX - fromX) * t, fromY + (clampedY - fromY) * t);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const point = getPoint(event);
      const selectedBag = hitBag(point.x, point.y);
      const selectedCharm = hitCharm(point.x, point.y);
      const phoneHit = inPhone(point.x, point.y);
      if (hitRestart(point.x, point.y)) {
        event.preventDefault();
        restartCreation();
        return;
      }
      if (selectedBag >= 0) {
        event.preventDefault();
        const firstToolPick = !pointer.hasInteracted;
        pointer.colorIndex = selectedBag;
        pointer.bagSelected = true;
        pointer.hasInteracted = true;
        pointer.active = false;
        pointer.mode = "none";
        pointer.hoveringCharm = false;
        pointer.hoverCharmIndex = -1;
        pointer.bagX = px + pw / 2;
        pointer.bagY = py + ph / 2;
        pointer.lastPaintX = 0;
        pointer.lastPaintY = 0;
        if (firstToolPick) blankCreation();
        addSparkle(bagTray[selectedBag].x, bagTray[selectedBag].y);
        return;
      }
      if (selectedCharm >= 0 && !pointer.hasInteracted) return;
      if (selectedCharm < 0 && (!phoneHit || !pointer.bagSelected)) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      pointer.active = true;
      pointer.mode = selectedCharm >= 0 ? "charm" : "bag";
      pointer.hoveringCharm = false;
      pointer.hoverCharmIndex = -1;
      pointer.hasInteracted = true;
      pointer.idleFrames = 0;
      progress.fill(0);
      current = 0;
      phase = "piping";
      resetWait = 0;
      if (selectedCharm >= 0) pointer.charmIndex = selectedCharm;
      pointer.bagX = point.x;
      pointer.bagY = point.y;
      pointer.dir = point.x < px + pw / 2 ? 1 : -1;
      pointer.lastPaintX = point.x;
      pointer.lastPaintY = point.y;
      pointer.charmX = point.x;
      pointer.charmY = point.y;
      if (pointer.mode === "bag") {
        activeStrokeId += 1;
        pointer.lastPaintX = 0;
        pointer.lastPaintY = 0;
        paintStrokeTo(point.x, point.y);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const point = getPoint(event);
      updateCursor(point.x, point.y);
      const prevX = pointer.bagX;
      if (pointer.bagSelected && pointer.mode !== "charm" && !pointer.hoveringCharm && (pointer.active || !overToolUi(point.x, point.y))) {
        pointer.bagX = point.x;
        pointer.bagY = point.y;
      }
      pointer.dir = point.x >= prevX ? 1 : -1;
      if (!pointer.active) return;
      event.preventDefault();
      if (pointer.mode === "bag") paintStrokeTo(point.x, point.y);
      if (pointer.mode === "charm") {
        pointer.charmX = point.x;
        pointer.charmY = point.y;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!pointer.active) return;
      const mode = pointer.mode;
      pointer.active = false;
      pointer.idleFrames = 0;
      if (mode === "charm" && inPhone(pointer.charmX, pointer.charmY)) {
        const charm = charms[pointer.charmIndex % charms.length];
        placedCharms.push({
          x: Math.max(px + 18, Math.min(px + pw - 18, pointer.charmX)),
          y: Math.max(py + 32, Math.min(py + ph - 18, pointer.charmY)),
          kind: charm.kind,
          color: charm.color,
          size: 19,
          rot: (Math.random() - 0.5) * 0.35,
        });
        addHeart(pointer.charmX, pointer.charmY - 18);
      }
      pointer.mode = "none";
      const point = getPoint(event);
      updateCursor(point.x, point.y);
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // The browser may already have released capture after a cancelled touch.
      }
      if (mode !== "charm") addHeart(pointer.bagX, pointer.bagY - 18);
    };

    const onPointerLeave = () => {
      pointer.hoveringTool = false;
      pointer.hoveringCharm = false;
      pointer.hoverCharmIndex = -1;
      if (!pointer.active) canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const draw = () => {
      raf = 0;
      frame += 1;
      ctx.clearRect(0, 0, canvasW, canvasH);
      drawBackground();
      drawPhone();
      drawAllCream();
      drawGems();
      drawPlacedCharms();

      if (pointer.active) {
        if (pointer.mode === "bag") drawPipingBag(pointer.bagX, pointer.bagY, pointer.dir, 1, rows[pointer.colorIndex % rows.length].col);
        if (pointer.mode === "charm") {
          const charm = charms[pointer.charmIndex % charms.length];
          drawCharm(pointer.charmX, pointer.charmY, charm.kind, charm.color, 22, Math.sin(frame * 0.08) * 0.08);
        }
      } else if (pointer.bagSelected && !pointer.hoveringTool && !pointer.hoveringCharm && !overToolUi(pointer.bagX, pointer.bagY)) {
        drawPipingBag(pointer.bagX, pointer.bagY, pointer.dir, 0.35, rows[pointer.colorIndex % rows.length].col);
      } else if (!pointer.hasInteracted) {
        if (phase === "piping") {
        progress[current] = Math.min(1, progress[current] + 0.009);
        const dir = rowDir(current);
        const left = px + 8;
        const right = px + pw - 8;
        const start = dir === 1 ? left : right;
        const end = dir === 1 ? right : left;
        const hx = start + (end - start) * progress[current];
        const hy = rowY(current);
        if (frame % 3 === 0) addSparkle(hx + (Math.random() - 0.5) * 20, hy + (Math.random() - 0.5) * 16);
        drawPipingBag(hx, hy, dir, Math.sin(frame * 0.22) * 0.5 + 0.5, rows[current].col);
        if (progress[current] >= 1) {
          for (let i = 0; i < 5; i += 1) addHeart(end + (Math.random() - 0.5) * 30, hy - 8);
          current += 1;
          if (current >= rows.length) phase = "celebrate";
        }
        } else if (phase === "celebrate") {
        if (frame % 16 === 0) addHeart(px + 10 + Math.random() * pw, py + Math.random() * ph);
        resetWait += 1;
        if (resetWait > 140) {
          phase = "reset";
          resetWait = 0;
        }
        } else {
        resetWait += 1;
        if (resetWait > 80) {
          progress.fill(0);
          current = 0;
          phase = "piping";
          resetWait = 0;
          hearts.splice(0);
        }
      }
      } else {
        pointer.idleFrames += 1;
      }

      drawParticles();
      rrect(px, py, pw, ph, pr);
      ctx.strokeStyle = "#f2a7bf";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      drawBadge();
      drawTray();

      if (isVisible && pageVisible) raf = requestAnimationFrame(draw);
    };

    const startDrawing = () => {
      if (!raf && isVisible && pageVisible) raf = requestAnimationFrame(draw);
    };
    const stopDrawing = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) startDrawing();
      else stopDrawing();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startDrawing();
        else stopDrawing();
      },
      { threshold: 0.05 }
    );

    canvas.style.cursor = "grab";
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);
    draw();
    return () => {
      stopDrawing();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={380}
      height={620}
      className="feature-canvas deco-canvas"
      role="img"
      aria-label="Interactive deco cream phone case designer. Pick a piping bag, draw on the case, then drag charms onto it."
    />
  );
}

export function ClawCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const canvasW = 420;
    const canvasH = 420;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let frame = 0;
    let raf = 0;
    let pageVisible = document.visibilityState === "visible";
    let isVisible = true;
    let clawX = 210;
    let clawY = 112;
    let targetX = 210;
    let heldPrize = -1;
    let message = "Move the claw, then press DROP";
    let messageTimer = 0;
    let state: "ready" | "dropping" | "grabbing" | "lifting" | "delivering" | "celebrate" = "ready";
    const controls = {
      left: { x: 96, y: 326, w: 46, h: 34 },
      drop: { x: 160, y: 318, w: 100, h: 44 },
      right: { x: 278, y: 326, w: 46, h: 34 },
    };
    const prizeSlot = { x: 162, y: 270, w: 96, h: 30 };
    const prizes = [
      { x: 112, y: 251, color: "#ffb3d1", kind: "bunny", won: false },
      { x: 176, y: 264, color: "#c9a8e0", kind: "bear", won: false },
      { x: 244, y: 252, color: "#b8eeda", kind: "kitty", won: false },
      { x: 145, y: 222, color: "#ffd6b3", kind: "puppy", won: false },
      { x: 218, y: 222, color: "#fce4ec", kind: "star", won: false },
    ];

    const rrect = (x: number, y: number, w: number, h: number, r: number | number[]) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const setMessage = (text: string, timer = 140) => {
      message = text;
      messageTimer = timer;
    };

    const clampClaw = () => {
      targetX = Math.max(92, Math.min(328, targetX));
      clawX = Math.max(92, Math.min(328, clawX));
    };

    const resetPrizes = () => {
      prizes.forEach((prize, index) => {
        const home = [
          [112, 251],
          [176, 264],
          [244, 252],
          [145, 222],
          [218, 222],
        ][index];
        prize.x = home[0];
        prize.y = home[1];
        prize.won = false;
      });
      heldPrize = -1;
      state = "ready";
      clawX = 210;
      targetX = 210;
      clawY = 112;
      setMessage("Fresh prizes loaded!");
    };

    const tryDrop = () => {
      if (state === "celebrate") {
        resetPrizes();
        return;
      }
      if (state !== "ready") return;
      state = "dropping";
      heldPrize = -1;
      setMessage("Dropping...");
    };

    const getPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * canvasW,
        y: ((event.clientY - rect.top) / rect.height) * canvasH,
      };
    };

    const hit = (point: { x: number; y: number }, rect: { x: number; y: number; w: number; h: number }) =>
      point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;

    const drawFace = (s: number) => {
      ctx.fillStyle = "#3d2035";
      ctx.beginPath();
      ctx.arc(-6 * s, -2 * s, 2 * s, 0, Math.PI * 2);
      ctx.arc(6 * s, -2 * s, 2 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3d2035";
      ctx.lineWidth = 1.2 * s;
      ctx.beginPath();
      ctx.arc(0, 6 * s, 4 * s, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "rgba(232,68,154,0.4)";
      ctx.beginPath();
      ctx.ellipse(-10 * s, 4 * s, 3 * s, 2 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(10 * s, 4 * s, 3 * s, 2 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPrize = (x: number, y: number, color: string, kind: string, wobble: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(wobble);
      ctx.fillStyle = color;
      ctx.strokeStyle = "#e8449a";
      ctx.lineWidth = 1.5;
      if (kind === "star") {
        ctx.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const radius = i % 2 === 0 ? 25 : 11;
          const angle = -Math.PI / 2 + (i * Math.PI) / 5;
          const sx = Math.cos(angle) * radius;
          const sy = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        if (kind === "bunny") {
          ctx.beginPath();
          ctx.ellipse(-8, -24, 6, 18, -0.2, 0, Math.PI * 2);
          ctx.ellipse(8, -24, 6, 18, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (kind === "kitty") {
          ctx.beginPath();
          ctx.moveTo(-19, -6);
          ctx.lineTo(-12, -22);
          ctx.lineTo(-3, -12);
          ctx.lineTo(3, -12);
          ctx.lineTo(12, -22);
          ctx.lineTo(19, -6);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(-12, -16, 9, 0, Math.PI * 2);
          ctx.arc(12, -16, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 23, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        drawFace(1);
      }
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.ellipse(-8, -9, 5, 2.5, -0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawClaw = () => {
      const open = state === "ready" || state === "dropping";
      const arm = open ? 22 : 13;
      ctx.strokeStyle = "#90a4ae";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(clawX, 86);
      ctx.lineTo(clawX, clawY - 16);
      ctx.stroke();

      ctx.fillStyle = "#d7dde2";
      ctx.strokeStyle = "#757575";
      rrect(clawX - 13, clawY - 22, 26, 17, 5);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#757575";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(clawX - 5, clawY - 5);
      ctx.quadraticCurveTo(clawX - arm, clawY + 14, clawX - (open ? 13 : 5), clawY + 29);
      ctx.moveTo(clawX + 5, clawY - 5);
      ctx.quadraticCurveTo(clawX + arm, clawY + 14, clawX + (open ? 13 : 5), clawY + 29);
      ctx.stroke();
    };

    const drawButton = (rect: { x: number; y: number; w: number; h: number }, label: string, active = false) => {
      rrect(rect.x, rect.y, rect.w, rect.h, 12);
      ctx.fillStyle = active ? "#e8449a" : "#fff8fb";
      ctx.fill();
      ctx.strokeStyle = "#e8449a";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = active ? "#fff" : "#e8449a";
      ctx.font = "900 14px Quicksand";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
    };

    const update = () => {
      frame += 1;
      if (messageTimer > 0) messageTimer -= 1;
      if (!messageTimer && state === "ready") message = "Move the claw, then press DROP";

      if (state === "ready") {
        clawX += (targetX - clawX) * 0.18;
      } else if (state === "dropping") {
        clawY += 5;
        if (clawY >= 222) {
          clawY = 222;
          let best = -1;
          let bestDistance = 999;
          prizes.forEach((prize, index) => {
            if (prize.won) return;
            const distance = Math.hypot(prize.x - clawX, prize.y - (clawY + 28));
            if (distance < 36 && distance < bestDistance) {
              best = index;
              bestDistance = distance;
            }
          });
          heldPrize = best;
          state = "grabbing";
          setMessage(best >= 0 ? "Got one!" : "So close!");
        }
      } else if (state === "grabbing") {
        if (messageTimer < 108) state = "lifting";
      } else if (state === "lifting") {
        clawY -= 4.5;
        if (heldPrize >= 0) {
          prizes[heldPrize].x = clawX;
          prizes[heldPrize].y = clawY + 38;
        }
        if (clawY <= 112) {
          clawY = 112;
          state = heldPrize >= 0 ? "delivering" : "ready";
          if (heldPrize < 0) setMessage("Try lining up over a prize");
        }
      } else if (state === "delivering") {
        clawX += (210 - clawX) * 0.12;
        if (heldPrize >= 0) {
          prizes[heldPrize].x = clawX;
          prizes[heldPrize].y = clawY + 38;
        }
        if (Math.abs(clawX - 210) < 2) {
          if (heldPrize >= 0) {
            prizes[heldPrize].x = prizeSlot.x + prizeSlot.w / 2;
            prizes[heldPrize].y = prizeSlot.y + 46;
            prizes[heldPrize].won = true;
          }
          heldPrize = -1;
          state = prizes.every((prize) => prize.won) ? "celebrate" : "ready";
          setMessage(state === "celebrate" ? "You won them all! Tap DROP to reset" : "Prize won! Try another");
        }
      }
      clampClaw();
    };

    const draw = () => {
      raf = 0;
      update();
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = "#fff4f9";
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.fillStyle = "#fce4ec";
      ctx.strokeStyle = "#e8449a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(40, 30, 340, 340, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#e8449a";
      ctx.beginPath();
      ctx.roundRect(40, 30, 340, 38, [18, 18, 0, 0]);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "800 14px Quicksand";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("KAWAII CLAW", 210, 54);

      ctx.fillStyle = "#e8f4fd";
      ctx.strokeStyle = "#90caf9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(70, 80, 280, 220, 12);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(70, 80, 280, 220, 12);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      for (let x = 84; x < 342; x += 34) {
        ctx.beginPath();
        ctx.arc(x, 96, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      prizes.forEach((prize, index) => {
        if (prize.won && index !== heldPrize) return;
        drawPrize(prize.x, prize.y, prize.color, prize.kind, Math.sin(frame * 0.04 + index) * 0.04);
      });
      ctx.restore();

      drawClaw();

      ctx.fillStyle = "#3d2035";
      ctx.beginPath();
      ctx.roundRect(prizeSlot.x, prizeSlot.y, prizeSlot.w, prizeSlot.h, 8);
      ctx.fill();
      ctx.fillStyle = "#c84068";
      ctx.font = "800 11px Quicksand";
      ctx.textAlign = "center";
      ctx.fillText("PRIZE SLOT", 210, 290);

      ctx.fillStyle = "#7a3a5c";
      ctx.font = "800 11px Quicksand";
      ctx.fillText(message, 210, 313);

      drawButton(controls.left, "◀");
      drawButton(controls.drop, state === "celebrate" ? "RESET" : "DROP", state !== "ready" && state !== "celebrate");
      drawButton(controls.right, "▶");

      if (isVisible && pageVisible) raf = requestAnimationFrame(draw);
    };

    const startDrawing = () => {
      if (!raf && isVisible && pageVisible) raf = requestAnimationFrame(draw);
    };
    const stopDrawing = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onPointerDown = (event: PointerEvent) => {
      const point = getPoint(event);
      event.preventDefault();
      canvas.focus();
      if (hit(point, controls.left)) targetX -= 38;
      else if (hit(point, controls.right)) targetX += 38;
      else if (hit(point, controls.drop)) tryDrop();
      else if (point.x >= 70 && point.x <= 350 && point.y >= 80 && point.y <= 300 && state === "ready") {
        targetX = point.x;
      }
      clampClaw();
    };
    const onPointerMove = (event: PointerEvent) => {
      const point = getPoint(event);
      if (hit(point, controls.drop) || hit(point, controls.left) || hit(point, controls.right)) canvas.style.cursor = "pointer";
      else if (point.x >= 70 && point.x <= 350 && point.y >= 80 && point.y <= 300) canvas.style.cursor = "crosshair";
      else canvas.style.cursor = "default";
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        targetX -= 24;
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        targetX += 24;
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        tryDrop();
      }
      clampClaw();
    };
    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible) startDrawing();
      else stopDrawing();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startDrawing();
        else stopDrawing();
      },
      { threshold: 0.05 }
    );

    canvas.style.cursor = "default";
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    observer.observe(canvas);
    draw();
    return () => {
      stopDrawing();
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={420}
      height={420}
      className="feature-canvas claw-canvas"
      tabIndex={0}
      role="application"
      aria-label="Interactive kawaii claw machine. Use arrow keys or tap to move the claw, then press drop."
    />
  );
}
