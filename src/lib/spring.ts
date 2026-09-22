/**
 * Spring physics helper for natural-feeling animations
 */
export interface SpringConfig {
  stiffness?: number
  damping?: number
  mass?: number
}

export interface SpringState {
  position: number
  velocity: number
}

/**
 * Calculate next spring state (for use in requestAnimationFrame loops)
 */
export function stepSpring(
  state: SpringState,
  target: number,
  config: SpringConfig = {},
  dt = 1 / 60
): SpringState {
  const { stiffness = 170, damping = 26, mass = 1 } = config
  const force = -stiffness * (state.position - target)
  const damper = -damping * state.velocity
  const acceleration = (force + damper) / mass
  const velocity = state.velocity + acceleration * dt
  const position = state.position + velocity * dt
  return { position, velocity }
}

export function isSettled(state: SpringState, target: number, threshold = 0.001): boolean {
  return (
    Math.abs(state.position - target) < threshold &&
    Math.abs(state.velocity) < threshold
  )
}
