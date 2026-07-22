"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Volume2, VolumeX, Shield, Zap, Flame, Sword, Sparkles } from "lucide-react";
import { SoundFX } from "./game/sound-fx";
import { Slime, Projectile, Particle, FloatingText, HitSpark, GameState } from "./game/types";
import { updateGameLoop, triggerSkill, executeNormalAttack } from "./game/engine";
import { drawGameScreen } from "./game/renderer";

export default function GameZone({ onClose }: { onClose?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  // Skill Cooldown States (in percentage remaining, for UI overlay)
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  // Combo HUD notification
  const [activeCombo, setActiveCombo] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Keyboard state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Game Engine Entities (using ref to bypass React re-render lags in requestAnimationFrame)
  const gameStateRef = useRef<GameState>({
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
    highScore: 0,
    slimes: [],
    projectiles: [],
    particles: [],
    floatingTexts: [],
    hitSparks: [],
    obstacles: [
      { id: "server", x: 140, y: 120, radius: 25 },
      { id: "console", x: 280, y: 340, radius: 28 },
      { id: "terminal", x: 620, y: 300, radius: 28 }
    ],
    cooldownTimers: { 1: 0, 2: 0, 3: 0, 4: 0 },
    cooldownMax: { 1: 20, 2: 80, 3: 180, 4: 500 },
    comboHistory: [],
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

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();

      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "1", "2", "3", "4"].includes(k)) {
        e.preventDefault();
      }

      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keysRef.current[k] = true;
      }

      if (e.key === " ") {
        executeNormalAttack(gameStateRef.current, isPlaying, isGameOver);
      }

      if (["1", "2", "3", "4"].includes(e.key)) {
        triggerSkill(
          gameStateRef.current,
          parseInt(e.key, 10),
          isPlaying,
          isGameOver,
          setCooldowns,
          setActiveCombo,
          setPlayerHp
        );
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
  }, [isPlaying, isGameOver]);

  const startNewGame = () => {
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

    const handleCanvasClick = (e: MouseEvent) => {
      e.preventDefault();
      executeNormalAttack(gameStateRef.current, isPlaying, isGameOver);
    };
    canvas.addEventListener("mousedown", handleCanvasClick);

    const updateGame = () => {
      updateGameLoop(
        gameStateRef.current,
        keysRef.current,
        canvas.width,
        canvas.height,
        setPlayerHp,
        setScore,
        setIsGameOver,
        setCooldowns,
        highScore,
        setHighScore
      );
    };

    const drawGame = () => {
      drawGameScreen(
        ctx,
        gameStateRef.current,
        activeCombo,
        canvas.width,
        canvas.height
      );
    };

    const loop = () => {
      updateGame();
      drawGame();
      requestRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      canvas.removeEventListener("mousedown", handleCanvasClick);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isGameOver, activeCombo, highScore]);

  return (
    <div className="w-full relative select-none">
      {/* Outer Card Wrapper */}
      <div className="w-full bg-card border border-border/60 rounded-3xl shadow-xl p-4 flex flex-col items-center">

        {/* Mobile View Message */}
        <div className="flex md:hidden flex-col items-center text-center p-6 space-y-4 max-w-xs select-none">
          <div className="bg-primary/5 p-3 rounded-2xl border border-border/40 inline-block">
            <Sword className="size-8 text-primary animate-bounce" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Desktop Only</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This game is only for Desktop. I am currently working on it to be played on Mobile. Sorry for this!
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow hover:opacity-90 active:scale-95"
            >
              Close
            </button>
          )}
        </div>

        {/* Desktop View Game Board */}
        <div className="hidden md:flex flex-col items-center w-full">
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
          <div className="w-full relative aspect-[16/9] max-w-3xl rounded-2xl overflow-hidden border border-border shadow-inner bg-slate-950 touch-none">

            <canvas
              ref={canvasRef}
              width={800}
              height={480}
              className="w-full h-full object-cover block touch-none"
            />

            {/* 1. START OVERLAY SCREEN */}
            {!isPlaying && !isGameOver && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-3 sm:p-6 z-10 select-none">
                <div className="space-y-2 sm:space-y-4 max-w-md">
                  <div className="hidden sm:inline-block bg-primary/5 p-3 rounded-2xl border border-border/40 mb-1">
                    <Sparkles className="size-8 text-primary animate-pulse" />
                  </div>
                  <h2 className="text-lg sm:text-3xl font-extrabold tracking-tight text-white">Slime Slayer 2D</h2>
                  <p className="hidden sm:block text-xs sm:text-sm text-slate-400">
                    Fight off waves of hopping green slimes! Move around and use skill hotkeys to trigger combos.
                  </p>
                  <div className="hidden sm:block bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-400">
                    <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1">Controls:</div>
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                      <div>
                        <div>🏃‍♂️ <strong>WASD / Arrows</strong> - Move</div>
                        <div>⚔️ <strong>1, 2, 3, 4 / Space</strong> - Skills / ATK</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={startNewGame}
                    className="px-4 py-2 sm:py-3 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-lg text-xs sm:text-sm"
                  >
                    <Play className="size-3.5 fill-current" /> Play Game
                  </button>
                </div>
              </div>
            )}

            {/* 2. GAME OVER OVERLAY SCREEN */}
            {isGameOver && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-3 sm:p-6 z-10">
                <div className="space-y-2 sm:space-y-4 max-w-sm">
                  <div className="hidden sm:block text-rose-500 font-bold tracking-wider text-sm uppercase">Defeated</div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">Game Over</h2>
                  <div className="grid grid-cols-2 gap-4 py-1 border-y border-slate-800 my-1 sm:py-2 sm:my-2">
                    <div className="text-center">
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-semibold uppercase">Slimes Slain</div>
                      <div className="text-lg sm:text-2xl font-black text-white">{score}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-semibold uppercase">High Score</div>
                      <div className="text-lg sm:text-2xl font-black text-white">{highScore}</div>
                    </div>
                  </div>
                  <button
                    onClick={startNewGame}
                    className="px-4 py-2 sm:py-3 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-lg text-xs sm:text-sm"
                  >
                    <RotateCcw className="size-3.5" /> Restart Adventure
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
    </div>
  );
}
