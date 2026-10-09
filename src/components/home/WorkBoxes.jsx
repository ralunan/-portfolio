// Selected Work shapes (Ron, 2026-10-09): a quieter cousin of the hero's
// springy boxes. Squares and rectangles of clearly different sizes each
// keep their own spot along the left and right edges and float slowly
// around it, instead of reshuffling.
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
// Each edge is split into bands, one shape per band. Uneven on purpose, so
// the two edges don't mirror: the lower two of three bands on the left and
// the lower two of five on the right (Ron dropped the top ones).
const BANDS = {
    left: { count: 3, used: [1, 2] },
    right: { count: 5, used: [3, 4] },
};
// How far each shape drifts from its spot (scene units; the window is ~240 tall).
const DRIFT = 4;
// Seconds for one slow float loop; each shape gets its own pace in this range.
const LOOP = [14, 24];
// The shape set, as [width, height] in scene units, shuffled onto the
// spots (four of the eight are used): squares from small to large, plus long, tall and wide rectangles,
// so the sizes clearly vary.
const SHAPES = [
    [28, 28], // large square
    [15, 15], // medium square
    [7, 7], // small square
    [32, 9], // long rectangle
    [10, 26], // tall rectangle
    [22, 13], // wide rectangle
    [14, 6], // small bar
    [20, 20], // medium-large square
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// One spot per shape. Heights are random rather than evenly stacked and each
// side has its own count, so the layout reads as loose and a little irregular.
function makeSpots() {
    const shapes = [...SHAPES].sort(() => Math.random() - 0.5);
    return [
        [-1, BANDS.left],
        [1, BANDS.right],
    ].flatMap(([side, { count, used }]) =>
        used.map((i) => ({
            side,
            size: shapes.pop(),
            inset: Math.random() * 20, // extra distance in from the edge
            y: 1 - ((i + 0.25 + Math.random() * 0.5) / count) * 2, // -1..1 down the edge, one band each so they don't pile up
            color: pick(COLORS),
            tilt: pick([0, 0, 45, MathUtils.randFloat(10, 35)]),
            phase: Math.random() * Math.PI * 2,
            speed: (Math.PI * 2) / MathUtils.randFloat(LOOP[0], LOOP[1]),
        })),
    );
}

// Each shape's center sits a little in from the edge, so at most about a
// fifth of it runs off screen.
function FloatingShape({ spot, halfWidth, halfHeight }) {
    const mesh = useRef();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime * spot.speed + spot.phase;
        mesh.current.position.set(
            spot.side * (halfWidth - spot.size[0] * 0.3 - spot.inset) + Math.sin(t) * DRIFT,
            spot.y * halfHeight * 0.9 + Math.cos(t * 0.8) * DRIFT,
            0,
        );
        mesh.current.rotation.z = MathUtils.degToRad(spot.tilt + Math.sin(t * 0.6) * 8);
    });
    return (
        <mesh ref={mesh}>
            <boxGeometry args={[...spot.size, 4]} />
            <meshStandardMaterial color={spot.color} roughness={0.75} metalness={0.5} />
        </mesh>
    );
}

function Boxes() {
    const { width, height } = useThree((state) => state.viewport);
    const spots = useMemo(makeSpots, []);
    return spots.map((spot, i) => <FloatingShape key={i} spot={spot} halfWidth={width / 2} halfHeight={height / 2} />);
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
