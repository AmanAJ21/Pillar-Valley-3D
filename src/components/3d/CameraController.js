import { useFrame, useThree } from '@react-three/fiber';
import { CONFIG } from '../../config/gameConfig';

export default function CameraController() {
  const { camera } = useThree();

  useFrame(() => {
    // Keep camera fixed at origin
    camera.position.x = 0;
    camera.position.y = CONFIG.CAMERA.Y;
    camera.position.z = CONFIG.CAMERA.Z;

    // Look at center
    camera.lookAt(0, CONFIG.CAMERA.LOOK_Y, 0);
  });

  return null;
}