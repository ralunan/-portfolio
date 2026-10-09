// Selected Work shapes (Ron, 2026-10-09): a quieter cousin of the hero's
// springy boxes. Boxes of mixed sizes plus level plus and minus signs each
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
// Shapes per side: uneven on purpose, so the two edges don't mirror.
const PER_SIDE = { left: 3, right: 5 };
// How far each shape drifts from its spot (scene units; the window is ~240 tall).
const DRIFT = 4;
// Seconds for one slow float loop; each shape gets its own pace in this range.
const LOOP = [14, 24];
// The eight shapes, shuffled onto the spots: boxes plus two plus signs and
// a minus (signs stay level).
const KINDS = ['box', 'box', 'box', 'box', 'box', 'plus', 'plus', 'minus'];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// One spot per shape. Heights are random rather than evenly stacked, sizes
// range from small to large, and each side has its own count, so the layout
// reads as loose and a little irregular.
function makeSpots() {
    const kinds = [...KINDS].sort(() => Math.random() - 0.5);
    return [
        [-1, PER_SIDE.left],
        [1, PER_SIDE.right],
    ].flatMap(([side, count]) =>
        Array.from({ length: count }, (_, i) => {
            const kind = kinds.pop();
            // Box sizes skew small with the odd large one; signs stay mid-size
            // so they read as signs.
            const size = kind === 'box' ? 3 + Math.random() ** 2 * 16 : MathUtils.randFloat(9, 15);
            return {
                side,
                kind,
                edge: Math.random() * 0.16, // inset from the edge, share of half-width
                y: 1 - ((i + Math.random()) / count) * 2, // -1..1 down the edge, loosely spread
                size,
                aspect: kind === 'box' ? 0.5 + Math.random() : 1,
                color: pick(COLORS),
                tilt: kind === 'box' ? pick([0, 45, MathUtils.randFloat(10, 35)]) : 0,
                sway: kind === 'box' ? 8 : 3,
                phase: Math.random() * Math.PI * 2,
                speed: (Math.PI * 2) / MathUtils.randFloat(LOOP[0], LOOP[1]),
            };
        }),
    );
}

// A plus is two bars; a minus is one. Bars are a fifth as thick as they are
// long, and thin front to back so the signs read flat even near the edges.
function Shape({ spot }) {
    const { kind, size, aspect, color } = spot;
    const material = <meshStandardMaterial color={color} roughness={0.75} metalness={0.5} />;
    if (kind === 'box') {
        return (
            <mesh>
                <boxGeometry args={[size, size * aspect, 4]} />
                {material}
            </mesh>
        );
    }
    const bar = size / 5;
    return (
        <>
            <mesh>
                <boxGeometry args={[size, bar, 1]} />
                {material}
            </mesh>
            {kind === 'plus' && (
                <mesh>
                    <boxGeometry args={[bar, size, 1]} />
                    {material}
                </mesh>
            )}
        </>
    );
}

function FloatingShape({ spot, halfWidth, halfHeight }) {
    const group = useRef();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime * spot.speed + spot.phase;
        group.current.position.set(
            spot.side * halfWidth * (1 - spot.edge) + Math.sin(t) * DRIFT,
            spot.y * halfHeight * 0.9 + Math.cos(t * 0.8) * DRIFT,
            0,
        );
        group.current.rotation.z = MathUtils.degToRad(spot.tilt + Math.sin(t * 0.6) * spot.sway);
    });
    return (
        <group ref={group}>
            <Shape spot={spot} />
        </group>
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
