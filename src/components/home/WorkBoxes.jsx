// Selected Work boxes (Ron, 2026-10-09): a quieter cousin of the hero's
// springy boxes. A few small boxes each keep their own spot along the left
// and right edges and float slowly around it, instead of reshuffling.
import { useMemo, useRef } from 'react';
import { MathUtils } from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// Same palette as the hero boxes (Charcoal Brew stays out).
const COLORS = [
    '#5B5F8D', // Kyoto Dusk
    '#9BB29E', // Matcha Cream
    '#DA6B51', // Roasted Terracotta
    '#F1DCBA', // Vanilla Foam
];
// Boxes per side.
const PER_SIDE = 6;
// How far each box drifts from its spot (scene units; the window is ~240 tall).
const DRIFT = 4;
// Seconds for one slow float loop; each box gets its own pace in this range.
const LOOP = [14, 24];

// One spot per box: stacked down each edge with a little jitter, so the
// boxes spread out rather than clump.
function makeSpots() {
    return [-1, 1].flatMap((side) =>
        Array.from({ length: PER_SIDE }, (_, i) => {
            const size = 4 + Math.random() * 8;
            return {
                side,
                edge: 0.02 + Math.random() * 0.1, // inset from the edge, share of half-width
                y: 1 - ((i + 0.2 + Math.random() * 0.6) / PER_SIDE) * 2, // -1..1 down the edge
                size: [size, size * (0.6 + Math.random() * 0.8), 4],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                tilt: Math.round(Math.random()) * 45,
                phase: Math.random() * Math.PI * 2,
                speed: (Math.PI * 2) / MathUtils.randFloat(LOOP[0], LOOP[1]),
            };
        }),
    );
}

function FloatingBox({ spot, halfWidth, halfHeight }) {
    const mesh = useRef();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime * spot.speed + spot.phase;
        mesh.current.position.set(
            spot.side * halfWidth * (1 - spot.edge) + Math.sin(t) * DRIFT,
            spot.y * halfHeight * 0.9 + Math.cos(t * 0.8) * DRIFT,
            0,
        );
        mesh.current.rotation.z = MathUtils.degToRad(spot.tilt + Math.sin(t * 0.6) * 8);
    });
    return (
        <mesh ref={mesh}>
            <boxGeometry args={spot.size} />
            <meshStandardMaterial color={spot.color} roughness={0.75} metalness={0.5} />
        </mesh>
    );
}

function Boxes() {
    const { width, height } = useThree((state) => state.viewport);
    const spots = useMemo(makeSpots, []);
    return spots.map((spot, i) => <FloatingBox key={i} spot={spot} halfWidth={width / 2} halfHeight={height / 2} />);
}

export default function WorkBoxes() {
    return (
        <Canvas className="work-boxes-canvas" flat dpr={[1, 1.5]} camera={{ position: [0, 0, 100], fov: 100 }}>
            <pointLight decay={0} intensity={0.5 * Math.PI} />
            <ambientLight intensity={1.85 * Math.PI} />
            <Boxes />
        </Canvas>
    );
}
