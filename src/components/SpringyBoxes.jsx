// Adapted from pmndrs "Springy Boxes" (MIT, github.com/pmndrs/examples):
// flat boxes that spring to new positions, sizes, colors and angles.
import { useRef } from 'react';
import { MathUtils } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSprings, a } from '@react-spring/three';

// Box colors (Ron's Japanese palette). Swap these to retint the animation.
const COLORS = [
    '#5B5F8D', // Kyoto Dusk
    '#9BB29E', // Matcha Cream
    '#DA6B51', // Roasted Terracotta
    '#F1DCBA', // Vanilla Foam
];
const COUNT = 35;
// Seconds between reshuffles (the original demo used 3).
const SHUFFLE_EVERY = 6;
// Heavier, looser spring than the original so each move reads as a slow drift.
const SPRING = { mass: 20, tension: 80, friction: 55 };

const boxes = Array.from({ length: COUNT }, () => [0.1 + Math.random() * 9, 0.1 + Math.random() * 9, 10]);

// `halfWidth` is half the visible scene width (in scene units), so placement
// follows the screen's shape: boxes stay in the right part of the hero, and
// the rightmost ones run slightly past the edge and get cropped.
function random(i, halfWidth) {
    const r = Math.random();
    return {
        position: [halfWidth * (0.2 + Math.random() * 0.9), 80 - Math.random() * 160, i * 1.5],
        color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
        scale: [1 + r * 5, 1 + r * 5, 1],
        rotation: [0, 0, MathUtils.degToRad(Math.round(Math.random()) * 45)],
    };
}

function Boxes() {
    const halfWidth = useThree((state) => state.viewport.width / 2);
    const [springs, api] = useSprings(COUNT, (i) => ({ from: random(i, halfWidth), ...random(i, halfWidth), config: SPRING }));
    // Counted in scene time so a hidden tab doesn't queue up reshuffles.
    const elapsed = useRef(0);
    useFrame((_, delta) => {
        elapsed.current += delta;
        if (elapsed.current >= SHUFFLE_EVERY) {
            elapsed.current = 0;
            api.start((i) => ({ ...random(i, halfWidth), delay: i * 60 }));
        }
    });
    return boxes.map((args, i) => {
        const { color, ...transform } = springs[i];
        return (
            <a.mesh key={i} {...transform} castShadow receiveShadow>
                <boxGeometry args={args} />
                <a.meshStandardMaterial color={color} roughness={0.75} metalness={0.5} />
            </a.mesh>
        );
    });
}

export default function SpringyBoxes() {
    return (
        <Canvas
            className="hero-boxes-canvas"
            flat
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 100], fov: 100 }}
            // Measure layout size, not on-screen size: the hero scales up as it
            // scrolls away, and measuring the scaled box made the canvas resize
            // mid-transition and the boxes jump.
            resize={{ offsetSize: true }}
        >
            <pointLight decay={0} intensity={0.5 * Math.PI} />
            <ambientLight intensity={1.85 * Math.PI} />
            <spotLight
                castShadow
                decay={0}
                intensity={0.2 * Math.PI}
                angle={Math.PI / 7}
                position={[150, 150, 250]}
                penumbra={1}
                shadow-mapSize={2048}
            />
            <Boxes />
        </Canvas>
    );
}
