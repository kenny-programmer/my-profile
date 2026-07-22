import { SoundFX } from "./sound-fx";
import { GameState, Slime, Projectile, Particle, FloatingText, HitSpark } from "./types";

export const spawnFloatingText = (state: GameState, x: number, y: number, text: string, color: string) => {
  state.floatingTexts.push({
    id: Math.random().toString(),
    x,
    y,
    text,
    color,
    vy: -1.2,
    alpha: 1,
  });
};

export const spawnHitParticles = (state: GameState, x: number, y: number, color: string, count: number = 8) => {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    state.particles.push({
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

export const executeNormalAttack = (state: GameState, isPlaying: boolean, isGameOver: boolean) => {
  if (!isPlaying || isGameOver) return;
  const p = state.player;
  const now = Date.now();

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

        spawnFloatingText(state, slime.x, slime.y - 10, "15", "#ffffff");
        spawnHitParticles(state, slime.x, slime.y, "#ffffff", 4);

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

export const executeDashAndSlice = (state: GameState, setActiveCombo: (combo: string | null) => void) => {
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

      spawnFloatingText(state, slime.x, slime.y - 12, "SHADOW SLICE 45 ⚔️", "#c084fc");
      spawnHitParticles(state, slime.x, slime.y, "#c084fc", 10);

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

export const executeGrandTempest = (state: GameState, setActiveCombo: (combo: string | null) => void) => {
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

export const executeSlash = (state: GameState) => {
  const p = state.player;
  p.slashActive = true;
  p.slashTimer = p.slashDuration;
  p.slashColor = "#22c55e";
  p.slashSize = 64;

  if (p.facing === "right") p.swordAngle = -0.5 * Math.PI;
  else if (p.facing === "left") p.swordAngle = 0.5 * Math.PI;
  else if (p.facing === "up") p.swordAngle = Math.PI;
  else p.swordAngle = 0;

  SoundFX.playSlash();

  const slashRange = 55;
  let hitCount = 0;

  state.slimes.forEach((slime) => {
    const dx = slime.x - p.x;
    const dy = slime.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < slashRange) {
      let isFacing = false;
      if (p.facing === "right" && dx > -10) isFacing = true;
      if (p.facing === "left" && dx < 10) isFacing = true;
      if (p.facing === "up" && dy < 10) isFacing = true;
      if (p.facing === "down" && dy > -10) isFacing = true;

      if (isFacing) {
        slime.hp -= 20;
        slime.flashFrames = 5;
        hitCount++;
        const angle = Math.atan2(dy, dx);
        slime.x += Math.cos(angle) * 35;
        slime.y += Math.sin(angle) * 35;

        spawnFloatingText(state, slime.x, slime.y - 10, "20", "#22c55e");
        spawnHitParticles(state, slime.x, slime.y, "#22c55e", 5);

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

export const executeFireball = (state: GameState, angleOffset = 0, speedMult = 1) => {
  const p = state.player;
  SoundFX.playFireball();

  let angle = 0;
  if (p.facing === "right") angle = 0;
  else if (p.facing === "left") angle = Math.PI;
  else if (p.facing === "up") angle = -Math.PI / 2;
  else angle = Math.PI / 2;

  angle += angleOffset;

  const speed = 6 * speedMult;
  state.projectiles.push({
    x: p.x,
    y: p.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 6,
    color: "#f97316",
    damage: 35,
    life: 120,
  });
};

export const executeDash = (state: GameState) => {
  const p = state.player;
  const slimes = state.slimes;
  SoundFX.playDash();

  let dx = 0;
  let dy = 0;
  if (p.facing === "right") dx = 1;
  else if (p.facing === "left") dx = -1;
  else if (p.facing === "up") dy = -1;
  else dy = 1;

  const dashDist = 120;
  const startX = p.x;
  const startY = p.y;

  p.x = Math.max(20, Math.min(780, p.x + dx * dashDist));
  p.y = Math.max(20, Math.min(460, p.y + dy * dashDist));

  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const tx = startX + (p.x - startX) * t;
    const ty = startY + (p.y - startY) * t;
    state.particles.push({
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

  let hitCount = 0;
  slimes.forEach((slime) => {
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
      const angle = Math.atan2(slime.y - p.y, slime.x - p.x);
      slime.x += Math.cos(angle) * 15;
      slime.y += Math.sin(angle) * 15;

      spawnFloatingText(state, slime.x, slime.y - 10, "30", "#a855f7");
      spawnHitParticles(state, slime.x, slime.y, "#a855f7", 5);
    }
  });

  if (hitCount > 0) {
    SoundFX.playHit();
  }
};

export const executeSlam = (state: GameState) => {
  const p = state.player;
  SoundFX.playSlam();

  state.slimes.forEach((slime) => {
    const dx = slime.x - p.x;
    const dy = slime.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const slamRange = 250;
    if (dist < slamRange) {
      const damage = Math.round(50 * (1 - dist / slamRange));
      if (damage > 5) {
        slime.hp -= damage;
        slime.flashFrames = 6;
        const angle = Math.atan2(dy, dx);
        slime.x += Math.cos(angle) * 45 * (1 - dist / slamRange);
        slime.y += Math.sin(angle) * 45 * (1 - dist / slamRange);

        spawnFloatingText(state, slime.x, slime.y - 10, `${damage}`, "#ef4444");
        spawnHitParticles(state, slime.x, slime.y, "#ef4444", 6);
      }
    }
  });

  for (let angle = 0; angle < Math.PI * 2; angle += 0.25) {
    state.particles.push({
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

export const executeFireFan = (state: GameState, setActiveCombo: (combo: string | null) => void) => {
  setActiveCombo("FIRE FAN!");
  setTimeout(() => setActiveCombo(null), 1500);

  spawnFloatingText(state, state.player.x, state.player.y - 30, "FIRE FAN!", "#f97316");

  executeFireball(state, -0.25, 1.2);
  executeFireball(state, 0, 1.3);
  executeFireball(state, 0.25, 1.2);
};

export const executeThunderRush = (state: GameState, setActiveCombo: (combo: string | null) => void) => {
  setActiveCombo("THUNDER RUSH!");
  setTimeout(() => setActiveCombo(null), 1500);

  const p = state.player;
  spawnFloatingText(state, p.x, p.y - 30, "THUNDER RUSH!", "#eab308");

  executeDash(state);
  setTimeout(() => {
    executeDash(state);
    SoundFX.playSlam();
    state.slimes.forEach((slime) => {
      const dx = slime.x - p.x;
      const dy = slime.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        slime.hp -= 40;
        slime.flashFrames = 5;
        spawnFloatingText(state, slime.x, slime.y - 10, "40 ⚡", "#eab308");
        spawnHitParticles(state, slime.x, slime.y, "#eab308", 8);
      }
    });
  }, 120);
};

export const executeDivineAegis = (
  state: GameState,
  setPlayerHp: (hp: number) => void,
  setActiveCombo: (combo: string | null) => void
) => {
  setActiveCombo("DIVINE AEGIS!");
  setTimeout(() => setActiveCombo(null), 1500);

  const p = state.player;
  SoundFX.playShield();
  SoundFX.playHeal();

  state.playerHp = Math.min(100, state.playerHp + 30);
  setPlayerHp(state.playerHp);
  spawnFloatingText(state, p.x, p.y - 30, "+30 HP", "#3b82f6");

  p.shieldTime = p.shieldMaxTime;

  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    state.particles.push({
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

export const triggerSkill = (
  state: GameState,
  skillNum: number,
  isPlaying: boolean,
  isGameOver: boolean,
  setCooldowns: React.Dispatch<React.SetStateAction<Record<number, number>>>,
  setActiveCombo: (combo: string | null) => void,
  setPlayerHp: (hp: number) => void
) => {
  if (!isPlaying || isGameOver) return;

  if (state.cooldownTimers[skillNum as 1 | 2 | 3 | 4] > 0) return;

  state.cooldownTimers[skillNum as 1 | 2 | 3 | 4] = state.cooldownMax[skillNum as 1 | 2 | 3 | 4];

  state.comboHistory.push({ key: skillNum.toString(), time: Date.now() });

  const now = Date.now();
  state.comboHistory = state.comboHistory.filter((item) => now - item.time < 1600);
  const comboStr = state.comboHistory.map((item) => item.key).join("");
  const twoKeyCombo = state.comboHistory.slice(-2).map((item) => item.key).join("");

  let triggeredCombo = false;

  if (twoKeyCombo === "31") {
    triggeredCombo = true;
    executeDashAndSlice(state, setActiveCombo);
  } else if (comboStr === "111") {
    triggeredCombo = true;
    executeGrandTempest(state, setActiveCombo);
  } else if (comboStr === "112") {
    triggeredCombo = true;
    executeFireFan(state, setActiveCombo);
  } else if (comboStr === "313") {
    triggeredCombo = true;
    executeThunderRush(state, setActiveCombo);
  } else if (comboStr === "134") {
    triggeredCombo = true;
    executeDivineAegis(state, setPlayerHp, setActiveCombo);
  }

  if (triggeredCombo) {
    state.comboHistory = [];
  } else {
    if (skillNum === 1) executeSlash(state);
    else if (skillNum === 2) executeFireball(state);
    else if (skillNum === 3) executeDash(state);
    else if (skillNum === 4) executeSlam(state);
  }
};

export const spawnSlime = (state: GameState, canvasWidth: number, canvasHeight: number, isBoss: boolean) => {
  const size = isBoss ? 24 : 10 + Math.random() * 5;
  const hp = isBoss ? 150 : 25;

  let sx = 0;
  let sy = 0;
  const border = Math.floor(Math.random() * 4);

  if (border === 0) {
    sx = Math.random() * canvasWidth;
    sy = -20;
  } else if (border === 1) {
    sx = canvasWidth + 20;
    sy = Math.random() * canvasHeight;
  } else if (border === 2) {
    sx = Math.random() * canvasWidth;
    sy = canvasHeight + 20;
  } else {
    sx = -20;
    sy = Math.random() * canvasHeight;
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

export const updateGameLoop = (
  state: GameState,
  keys: Record<string, boolean>,
  canvasWidth: number,
  canvasHeight: number,
  setPlayerHp: (hp: number) => void,
  setScore: (score: number) => void,
  setIsGameOver: (gameOver: boolean) => void,
  setCooldowns: React.Dispatch<React.SetStateAction<Record<number, number>>>,
  highScore: number,
  setHighScore: (highScore: number) => void
) => {
  const p = state.player;

  for (const key in state.cooldownTimers) {
    const id = parseInt(key, 10) as 1 | 2 | 3 | 4;
    if (state.cooldownTimers[id] > 0) {
      state.cooldownTimers[id]--;
    }
  }

  if (Math.random() < 0.2) {
    setCooldowns({
      1: (state.cooldownTimers[1] / state.cooldownMax[1]) * 100,
      2: (state.cooldownTimers[2] / state.cooldownMax[2]) * 100,
      3: (state.cooldownTimers[3] / state.cooldownMax[3]) * 100,
      4: (state.cooldownTimers[4] / state.cooldownMax[4]) * 100,
    });
  }

  if (state.comboTimeout > 0) {
    state.comboTimeout--;
    if (state.comboTimeout === 0) {
      state.comboHistory = [];
    }
  }

  let dx = 0;
  let dy = 0;
  if (keys["w"] || keys["arrowup"]) dy = -1;
  if (keys["s"] || keys["arrowdown"]) dy = 1;
  if (keys["a"] || keys["arrowleft"]) dx = -1;
  if (keys["d"] || keys["arrowright"]) dx = 1;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  p.vx = dx * p.speed;
  p.vy = dy * p.speed;

  p.x += p.vx;
  p.y += p.vy;

  p.x = Math.max(p.radius + 10, Math.min(canvasWidth - p.radius - 10, p.x));
  p.y = Math.max(p.radius + 10, Math.min(canvasHeight - p.radius - 10, p.y));

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

  if (dx > 0) p.facing = "right";
  else if (dx < 0) p.facing = "left";
  else if (dy > 0) p.facing = "down";
  else if (dy < 0) p.facing = "up";

  if (p.slashActive) {
    p.slashTimer--;
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

  if (p.shieldTime > 0) {
    p.shieldTime--;
  }

  state.projectiles.forEach((proj) => {
    proj.x += proj.vx;
    proj.y += proj.vy;
    proj.life--;

    state.slimes.forEach((slime) => {
      const sDx = slime.x - proj.x;
      const sDy = slime.y - proj.y;
      const sDist = Math.sqrt(sDx * sDx + sDy * sDy);

      if (sDist < slime.radius + proj.radius) {
        slime.hp -= proj.damage;
        slime.flashFrames = 5;
        proj.life = 0;
        SoundFX.playHit();
        spawnFloatingText(state, slime.x, slime.y - 10, `${proj.damage}`, "#f97316");
        spawnHitParticles(state, slime.x, slime.y, "#f97316", 5);

        state.hitSparks.push({
          id: Math.random().toString(),
          x: slime.x,
          y: slime.y,
          size: slime.isBoss ? 24 : 14,
          life: 8,
        });
      }
    });
  });
  state.projectiles = state.projectiles.filter((p) => p.life > 0);

  state.particles.forEach((part) => {
    part.x += part.vx;
    part.y += part.vy;
    part.alpha -= part.decay;
  });
  state.particles = state.particles.filter((p) => p.alpha > 0);

  state.floatingTexts.forEach((text) => {
    text.y += text.vy;
    text.alpha -= 0.025;
  });
  state.floatingTexts = state.floatingTexts.filter((t) => t.alpha > 0);

  state.hitSparks.forEach((spark) => {
    spark.life--;
  });
  state.hitSparks = state.hitSparks.filter((s) => s.life > 0);

  state.slimes.forEach((slime) => {
    const toPlayerX = p.x - slime.x;
    const toPlayerY = p.y - slime.y;
    const dist = Math.hypot(toPlayerX, toPlayerY);

    let slimeSpeed = slime.isBoss ? 0.5 : 0.8;

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

    if (dist < slime.radius + p.radius) {
      if (p.shieldTime <= 0) {
        const dmg = slime.isBoss ? 15 : 6;
        state.playerHp = Math.max(0, state.playerHp - dmg);
        setPlayerHp(state.playerHp);
        p.shieldTime = 40;

        SoundFX.playHurt();
        spawnFloatingText(state, p.x, p.y - 15, `-${dmg} HP`, "#ef4444");
        spawnHitParticles(state, p.x, p.y, "#ef4444", 8);

        if (state.playerHp <= 0) {
          setIsGameOver(true);
        }
      }
    }
  });

  const deadSlimes = state.slimes.filter((s) => s.hp <= 0);
  if (deadSlimes.length > 0) {
    deadSlimes.forEach((s) => {
      spawnHitParticles(state, s.x, s.y, s.color, s.isBoss ? 15 : 8);
      SoundFX.playHit();
      state.score += s.isBoss ? 5 : 1;
      setScore(state.score);
      if (state.score > highScore) {
        setHighScore(state.score);
        localStorage.setItem("slime_slayer_highscore", state.score.toString());
      }
    });
  }
  state.slimes = state.slimes.filter((s) => s.hp > 0);

  state.spawnTimer++;
  const spawnInterval = Math.max(40, 150 - Math.min(100, state.score * 1.5));
  if (state.spawnTimer >= spawnInterval) {
    state.spawnTimer = 0;
    spawnSlime(state, canvasWidth, canvasHeight, false);
  }

  state.bossSpawnTimer++;
  if (state.bossSpawnTimer >= 500) {
    state.bossSpawnTimer = 0;
    spawnSlime(state, canvasWidth, canvasHeight, true);
  }
};
