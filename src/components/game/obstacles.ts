export const drawObstacle = (ctx: CanvasRenderingContext2D, obs: { id: string; x: number; y: number; radius: number }) => {
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.8;
  ctx.lineJoin = "round";

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
  ctx.beginPath();
  ctx.ellipse(obs.x, obs.y + obs.radius * 0.8, obs.radius * 1.1, obs.radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  if (obs.id === "server") {
    const w = 40;
    const h = 50;
    const topX = obs.x - w / 2;
    const topY = obs.y - h / 2 - 5;

    ctx.fillStyle = "#94a3b8"; // cabinet
    ctx.fillRect(topX, topY, w, h);
    ctx.strokeRect(topX, topY, w, h);

    ctx.fillStyle = "#475569"; // slots
    ctx.fillRect(topX + 4, topY + 6, w - 8, 8);
    ctx.strokeRect(topX + 4, topY + 6, w - 8, 8);
    ctx.fillRect(topX + 4, topY + 20, w - 8, 8);
    ctx.strokeRect(topX + 4, topY + 20, w - 8, 8);
    ctx.fillRect(topX + 4, topY + 34, w - 8, 8);
    ctx.strokeRect(topX + 4, topY + 34, w - 8, 8);

    const blink = Math.sin(Date.now() * 0.01) > 0;
    ctx.fillStyle = blink ? "#22c55e" : "#15803d";
    ctx.fillRect(topX + 8, topY + 9, 3, 2);
    ctx.fillStyle = !blink ? "#ef4444" : "#b91c1c";
    ctx.fillRect(topX + 14, topY + 9, 3, 2);
    ctx.fillStyle = blink ? "#3b82f6" : "#1d4ed8";
    ctx.fillRect(topX + 8, topY + 23, 3, 2);
  }
  else if (obs.id === "console") {
    const w = 56;
    const h = 34;
    const topX = obs.x - w / 2;
    const topY = obs.y - h / 2;

    ctx.fillStyle = "#cbd5e1"; // desk
    ctx.fillRect(topX, topY, w, h);
    ctx.strokeRect(topX, topY, w, h);

    ctx.fillStyle = "#1e293b"; // screen
    ctx.fillRect(topX + 8, topY + 4, w - 16, h - 16);
    ctx.strokeRect(topX + 8, topY + 4, w - 16, h - 16);

    ctx.fillStyle = "#10b981"; // screens visualizer
    ctx.fillRect(topX + 14, topY + 8, 12, 4);
    ctx.fillRect(topX + 30, topY + 12, 10, 2);

    ctx.fillStyle = "#475569"; // keys
    ctx.fillRect(topX + 12, topY + h - 8, w - 24, 4);
  }
  else if (obs.id === "terminal") {
    const w = 48;
    const h = 48;
    const topX = obs.x - w / 2;
    const topY = obs.y - h / 2 - 4;

    ctx.fillStyle = "#64748b"; // main frame
    ctx.fillRect(topX, topY, w, h);
    ctx.strokeRect(topX, topY, w, h);

    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.roundRect(topX + 6, topY + 6, w - 12, h - 22, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0f172a"; // screen
    ctx.fillRect(topX + 10, topY + 10, w - 20, h - 30);

    const scanY = topY + 10 + ((Date.now() * 0.02) % (h - 32));
    ctx.fillStyle = "rgba(96, 165, 250, 0.4)";
    ctx.fillRect(topX + 10, scanY, w - 20, 2);

    ctx.fillStyle = "#334155";
    ctx.fillRect(topX + 8, topY + h - 10, 8, 4);
    ctx.fillRect(topX + 20, topY + h - 10, 8, 4);
    ctx.fillRect(topX + 32, topY + h - 10, 8, 4);
  }

  ctx.restore();
};
