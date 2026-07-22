"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Shield, Zap, Flame, Sword, Sparkles } from "lucide-react";

// Web Audio API Synthesizer for Retro Game Sound Effects
class SoundFX {
  private static ctx: AudioContext | null = null;
  private static muted: boolean = false;

  private static getCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  static toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  static isMuted() {
    return this.muted;
  }

  private static playTone(
    freqs: number[],
    times: number[],
    type: OscillatorType = "sine",
    gainVal: number = 0.1
  ) {
    const context = this.getCtx();
    if (!context || this.muted) return;
    if (context.state === "suspended") {
      context.resume();
    }

    try {
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gainNode = context.createGain();

      osc.type = type;
      osc.connect(gainNode);
      gainNode.connect(context.destination);

      osc.frequency.setValueAtTime(freqs[0], now);
      gainNode.gain.setValueAtTime(gainVal, now);

      for (let i = 1; i < freqs.length; i++) {
        osc.frequency.exponentialRampToValueAtTime(freqs[i], now + times[i]);
      }

      gainNode.gain.exponentialRampToValueAtTime(0.001, now + times[times.length - 1]);

      osc.start(now);
      osc.stop(now + times[times.length - 1] + 0.05);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  }

  static playSlash() {
    this.playTone([400, 150, 50], [0, 0.07, 0.12], "triangle", 0.15);
  }

  static playFireball() {
    this.playTone([180, 700, 80], [0, 0.08, 0.25], "sawtooth", 0.07);
  }

  static playDash() {
    this.playTone([80, 1000], [0, 0.1], "sine", 0.15);
  }

  static playSlam() {
    this.playTone([120, 30, 5], [0, 0.18, 0.35], "sawtooth", 0.22);
  }

  static playHit() {
    this.playTone([350, 180], [0, 0.06], "sine", 0.12);
  }

  static playHurt() {
    this.playTone([150, 50], [0, 0.12], "sawtooth", 0.18);
  }

  static playHeal() {
    this.playTone([220, 440, 880], [0, 0.08, 0.22], "sine", 0.08);
  }

  static playShield() {
    this.playTone([300, 600, 300, 900], [0, 0.07, 0.15, 0.25], "sine", 0.08);
  }
}

// Game Settings & Types
interface Slime {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  color: string;
  hopTimer: number;
  isBoss: boolean;
  flashFrames: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  damage: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
}

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  alpha: number;
}

interface HitSpark {
  id: string;
  x: number;
  y: number;
  size: number;
  life: number;
}

const drawObstacle = (ctx: CanvasRenderingContext2D, obs: { id: string; x: number; y: number; radius: number }) => {
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

export default function GameZone({ onClose }: { onClose?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  // Skill Cooldown States (in percentage remaining, for UI overlay)
  const [cooldowns, setCooldowns] = useState({
    1: 0, // Slash
    2: 0, // Fireball
    3: 0, // Dash
    4: 0, // Slam
  });

  // Combo HUD notification
  const [activeCombo, setActiveCombo] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Keyboard state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Game Engine Entities (using ref to bypass React re-render lags in requestAnimationFrame)
  const gameStateRef = useRef({
    player: {
      x: 400,
      y: 240,
      vx: 0,
      vy: 0,
      radius: 15,
      speed: 3.5,
      facing: "down" as "up" | "down" | "left" | "right",
      shieldTime: 0, // Invincible shield timer
      shieldMaxTime: 180, // 3 seconds at 60fps
      lastSlashTime: 0,
      swordAngle: 0,
      slashActive: false,
      slashDuration: 10, // frames
      slashTimer: 0,
      slashColor: "#ffffff",
      slashSize: 58,
    },
    playerHp: 100,
    score: 0,
    highScore: 0,
    slimes: [] as Slime[],
    projectiles: [] as Projectile[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    hitSparks: [] as HitSpark[],
    obstacles: [
      { id: "server", x: 140, y: 120, radius: 25 },
      { id: "console", x: 280, y: 340, radius: 28 },
      { id: "terminal", x: 620, y: 300, radius: 28 }
    ] as { id: string; x: number; y: number; radius: number }[],
    cooldownTimers: {
      1: 0, // Slash CD
      2: 0, // Fireball CD
      3: 0, // Dash CD
      4: 0, // Slam CD
    },
    cooldownMax: {
      1: 20, // 0.3s
      2: 80, // 1.3s
      3: 180, // 3s
      4: 500, // 8.3s
    },
    comboHistory: [] as number[],
    comboTimeout: 0,
    spawnTimer: 0,
    bossSpawnTimer: 0,
  });

  useEffect(() => {
    // Load high score
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("slime_slayer_highscore");
      if (stored) {
        const hs = parseInt(stored, 10);
        setHighScore(hs);
        gameStateRef.current.highScore = hs;
      }
    }
  }, []);

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = SoundFX.toggleMute();
    setIsMuted(muted);
  };

  const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
    gameStateRef.current.floatingTexts.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      color,
      vy: -1.2,
      alpha: 1,
    });
  };

  const spawnHitParticles = (x: number, y: number, color: string, count: number = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      gameStateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03,
      });
    }
  };



  // Normal strike (Basic sword swing, triggered by click or Spacebar)
  const executeNormalAttack = () => {
    if (!isPlaying || isGameOver) return;
    const state = gameStateRef.current;
    const p = state.player;
    const now = Date.now();

    // 220ms attack speed cooldown limit
    if (now - p.lastSlashTime < 220) return;
    p.lastSlashTime = now;

    p.slashActive = true;
    p.slashTimer = 8;
    p.slashColor = "#ffffff";
    p.slashSize = 56;
    
    let angle = 0;
    if (p.facing === "right") angle = 0;
    else if (p.facing === "down") angle = Math.PI / 2;
    else if (p.facing === "left") angle = Math.PI;
    else if (p.facing === "up") angle = -Math.PI / 2;
    p.swordAngle = angle;

    SoundFX.playSlash();

    const range = 58;
    state.slimes.forEach((slime) => {
      const dx = slime.x - p.x;
      const dy = slime.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < range) {
        const slimeAngle = Math.atan2(dy, dx);
        let diff = Math.abs(slimeAngle - angle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        
        if (diff < 1.3) {
          slime.hp -= 15;
          slime.flashFrames = 7;
          
          slime.x += Math.cos(slimeAngle) * 12;
          slime.y += Math.sin(slimeAngle) * 12;

          spawnFloatingText(slime.x, slime.y - 10, "15", "#ffffff");
          spawnHitParticles(slime.x, slime.y, "#ffffff", 4);

          state.hitSparks.push({
            id: Math.random().toString(),
            x: slime.x,
            y: slime.y,
            size: slime.isBoss ? 26 : 15,
            life: 8,
          });
        }
      }
    });
  };

  // Combo: Dash & Slice (Shadow Strike)
  const executeDashAndSlice = () => {
    const state = gameStateRef.current;
    const p = state.player;

    let dx = 0;
    let dy = 0;
    if (p.facing === "right") dx = 110;
    else if (p.facing === "left") dx = -110;
    else if (p.facing === "down") dy = 110;
    else if (p.facing === "up") dy = -110;

    p.x = Math.max(25, Math.min(775, p.x + dx));
    p.y = Math.max(25, Math.min(455, p.y + dy));

    SoundFX.playDash();

    for (let i = 0; i < 15; i++) {
      state.particles.push({
        x: p.x - dx * Math.random(),
        y: p.y - dy * Math.random(),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: "#c084fc",
        radius: Math.random() * 3 + 1.5,
        alpha: 1.0,
        decay: 0.05,
      });
    }

    p.slashActive = true;
    p.slashTimer = 15;
    p.swordAngle = 0;
    p.slashColor = "#c084fc";
    p.slashSize = 85;

    SoundFX.playSlash();

    state.slimes.forEach((slime) => {
      const sDx = slime.x - p.x;
      const sDy = slime.y - p.y;
      const dist = Math.hypot(sDx, sDy);
      if (dist < 85) {
        slime.hp -= 45;
        slime.flashFrames = 12;
        
        const knockAngle = Math.atan2(sDy, sDx);
        slime.x += Math.cos(knockAngle) * 35;
        slime.y += Math.sin(knockAngle) * 35;

        spawnFloatingText(slime.x, slime.y - 12, "SHADOW SLICE 45 ⚔️", "#c084fc");
        spawnHitParticles(slime.x, slime.y, "#c084fc", 10);

        state.hitSparks.push({
          id: Math.random().toString(),
          x: slime.x,
          y: slime.y,
          size: slime.isBoss ? 32 : 20,
          life: 8,
        });
      }
    });

    setActiveCombo("Dash & Slice");
    setTimeout(() => setActiveCombo(null), 1200);
  };

  // Combo: Grand Tempest (Wind Slashes)
  const executeGrandTempest = () => {
    const state = gameStateRef.current;
    const p = state.player;

    let angle = 0;
    if (p.facing === "right") angle = 0;
    else if (p.facing === "down") angle = Math.PI / 2;
    else if (p.facing === "left") angle = Math.PI;
    else if (p.facing === "up") angle = -Math.PI / 2;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        state.projectiles.push({
          x: p.x,
          y: p.y,
          vx: Math.cos(angle) * 7.5,
          vy: Math.sin(angle) * 7.5,
          radius: 15,
          color: "#2dd4bf",
          damage: 30,
          life: 80,
        });
        SoundFX.playSlash();
      }, i * 120);
    }

    setActiveCombo("Grand Tempest");
    setTimeout(() => setActiveCombo(null), 1200);
  };

  // Skill 1: Basic Slash
  const executeSlash = () => {
    const p = gameStateRef.current.player;
    p.slashActive = true;
    p.slashTimer = p.slashDuration;
    p.slashColor = "#22c55e";
    p.slashSize = 64;
    
    // Position slash rotation facing direction
    if (p.facing === "right") p.swordAngle = -0.5 * Math.PI;
    else if (p.facing === "left") p.swordAngle = 0.5 * Math.PI;
    else if (p.facing === "up") p.swordAngle = Math.PI;
    else p.swordAngle = 0;

    SoundFX.playSlash();

    // Hit check in slash arc
    const slashRange = 55;
    let hitCount = 0;

    gameStateRef.current.slimes.forEach((slime) => {
      const dx = slime.x - p.x;
      const dy = slime.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < slashRange) {
        // Simple angle facing validation
        let isFacing = false;
        if (p.facing === "right" && dx > -10) isFacing = true;
        if (p.facing === "left" && dx < 10) isFacing = true;
        if (p.facing === "up" && dy < 10) isFacing = true;
        if (p.facing === "down" && dy > -10) isFacing = true;

        if (isFacing) {
          slime.hp -= 20;
          slime.flashFrames = 5;
          hitCount++;
          // Knockback
          const angle = Math.atan2(dy, dx);
          slime.x += Math.cos(angle) * 35;
          slime.y += Math.sin(angle) * 35;

          spawnFloatingText(slime.x, slime.y - 10, "20", "#22c55e");
          spawnHitParticles(slime.x, slime.y, "#22c55e", 5);

          const state = gameStateRef.current;
          state.hitSparks.push({
            id: Math.random().toString(),
            x: slime.x,
            y: slime.y,
            size: slime.isBoss ? 26 : 15,
            life: 8,
          });
        }
      }
    });

    if (hitCount > 0) {
      SoundFX.playHit();
    }
  };

  // Skill 2: Fireball
  const executeFireball = (angleOffset = 0, speedMult = 1) => {
    const p = gameStateRef.current.player;
    SoundFX.playFireball();

    let angle = 0;
    if (p.facing === "right") angle = 0;
    else if (p.facing === "left") angle = Math.PI;
    else if (p.facing === "up") angle = -Math.PI / 2;
    else angle = Math.PI / 2;

    angle += angleOffset;

    const speed = 6 * speedMult;
    gameStateRef.current.projectiles.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 6,
      color: "#f97316",
      damage: 35,
      life: 120, // frames
    });
  };

  // Skill 3: Dash Strike
  const executeDash = () => {
    const p = gameStateRef.current.player;
    const slimes = gameStateRef.current.slimes;
    SoundFX.playDash();

    // Determine dash direction
    let dx = 0;
    let dy = 0;
    if (p.facing === "right") dx = 1;
    else if (p.facing === "left") dx = -1;
    else if (p.facing === "up") dy = -1;
    else dy = 1;

    const dashDist = 120;
    const startX = p.x;
    const startY = p.y;

    // Apply movement with simple canvas border bounds
    p.x = Math.max(20, Math.min(780, p.x + dx * dashDist));
    p.y = Math.max(20, Math.min(460, p.y + dy * dashDist));

    // Draw trail particles
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const tx = startX + (p.x - startX) * t;
      const ty = startY + (p.y - startY) * t;
      gameStateRef.current.particles.push({
        x: tx,
        y: ty,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        color: "#a855f7",
        radius: 3,
        alpha: 0.8,
        decay: 0.05,
      });
    }

    // Damage slimes in path
    let hitCount = 0;
    slimes.forEach((slime) => {
      // Distance from line segment (startX, startY) to (p.x, p.y)
      const A = p.x - startX;
      const B = p.y - startY;
      const lenSq = A * A + B * B;
      let param = -1;
      if (lenSq !== 0) {
        const xx = slime.x - startX;
        const yy = slime.y - startY;
        param = (xx * A + yy * B) / lenSq;
      }

      let closestX, closestY;
      if (param < 0) {
        closestX = startX;
        closestY = startY;
      } else if (param > 1) {
        closestX = p.x;
        closestY = p.y;
      } else {
        closestX = startX + param * A;
        closestY = startY + param * B;
      }

      const distDx = slime.x - closestX;
      const distDy = slime.y - closestY;
      const distance = Math.sqrt(distDx * distDx + distDy * distDy);

      if (distance < slime.radius + p.radius + 15) {
        slime.hp -= 30;
        slime.flashFrames = 5;
        hitCount++;
        // Minor knockback away from player's final position
        const angle = Math.atan2(slime.y - p.y, slime.x - p.x);
        slime.x += Math.cos(angle) * 15;
        slime.y += Math.sin(angle) * 15;

        spawnFloatingText(slime.x, slime.y - 10, "30", "#a855f7");
        spawnHitParticles(slime.x, slime.y, "#a855f7", 5);
      }
    });

    if (hitCount > 0) {
      SoundFX.playHit();
    }
  };

  // Skill 4: Meteor Ground Slam
  const executeSlam = () => {
    const p = gameStateRef.current.player;
    SoundFX.playSlam();

    // Create screenshake
    gameStateRef.current.slimes.forEach((slime) => {
      // Calculate distance
      const dx = slime.x - p.x;
      const dy = slime.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deals scale damage based on distance
      const slamRange = 250;
      if (dist < slamRange) {
        const damage = Math.round(50 * (1 - dist / slamRange));
        if (damage > 5) {
          slime.hp -= damage;
          slime.flashFrames = 6;
          // Massive knockback
          const angle = Math.atan2(dy, dx);
          slime.x += Math.cos(angle) * 45 * (1 - dist / slamRange);
          slime.y += Math.sin(angle) * 45 * (1 - dist / slamRange);

          spawnFloatingText(slime.x, slime.y - 10, `${damage}`, "#ef4444");
          spawnHitParticles(slime.x, slime.y, "#ef4444", 6);
        }
      }
    });

    // Ring slam waves
    for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
      gameStateRef.current.particles.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * 4.5,
        vy: Math.sin(angle) * 4.5,
        color: "#ef4444",
        radius: 4,
        alpha: 1,
        decay: 0.03,
      });
    }
  };

  // Combos Execution
  const executeFireFan = () => {
    setActiveCombo("FIRE FAN!");
    setTimeout(() => setActiveCombo(null), 1500);

    spawnFloatingText(gameStateRef.current.player.x, gameStateRef.current.player.y - 30, "FIRE FAN!", "#f97316");

    executeFireball(-0.25, 1.2);
    executeFireball(0, 1.3);
    executeFireball(0.25, 1.2);
  };

  const executeThunderRush = () => {
    setActiveCombo("THUNDER RUSH!");
    setTimeout(() => setActiveCombo(null), 1500);

    const p = gameStateRef.current.player;
    spawnFloatingText(p.x, p.y - 30, "THUNDER RUSH!", "#eab308");
    
    // Performs two consecutive fast dashes
    executeDash();
    setTimeout(() => {
      executeDash();
      // Lightning storm trigger at end of rush
      SoundFX.playSlam();
      gameStateRef.current.slimes.forEach((slime) => {
        const dx = slime.x - p.x;
        const dy = slime.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          slime.hp -= 40;
          slime.flashFrames = 5;
          spawnFloatingText(slime.x, slime.y - 10, "40 ⚡", "#eab308");
          spawnHitParticles(slime.x, slime.y, "#eab308", 8);
        }
      });
    }, 120);
  };

  const executeDivineAegis = () => {
    setActiveCombo("DIVINE AEGIS!");
    setTimeout(() => setActiveCombo(null), 1500);

    const p = gameStateRef.current.player;
    SoundFX.playShield();
    SoundFX.playHeal();

    // Healing
    gameStateRef.current.playerHp = Math.min(100, gameStateRef.current.playerHp + 30);
    setPlayerHp(gameStateRef.current.playerHp);
    spawnFloatingText(p.x, p.y - 30, "+30 HP", "#3b82f6");

    // Shield trigger
    p.shieldTime = p.shieldMaxTime;

    // Glowing shield rings
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      gameStateRef.current.particles.push({
        x: p.x + Math.cos(angle) * 20,
        y: p.y + Math.sin(angle) * 20,
        vx: Math.cos(angle) * 1.5,
        vy: Math.sin(angle) * 1.5,
        color: "#3b82f6",
        radius: 3,
        alpha: 0.9,
        decay: 0.02,
      });
    }
  };

  const triggerSkill = React.useCallback((skillNum: number) => {
    if (!isPlaying || isGameOver) return;
    const state = gameStateRef.current;
    
    // Check cooldown
    if (state.cooldownTimers[skillNum as 1|2|3|4] > 0) return;

    // Reset cooldown timer
    state.cooldownTimers[skillNum as 1|2|3|4] = state.cooldownMax[skillNum as 1|2|3|4];

    // Push to combo history
    state.comboHistory.push(skillNum);
    if (state.comboHistory.length > 3) {
      state.comboHistory.shift();
    }
    state.comboTimeout = 120; // 2 seconds to chain combo

    // Check for unique combos
    const comboStr = state.comboHistory.join("");
    const twoKeyCombo = state.comboHistory.slice(-2).join("");
    let triggeredCombo = false;

    if (twoKeyCombo === "31") {
      // Combo: Dash & Slice (Shadow Strike)
      triggeredCombo = true;
      executeDashAndSlice();
    } else if (comboStr === "111") {
      // Combo: Grand Tempest (Wind Slashes)
      triggeredCombo = true;
      executeGrandTempest();
    } else if (comboStr === "112") {
      // Combo: Fire Fan
      triggeredCombo = true;
      executeFireFan();
    } else if (comboStr === "313") {
      // Combo: Thunder Rush
      triggeredCombo = true;
      executeThunderRush();
    } else if (comboStr === "134") {
      // Combo: Divine Aegis
      triggeredCombo = true;
      executeDivineAegis();
    }

    if (triggeredCombo) {
      state.comboHistory = []; // Reset after trigger
    } else {
      // Execute normal skill if no combo is formed
      if (skillNum === 1) executeSlash();
      else if (skillNum === 2) executeFireball();
      else if (skillNum === 3) executeDash();
      else if (skillNum === 4) executeSlam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isGameOver]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      
      // Prevent browser default scroll for game control keys
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "1", "2", "3", "4"].includes(k)) {
        e.preventDefault();
      }

      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keysRef.current[k] = true;
      }

      // Spacebar triggers basic Normal Attack
      if (e.key === " ") {
        executeNormalAttack();
      }

      // Action Keys: 1, 2, 3, 4
      if (["1", "2", "3", "4"].includes(e.key)) {
        triggerSkill(parseInt(e.key, 10));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keysRef.current[k] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isGameOver, triggerSkill]);

  const startNewGame = () => {
    // Make sure Audio Context is active on user click
    SoundFX.playHeal();

    gameStateRef.current = {
      player: {
        x: 400,
        y: 240,
        vx: 0,
        vy: 0,
        radius: 15,
        speed: 3.5,
        facing: "down",
        shieldTime: 0,
        shieldMaxTime: 180,
        lastSlashTime: 0,
        swordAngle: 0,
        slashActive: false,
        slashDuration: 10,
        slashTimer: 0,
        slashColor: "#ffffff",
        slashSize: 58,
      },
      playerHp: 100,
      score: 0,
      highScore: highScore,
      slimes: [],
      projectiles: [],
      particles: [],
      floatingTexts: [],
      hitSparks: [],
      obstacles: gameStateRef.current.obstacles,
      cooldownTimers: { 1: 0, 2: 0, 3: 0, 4: 0 },
      cooldownMax: { 1: 20, 2: 80, 3: 180, 4: 500 },
      comboHistory: [],
      comboTimeout: 0,
      spawnTimer: 0,
      bossSpawnTimer: 0,
    };

    setScore(0);
    setPlayerHp(100);
    setIsGameOver(false);
    setIsPlaying(true);
    setActiveCombo(null);
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mouse click performs basic attack
    const handleCanvasClick = (e: MouseEvent) => {
      e.preventDefault();
      executeNormalAttack();
    };
    canvas.addEventListener("mousedown", handleCanvasClick);

    const updateGame = () => {
      const state = gameStateRef.current;
      const p = state.player;

      // 1. Cooldown Ticks
      for (const key in state.cooldownTimers) {
        const id = parseInt(key, 10) as 1|2|3|4;
        if (state.cooldownTimers[id] > 0) {
          state.cooldownTimers[id]--;
        }
      }

      // Sync cooldown percentage to React state every 5 frames for rendering
      if (Math.random() < 0.2) {
        setCooldowns({
          1: (state.cooldownTimers[1] / state.cooldownMax[1]) * 100,
          2: (state.cooldownTimers[2] / state.cooldownMax[2]) * 100,
          3: (state.cooldownTimers[3] / state.cooldownMax[3]) * 100,
          4: (state.cooldownTimers[4] / state.cooldownMax[4]) * 100,
        });
      }

      // 2. Combo Timer Decay
      if (state.comboTimeout > 0) {
        state.comboTimeout--;
        if (state.comboTimeout === 0) {
          state.comboHistory = [];
        }
      }

      // 3. Player Movement Physics
      let dx = 0;
      let dy = 0;

      if (keysRef.current["w"] || keysRef.current["arrowup"]) dy = -1;
      if (keysRef.current["s"] || keysRef.current["arrowdown"]) dy = 1;
      if (keysRef.current["a"] || keysRef.current["arrowleft"]) dx = -1;
      if (keysRef.current["d"] || keysRef.current["arrowright"]) dx = 1;

      // Normalise vector for diagonal movement speed constancy
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      p.vx = dx * p.speed;
      p.vy = dy * p.speed;

      p.x += p.vx;
      p.y += p.vy;

      // Keep Player within board borders
      p.x = Math.max(p.radius + 10, Math.min(canvas.width - p.radius - 10, p.x));
      p.y = Math.max(p.radius + 10, Math.min(canvas.height - p.radius - 10, p.y));

      // Player vs Obstacles collision
      state.obstacles.forEach((obs) => {
        const oDx = p.x - obs.x;
        const oDy = p.y - obs.y;
        const oDist = Math.hypot(oDx, oDy);
        const minDist = p.radius + obs.radius;
        if (oDist < minDist) {
          const angle = Math.atan2(oDy, oDx);
          p.x = obs.x + Math.cos(angle) * minDist;
          p.y = obs.y + Math.sin(angle) * minDist;
        }
      });

      // Determine facing direction
      if (dx > 0) p.facing = "right";
      else if (dx < 0) p.facing = "left";
      else if (dy > 0) p.facing = "down";
      else if (dy < 0) p.facing = "up";

      // Slash rotation animation frame tick
      if (p.slashActive) {
        p.slashTimer--;
        // Sweep arc motion
        const sweepSpeed = Math.PI / p.slashDuration;
        if (p.facing === "right" || p.facing === "down") {
          p.swordAngle += sweepSpeed;
        } else {
          p.swordAngle -= sweepSpeed;
        }

        if (p.slashTimer <= 0) {
          p.slashActive = false;
        }
      }

      // Decrement player shield invulnerability
      if (p.shieldTime > 0) {
        p.shieldTime--;
      }

      // 4. Projectiles Physics Update
      state.projectiles.forEach((proj, idx) => {
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.life--;

        // Slime Collision detection
        state.slimes.forEach((slime) => {
          const sDx = slime.x - proj.x;
          const sDy = slime.y - proj.y;
          const sDist = Math.sqrt(sDx * sDx + sDy * sDy);

          if (sDist < slime.radius + proj.radius) {
            slime.hp -= proj.damage;
            slime.flashFrames = 5;
            proj.life = 0; // kill projectile
            SoundFX.playHit();
            spawnFloatingText(slime.x, slime.y - 10, `${proj.damage}`, "#f97316");
            spawnHitParticles(slime.x, slime.y, "#f97316", 5);

            gameStateRef.current.hitSparks.push({
              id: Math.random().toString(),
              x: slime.x,
              y: slime.y,
              size: slime.isBoss ? 24 : 14,
              life: 8,
            });
          }
        });
      });

      // Filter expired projectiles
      state.projectiles = state.projectiles.filter((p) => p.life > 0);

      // 5. Particles Update
      state.particles.forEach((part) => {
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= part.decay;
      });
      state.particles = state.particles.filter((p) => p.alpha > 0);

      // 6. Floating Texts Update
      state.floatingTexts.forEach((text) => {
        text.y += text.vy;
        text.alpha -= 0.025;
      });
      state.floatingTexts = state.floatingTexts.filter((t) => t.alpha > 0);

      // Hit Sparks Update
      state.hitSparks.forEach((spark) => {
        spark.life--;
      });
      state.hitSparks = state.hitSparks.filter((s) => s.life > 0);

      // 7. Slimes Physics & AI Behavior Update
      state.slimes.forEach((slime) => {
        // Seek player position
        const toPlayerX = p.x - slime.x;
        const toPlayerY = p.y - slime.y;
        const dist = Math.hypot(toPlayerX, toPlayerY);

        // Balanced slime movement speeds
        let slimeSpeed = slime.isBoss ? 0.5 : 0.8;

        // Custom slime hopping logic
        slime.hopTimer++;
        const hopFactor = Math.sin(slime.hopTimer * 0.1);
        if (hopFactor > 0.3) {
          slimeSpeed *= 2.0;
        } else if (hopFactor < -0.3) {
          slimeSpeed = 0;
        }

        if (dist > 5) {
          slime.vx = (toPlayerX / dist) * slimeSpeed;
          slime.vy = (toPlayerY / dist) * slimeSpeed;
        }

        slime.x += slime.vx;
        slime.y += slime.vy;

        // Slime vs Obstacles collision
        state.obstacles.forEach((obs) => {
          const sObsDx = slime.x - obs.x;
          const sObsDy = slime.y - obs.y;
          const sObsDist = Math.hypot(sObsDx, sObsDy);
          const minDist = slime.radius + obs.radius;
          if (sObsDist < minDist) {
            const angle = Math.atan2(sObsDy, sObsDx);
            slime.x = obs.x + Math.cos(angle) * minDist;
            slime.y = obs.y + Math.sin(angle) * minDist;
          }
        });

        // Slime vs Slime separation (avoids clumping)
        state.slimes.forEach((other) => {
          if (other.id === slime.id) return;
          const sSDx = slime.x - other.x;
          const sSDy = slime.y - other.y;
          const sSDist = Math.hypot(sSDx, sSDy);
          const minDist = slime.radius + other.radius;
          if (sSDist < minDist) {
            const overlap = minDist - sSDist;
            const angle = Math.atan2(sSDy, sSDx);
            slime.x += Math.cos(angle) * overlap * 0.5;
            slime.y += Math.sin(angle) * overlap * 0.5;
          }
        });

        if (slime.flashFrames > 0) {
          slime.flashFrames--;
        }

        // Collision with player (deals balanced damage now)
        if (dist < slime.radius + p.radius) {
          if (p.shieldTime <= 0) {
            const dmg = slime.isBoss ? 15 : 6;
            state.playerHp = Math.max(0, state.playerHp - dmg);
            setPlayerHp(state.playerHp);
            p.shieldTime = 40; // hit immunity cooldown frames

            SoundFX.playHurt();
            spawnFloatingText(p.x, p.y - 15, `-${dmg} HP`, "#ef4444");
            spawnHitParticles(p.x, p.y, "#ef4444", 8);

            if (state.playerHp <= 0) {
              handleGameOver();
            }
          }
        }
      });

      // Filter dead slimes and tally score
      const deadSlimes = state.slimes.filter((s) => s.hp <= 0);
      if (deadSlimes.length > 0) {
        deadSlimes.forEach((s) => {
          // Dissolve explosion particles
          spawnHitParticles(s.x, s.y, s.color, s.isBoss ? 15 : 8);
          // Sound
          SoundFX.playHit();
          state.score += s.isBoss ? 5 : 1;
          setScore(state.score);
          if (state.score > state.highScore) {
            state.highScore = state.score;
            setHighScore(state.highScore);
            localStorage.setItem("slime_slayer_highscore", state.highScore.toString());
          }
        });
      }
      state.slimes = state.slimes.filter((s) => s.hp > 0);

      // 8. Slime Spawner Loop
      state.spawnTimer++;
      // Spawn difficulty increases as score scales
      const spawnInterval = Math.max(40, 150 - Math.min(100, state.score * 1.5));
      if (state.spawnTimer >= spawnInterval) {
        state.spawnTimer = 0;
        spawnSlime(false);
      }

      state.bossSpawnTimer++;
      if (state.bossSpawnTimer >= 500) {
        state.bossSpawnTimer = 0;
        spawnSlime(true);
      }
    };

    const spawnSlime = (isBoss: boolean) => {
      const state = gameStateRef.current;
      const size = isBoss ? 24 : 10 + Math.random() * 5;
      const hp = isBoss ? 150 : 25;

      // Spawn on random edges off screen
      let sx = 0;
      let sy = 0;
      const border = Math.floor(Math.random() * 4);

      if (border === 0) {
        // top
        sx = Math.random() * canvas.width;
        sy = -20;
      } else if (border === 1) {
        // right
        sx = canvas.width + 20;
        sy = Math.random() * canvas.height;
      } else if (border === 2) {
        // bottom
        sx = Math.random() * canvas.width;
        sy = canvas.height + 20;
      } else {
        // left
        sx = -20;
        sy = Math.random() * canvas.height;
      }

      state.slimes.push({
        id: Math.random().toString(),
        x: sx,
        y: sy,
        vx: 0,
        vy: 0,
        radius: size,
        hp,
        maxHp: hp,
        color: isBoss ? "#3b82f6" : "#22c55e",
        hopTimer: Math.random() * 50,
        isBoss,
        flashFrames: 0,
      });
    };

    const handleGameOver = () => {
      setIsGameOver(true);
      setIsPlaying(false);
    };

    // RENDERING LOGIC
    const drawGame = () => {
      const state = gameStateRef.current;
      const p = state.player;

      // Clear Screen with clean light grey background (RPG layout matching image)
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid/Floor decoration details (light gridlines matching the image)
      ctx.strokeStyle = "rgba(15, 23, 42, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Obstacles in depth hierarchy
      state.obstacles.forEach((obs) => {
        drawObstacle(ctx, obs);
      });

      // Draw Slimes
      state.slimes.forEach((slime) => {
        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.beginPath();
        ctx.ellipse(slime.x, slime.y + slime.radius * 0.75, slime.radius * 0.9, slime.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Slime body with Hop Squash-and-Stretch
        const hopFactor = Math.sin(slime.hopTimer * 0.1);
        let rx = slime.radius;
        let ry = slime.radius;
        let yOffset = 0;

        if (hopFactor > 0.3) {
          // Stretch vertically during leap
          rx = slime.radius * 0.85;
          ry = slime.radius * 1.15;
          yOffset = -8 * hopFactor; // Lift off ground
        } else if (hopFactor < -0.3) {
          // Squash horizontally on landing
          rx = slime.radius * 1.2;
          ry = slime.radius * 0.8;
        }

        ctx.fillStyle = slime.flashFrames > 0 ? "#ffffff" : slime.color;
        ctx.beginPath();
        ctx.ellipse(slime.x, slime.y + yOffset, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#000000"; // Black border outline for retro RPG style slimes
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Cute Slime Eyes
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        const eyeSpace = rx * 0.35;
        const eyeRadius = rx * 0.12;
        ctx.beginPath();
        ctx.arc(slime.x - eyeSpace, slime.y + yOffset - ry * 0.1, eyeRadius, 0, Math.PI * 2);
        ctx.arc(slime.x + eyeSpace, slime.y + yOffset - ry * 0.1, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Boss Slime Crown
        if (slime.isBoss) {
          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.moveTo(slime.x - 10, slime.y + yOffset - ry - 2);
          ctx.lineTo(slime.x - 15, slime.y + yOffset - ry - 12);
          ctx.lineTo(slime.x - 5, slime.y + yOffset - ry - 7);
          ctx.lineTo(slime.x, slime.y + yOffset - ry - 17);
          ctx.lineTo(slime.x + 5, slime.y + yOffset - ry - 7);
          ctx.lineTo(slime.x + 15, slime.y + yOffset - ry - 12);
          ctx.lineTo(slime.x + 10, slime.y + yOffset - ry - 2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        // Slime Health Bar
        if (slime.hp < slime.maxHp) {
          const barW = slime.radius * 1.6;
          const barH = 3.5;
          const pct = Math.max(0, slime.hp / slime.maxHp);
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(slime.x - barW / 2, slime.y + yOffset - ry - 10, barW, barH);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(slime.x - barW / 2, slime.y + yOffset - ry - 10, barW * pct, barH);
        }
      });

      // Draw Projectiles (Fireball, etc.)
      state.projectiles.forEach((proj) => {
        ctx.fillStyle = proj.color;
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw Particles
      state.particles.forEach((part) => {
        ctx.fillStyle = part.color;
        ctx.globalAlpha = part.alpha;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // reset

      // Draw Player Shield Invuln Glow
      if (p.shieldTime > 0) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
        ctx.lineWidth = 4.0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player Character (Pokemon RPG Knight Style with Outlines)
      ctx.save();
      
      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 15, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bobbing / walking step animation
      const walkBob = p.vx !== 0 || p.vy !== 0 ? Math.sin(Date.now() * 0.015) * 2.2 : 0;

      // Set outline styles
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";

      // 1. FEET
      ctx.fillStyle = "#334155"; // Dark boots
      const leftFootOffset = walkBob > 0 ? -2 : 0;
      const rightFootOffset = walkBob < 0 ? -2 : 0;
      
      // Left foot
      ctx.beginPath();
      ctx.rect(p.x - 8, p.y + 11 + leftFootOffset, 5, 4);
      ctx.fill();
      ctx.stroke();

      // Right foot
      ctx.beginPath();
      ctx.rect(p.x + 3, p.y + 11 + rightFootOffset, 5, 4);
      ctx.fill();
      ctx.stroke();

      // 2. BODY / ARMOR (Red Knight Armor)
      ctx.fillStyle = "#ef4444"; // Red
      ctx.beginPath();
      ctx.roundRect(p.x - 9, p.y - 3 + walkBob, 18, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Arms depending on facing direction
      ctx.fillStyle = "#334155"; // Shoulders / guards
      if (p.facing === "left") {
        ctx.beginPath();
        ctx.roundRect(p.x - 12, p.y + 1 + walkBob, 4, 7, 1);
        ctx.fill();
        ctx.stroke();
      } else if (p.facing === "right") {
        ctx.beginPath();
        ctx.roundRect(p.x + 8, p.y + 1 + walkBob, 4, 7, 1);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.roundRect(p.x - 12, p.y + 1 + walkBob, 4, 7, 1);
        ctx.roundRect(p.x + 8, p.y + 1 + walkBob, 4, 7, 1);
        ctx.fill();
        ctx.stroke();
      }

      // 3. HEAD / HELMET
      ctx.fillStyle = "#ef4444"; // Red helmet
      ctx.beginPath();
      ctx.roundRect(p.x - 11, p.y - 17 + walkBob, 22, 15, 5);
      ctx.fill();
      ctx.stroke();

      // Golden Plume decoration on top
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 17 + walkBob);
      ctx.lineTo(p.x - 3, p.y - 23 + walkBob);
      ctx.lineTo(p.x, p.y - 27 + walkBob);
      ctx.lineTo(p.x + 3, p.y - 21 + walkBob);
      ctx.closePath();
      ctx.fill();

      // Visor Plate
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      let visorX = p.x - 8;
      let visorW = 16;
      if (p.facing === "left") { visorX = p.x - 10; visorW = 14; }
      else if (p.facing === "right") { visorX = p.x - 4; visorW = 14; }
      ctx.roundRect(visorX, p.y - 11 + walkBob, visorW, 6, 1);
      ctx.fill();
      ctx.stroke();

      // Visor slit glowing eyes
      ctx.fillStyle = p.shieldTime > 0 ? "#60a5fa" : "#f43f5e"; // blue if invincible shield active, light red normal
      if (p.facing === "left") {
        ctx.fillRect(p.x - 8, p.y - 9 + walkBob, 3, 2);
      } else if (p.facing === "right") {
        ctx.fillRect(p.x + 5, p.y - 9 + walkBob, 3, 2);
      } else if (p.facing === "up") {
        // Rear view, no eyes visible
      } else {
        // Front view
        ctx.fillRect(p.x - 5, p.y - 9 + walkBob, 3, 2);
        ctx.fillRect(p.x + 2, p.y - 9 + walkBob, 3, 2);
      }

       ctx.restore();

      // Draw Player HP bar directly above player on Canvas (always visible, retro styled)
      const pBarW = 28;
      const pBarH = 4;
      const pPct = Math.max(0, state.playerHp / 100);
      // Track
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(p.x - pBarW / 2, p.y - 34 + walkBob, pBarW, pBarH);
      // Fill
      ctx.fillStyle = pPct > 0.4 ? "#22c55e" : "#ef4444";
      ctx.fillRect(p.x - pBarW / 2, p.y - 34 + walkBob, pBarW * pPct, pBarH);
      // Border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x - pBarW / 2, p.y - 34 + walkBob, pBarW, pBarH);

      // Sword slash visual effect pixelated crescent blade trail matching image reference
      if (p.slashActive) {
        ctx.save();
        const alpha = p.slashTimer / p.slashDuration;
        const R1 = p.slashSize; // outer radius
        const R2 = R1 * 0.62; // inner radius
        const startAng = p.swordAngle - 1.15;
        const endAng = p.swordAngle + 1.15;
        const pixelSize = 4; // retro pixel block size

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
                // If on outer or inner edges, draw pixelated outline in black
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

      // Render Floating Texts
      state.floatingTexts.forEach((ft) => {
        ctx.fillStyle = ft.color;
        ctx.font = "bold 13px sans-serif";
        ctx.globalAlpha = ft.alpha;
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
      });
      ctx.globalAlpha = 1.0; // reset

      // Render Hit Sparks (Pixel Spiky Impact Stars matching image)
      state.hitSparks.forEach((spark) => {
        ctx.save();
        ctx.translate(spark.x, spark.y);
        ctx.fillStyle = spark.life % 2 === 0 ? "#ef4444" : "#facc15"; // alternating red/yellow
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

    const loop = () => {
      updateGame();
      drawGame();
      requestRef.current = requestAnimationFrame(loop);
    };

    // Start loop
    loop();

    return () => {
      canvas.removeEventListener("mousedown", handleCanvasClick);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isGameOver]);

  return (
    <div className="w-full relative select-none">
      {/* Outer Card Wrapper */}
      <div className="w-full bg-card border border-border/60 rounded-3xl overflow-hidden shadow-xl flex flex-col items-center p-4">
        
        {/* Game Title Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-border/50 mb-3 px-2">
          <div className="flex items-center gap-2">
            <Sword className="size-5 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Slime Slayer 2D</h3>
          </div>
          
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl border border-rose-500/20 text-[10px] font-bold transition-colors cursor-pointer mr-1"
              >
                Quit
              </button>
            )}
            {/* Score HUD (Visible when playing) */}
            {isPlaying && (
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-muted-foreground">SCORE: <strong className="text-foreground">{score}</strong></span>
                <span className="text-muted-foreground">TOP: <strong className="text-foreground">{highScore}</strong></span>
              </div>
            )}
            
            <button
              onClick={handleMuteToggle}
              className="p-2 bg-muted hover:bg-muted-foreground/15 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </div>
        </div>

        {/* Canvas Screen Box */}
        <div className="w-full relative aspect-[16/9] max-w-3xl rounded-2xl overflow-hidden border border-border shadow-inner bg-slate-950">
          
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            className="w-full h-full object-cover block"
          />

          {/* 1. START OVERLAY SCREEN */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10 select-none">
              <div className="space-y-4 max-w-md">
                <div className="bg-primary/5 p-3 rounded-2xl border border-border/40 inline-block mb-1">
                  <Sparkles className="size-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Slime Slayer 2D</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Fight off waves of hopping green slimes! Move around and use skill hotkeys to trigger combos.
                </p>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-400">
                  <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1">Controls:</div>
                  <div>🏃‍♂️ <strong>WASD / Arrow Keys</strong> - Move Knight</div>
                  <div>⚔️ <strong>1, 2, 3, 4 Hotkeys</strong> - Skill Attack / Combos</div>
                </div>
                <button
                  onClick={startNewGame}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-lg"
                >
                  <Play className="size-4 fill-current" /> Play Game
                </button>
              </div>
            </div>
          )}

          {/* 2. GAME OVER OVERLAY SCREEN */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10">
              <div className="space-y-4 max-w-sm">
                <div className="text-rose-500 font-bold tracking-wider text-sm uppercase">Defeated</div>
                <h2 className="text-3xl font-black text-white">Game Over</h2>
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-800 my-2">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Slimes Slain</div>
                    <div className="text-2xl font-black text-white">{score}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">High Score</div>
                    <div className="text-2xl font-black text-white">{highScore}</div>
                  </div>
                </div>
                <button
                  onClick={startNewGame}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-lg"
                >
                  <RotateCcw className="size-4" /> Restart Adventure
                </button>
              </div>
            </div>
          )}

          {/* Active Combo Float Banner */}
          {isPlaying && activeCombo && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest animate-bounce z-20 shadow-md">
              🔥 Combo: {activeCombo}
            </div>
          )}
        </div>

        {/* HUD Controls / Cooldowns Overlay Panel */}
        {isPlaying && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 select-none">
            
            {/* Player Health Bar */}
            <div className="flex flex-col justify-center gap-1.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Health Points</span>
              <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-border relative flex p-0.5 shadow-inner">
                <div
                  className="h-full bg-red-500 rounded-lg transition-all duration-100 shadow"
                  style={{ width: `${playerHp}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-slate-200">
                  {playerHp} / 100 HP
                </span>
              </div>
            </div>

            {/* Hotkeys & Cooldown HUD */}
            <div className="flex flex-col justify-center gap-1.5">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Skills Action Bar</span>
              <div className="flex gap-2 justify-start md:justify-center">
                
                {/* Skill 1 */}
                <div className="relative size-10.5 rounded-lg border border-border bg-slate-900 overflow-hidden flex items-center justify-center group" title="Slash (1)">
                  <Sword className="size-5 text-slate-200" />
                  {cooldowns[1] > 0 && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ height: `${cooldowns[1]}%` }} />
                  )}
                  <span className="absolute bottom-0 right-0.5 text-[8px] bg-black/60 px-1 rounded text-slate-400 font-bold">1</span>
                </div>

                {/* Skill 2 */}
                <div className="relative size-10.5 rounded-lg border border-border bg-slate-900 overflow-hidden flex items-center justify-center group" title="Fireball (2)">
                  <Flame className="size-5 text-orange-400" />
                  {cooldowns[2] > 0 && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ height: `${cooldowns[2]}%` }} />
                  )}
                  <span className="absolute bottom-0 right-0.5 text-[8px] bg-black/60 px-1 rounded text-slate-400 font-bold">2</span>
                </div>

                {/* Skill 3 */}
                <div className="relative size-10.5 rounded-lg border border-border bg-slate-900 overflow-hidden flex items-center justify-center group" title="Dash Strike (3)">
                  <Zap className="size-5 text-purple-400" />
                  {cooldowns[3] > 0 && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ height: `${cooldowns[3]}%` }} />
                  )}
                  <span className="absolute bottom-0 right-0.5 text-[8px] bg-black/60 px-1 rounded text-slate-400 font-bold">3</span>
                </div>

                {/* Skill 4 */}
                <div className="relative size-10.5 rounded-lg border border-border bg-slate-900 overflow-hidden flex items-center justify-center group" title="Meteor Slam (4)">
                  <Shield className="size-5 text-rose-400" />
                  {cooldowns[4] > 0 && (
                    <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ height: `${cooldowns[4]}%` }} />
                  )}
                  <span className="absolute bottom-0 right-0.5 text-[8px] bg-black/60 px-1 rounded text-slate-400 font-bold">4</span>
                </div>

              </div>
            </div>

            {/* Combos Guide HUD */}
            <div className="flex flex-col justify-center gap-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Skills Combos Guide</span>
              <div className="bg-muted border border-border/80 rounded-xl px-2.5 py-1.5 text-[9px] text-muted-foreground space-y-0.5 font-medium">
                <div>🔥 <strong className="text-foreground">1-1-2</strong> : Fire Fan (Triple projectile)</div>
                <div>⚡ <strong className="text-foreground">3-1-3</strong> : Thunder Rush (Double shock dash)</div>
                <div>🛡️ <strong className="text-foreground">1-3-4</strong> : Divine Aegis (Heals 30HP + 3s Shield)</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
