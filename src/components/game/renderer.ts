import { GameState, Player, Slime, Projectile, Particle, FloatingText, HitSpark } from "./types";
import { drawObstacle } from "./obstacles";

export const drawGameScreen = (
  ctx: CanvasRenderingContext2D,
  state: GameState,
  activeCombo: string | null,
  canvasWidth: number,
  canvasHeight: number
) => {
  const p = state.player;

  // Clear Canvas Screen
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw Grid Lines (sci-fi background style)
  ctx.strokeStyle = "rgba(51, 65, 85, 0.15)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < canvasWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = 0; y < canvasHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  // Draw Obstacles (server cabinet, desks, tech desks)
  state.obstacles.forEach((obs) => {
    drawObstacle(ctx, obs);
  });

  // Render Projectiles (Fireballs & Wind Slashes)
  state.projectiles.forEach((proj) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
    ctx.fillStyle = proj.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = proj.color;
    ctx.fill();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  });

  // Render Particles
  state.particles.forEach((part) => {
    ctx.save();
    ctx.globalAlpha = part.alpha;
    ctx.fillStyle = part.color;
    ctx.beginPath();
    ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Render Slimes (Outlined bouncy circles)
  state.slimes.forEach((slime) => {
    ctx.save();
    const isFlashing = slime.flashFrames > 0;

    const hopScale = Math.sin(slime.hopTimer * 0.15);
    const squishW = slime.radius * (1 + (hopScale > 0 ? hopScale * 0.12 : hopScale * 0.08));
    const squishH = slime.radius * (1 - (hopScale > 0 ? hopScale * 0.08 : hopScale * 0.12));

    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(slime.x, slime.y + slime.radius * 0.85, squishW * 0.95, slime.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isFlashing ? "#ffffff" : slime.color;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.ellipse(slime.x, slime.y, squishW, squishH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    const eyeOffset = slime.isBoss ? 8 : 4;
    const eyeR = slime.isBoss ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(slime.x - eyeOffset, slime.y - squishH * 0.25, eyeR, 0, Math.PI * 2);
    ctx.arc(slime.x + eyeOffset, slime.y - squishH * 0.25, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(slime.x - eyeOffset, slime.y - squishH * 0.25, eyeR * 0.5, 0, Math.PI * 2);
    ctx.arc(slime.x + eyeOffset, slime.y - squishH * 0.25, eyeR * 0.5, 0, Math.PI * 2);
    ctx.fill();

    if (slime.isBoss) {
      ctx.fillStyle = "#eab308";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(slime.x - 14, slime.y - squishH);
      ctx.lineTo(slime.x - 10, slime.y - squishH - 12);
      ctx.lineTo(slime.x - 4, slime.y - squishH - 5);
      ctx.lineTo(slime.x, slime.y - squishH - 16);
      ctx.lineTo(slime.x + 4, slime.y - squishH - 5);
      ctx.lineTo(slime.x + 10, slime.y - squishH - 12);
      ctx.lineTo(slime.x + 14, slime.y - squishH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(slime.x, slime.y - squishH - 7, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (slime.isBoss) {
      const barW = 34;
      const barH = 4;
      const pct = Math.max(0, slime.hp / slime.maxHp);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(slime.x - barW / 2, slime.y - squishH - 24, barW, barH);
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(slime.x - barW / 2, slime.y - squishH - 24, barW * pct, barH);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.strokeRect(slime.x - barW / 2, slime.y - squishH - 24, barW, barH);
    }
  });

  ctx.save();
  const walkBob = Math.sin(Date.now() * 0.0085) * 1.5;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.8;
  ctx.lineJoin = "round";

  if (p.shieldTime > 0) {
    ctx.save();
    ctx.strokeStyle = "rgba(96, 165, 250, 0.65)";
    ctx.lineWidth = 3.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#3b82f6";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + p.radius * 0.8, p.radius * 1.1, p.radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.roundRect(p.x - 9, p.y - 7 + walkBob, 18, 11, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  if (walkBob > 0) {
    ctx.beginPath();
    ctx.roundRect(p.x - 12, p.y + 1 + walkBob, 4, 7, 1);
    ctx.roundRect(p.x + 8, p.y + 1 + walkBob, 4, 7, 1);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.roundRect(p.x - 11, p.y + 2 + walkBob, 4, 6, 1);
    ctx.roundRect(p.x + 7, p.y + 2 + walkBob, 4, 6, 1);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.roundRect(p.x - 11, p.y - 17 + walkBob, 22, 15, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#eab308";
  ctx.beginPath();
  ctx.moveTo(p.x, p.y - 17 + walkBob);
  ctx.lineTo(p.x - 3, p.y - 23 + walkBob);
  ctx.lineTo(p.x, p.y - 27 + walkBob);
  ctx.lineTo(p.x + 3, p.y - 21 + walkBob);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  let visorX = p.x - 8;
  let visorW = 16;
  if (p.facing === "left") { visorX = p.x - 10; visorW = 14; }
  else if (p.facing === "right") { visorX = p.x - 4; visorW = 14; }
  ctx.roundRect(visorX, p.y - 11 + walkBob, visorW, 6, 1);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = p.shieldTime > 0 ? "#60a5fa" : "#f43f5e";
  if (p.facing === "left") {
    ctx.fillRect(p.x - 8, p.y - 9 + walkBob, 3, 2);
  } else if (p.facing === "right") {
    ctx.fillRect(p.x + 5, p.y - 9 + walkBob, 3, 2);
  } else if (p.facing === "up") {
    // Rear view
  } else {
    ctx.fillRect(p.x - 5, p.y - 9 + walkBob, 3, 2);
    ctx.fillRect(p.x + 2, p.y - 9 + walkBob, 3, 2);
  }

  ctx.restore();

  const pBarW = 28;
  const pBarH = 4;
  const pPct = Math.max(0, state.playerHp / 100);
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(p.x - pBarW / 2, p.y - 34 + walkBob, pBarW, pBarH);
  ctx.fillStyle = pPct > 0.4 ? "#22c55e" : "#ef4444";
  ctx.fillRect(p.x - pBarW / 2, p.y - 34 + walkBob, pBarW * pPct, pBarH);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.strokeRect(p.x - pBarW / 2, p.y - 34 + walkBob, pBarW, pBarH);

  if (p.slashActive) {
    ctx.save();
    const alpha = p.slashTimer / p.slashDuration;
    const R1 = p.slashSize;
    const R2 = R1 * 0.62;
    const startAng = p.swordAngle - 1.15;
    const endAng = p.swordAngle + 1.15;
    const pixelSize = 4;

    const minX = Math.round((p.x - R1) / pixelSize) * pixelSize;
    const maxX = Math.round((p.x + R1) / pixelSize) * pixelSize;
    const minY = Math.round((p.y - R1) / pixelSize) * pixelSize;
    const maxY = Math.round((p.y + R1) / pixelSize) * pixelSize;

    for (let x = minX; x <= maxX; x += pixelSize) {
      for (let y = minY; y <= maxY; y += pixelSize) {
        const dx = x - p.x;
        const dy = y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist >= R2 && dist <= R1) {
          let diff = Math.atan2(dy, dx) - p.swordAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          if (diff >= -1.15 && diff <= 1.15) {
            if (Math.abs(dist - R2) < 3.5 || Math.abs(dist - R1) < 3.5 || Math.abs(diff - 1.15) < 0.12 || Math.abs(diff + 1.15) < 0.12) {
              ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.95})`;
              ctx.fillRect(x, y, pixelSize, pixelSize);
            } else {
              ctx.fillStyle = p.slashColor === "#ffffff"
                ? `rgba(255, 255, 255, ${alpha * 0.88})`
                : p.slashColor;
              ctx.globalAlpha = alpha;
              ctx.fillRect(x, y, pixelSize, pixelSize);
              ctx.globalAlpha = 1.0;
            }
          }
        }
      }
    }
    ctx.restore();
  }

  state.floatingTexts.forEach((ft) => {
    ctx.fillStyle = ft.color;
    ctx.font = "bold 13px sans-serif";
    ctx.globalAlpha = ft.alpha;
    ctx.textAlign = "center";
    ctx.fillText(ft.text, ft.x, ft.y);
  });
  ctx.globalAlpha = 1.0;

  state.hitSparks.forEach((spark) => {
    ctx.save();
    ctx.translate(spark.x, spark.y);
    ctx.fillStyle = spark.life % 2 === 0 ? "#ef4444" : "#facc15";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;

    const spikes = 6;
    const outerRadius = spark.size * (spark.life / 8);
    const innerRadius = outerRadius * 0.4;

    ctx.beginPath();
    let rot = (Math.PI / 2) * 3;
    let sx = 0;
    let sy = 0;
    const step = Math.PI / spikes;

    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      sx = Math.cos(rot) * outerRadius;
      sy = Math.sin(rot) * outerRadius;
      ctx.lineTo(sx, sy);
      rot += step;

      sx = Math.cos(rot) * innerRadius;
      sy = Math.sin(rot) * innerRadius;
      ctx.lineTo(sx, sy);
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
};
