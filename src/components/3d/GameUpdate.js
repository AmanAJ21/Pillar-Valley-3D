import { useFrame } from '@react-three/fiber';
import { calculateBaseSpeed, calculateTimeBonus, calculateBallScale } from '../../utils/gameUtils';
import { CONFIG } from '../../config/gameConfig';

/**
 * Game Update Component - Handles delta-based game logic updates
 */
export default function GameUpdate({ game, setGame, endGame }) {
  useFrame((state, delta) => {
    if (!game.playing || game.paused) return;

    // Limit delta to prevent large jumps on mobile when app resumes
    const clampedDelta = Math.min(delta, 1/30);

    setGame(prevGame => {
      // Rotation with enhanced responsiveness
      const angleIncrement = prevGame.ballSpeed * prevGame.ballDirection * clampedDelta * 60 * 1.4;
      const oldAngle = prevGame.ballAngle;
      const newAngle = (oldAngle + angleIncrement) % 360;
      
      // Check if we completed a full 360° rotation (more accurate detection)
      const completedRotation = (oldAngle > newAngle && oldAngle > 270 && newAngle < 90) ||
                               (oldAngle < 90 && newAngle > 270 && prevGame.ballDirection < 0);
      
      // Update rotation count and ball scale
      let newRotationCount = prevGame.rotationCount || 0;
      let newScale = prevGame.ballScale;
      
      if (completedRotation) {
        newRotationCount += 1;
        // Ball shrinking: 5% reduction every 360° rotation
        if (newScale > 0.2) { // Minimum scale of 20%
          newScale = Math.max(0.2, prevGame.ballScale * 0.95); // 5% shrink
          // Ball scale updated after rotation
        }
      }

      // End game if ball becomes too small
      if (newScale <= 0.2) {
        // Game over: Ball too small
        endGame();
        return prevGame;
      }

      // Time tracking for pillar-based mechanics
      const newTimeOnPillar = prevGame.timeOnCurrentPillar + (clampedDelta * 1000);

      return {
        ...prevGame,
        ballAngle: newAngle,
        ballSpeed: prevGame.ballSpeed, // Speed is updated when reaching pillars
        ballScale: newScale,
        timeOnCurrentPillar: newTimeOnPillar,
        rotationCount: newRotationCount
      };
    });
  });

  return null;
}