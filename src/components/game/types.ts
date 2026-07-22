export interface Slime {
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

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  damage: number;
  life: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  alpha: number;
}

export interface HitSpark {
  id: string;
  x: number;
  y: number;
  size: number;
  life: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  facing: "up" | "down" | "left" | "right";
  shieldTime: number;
  shieldMaxTime: number;
  lastSlashTime: number;
  swordAngle: number;
  slashActive: boolean;
  slashDuration: number;
  slashTimer: number;
  slashColor: string;
  slashSize: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface GameState {
  player: Player;
  playerHp: number;
  score: number;
  highScore: number;
  slimes: Slime[];
  projectiles: Projectile[];
  particles: Particle[];
  floatingTexts: FloatingText[];
  hitSparks: HitSpark[];
  obstacles: Obstacle[];
  cooldownTimers: Record<number, number>;
  cooldownMax: Record<number, number>;
  comboHistory: { key: string; time: number }[];
  comboTimeout: number;
  spawnTimer: number;
  bossSpawnTimer: number;
}
