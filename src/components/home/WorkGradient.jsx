import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { COTTON_CANDY } from './cottonCandy.js';

// Selected Work background (Ron, 2026-10-09): the hero's Cotton Candy
// motion, recolored with the Japanese palette washes (Kyoto Dusk, Vanilla
// Foam, Matcha Cream) in place of the Cotton Candy pastels.
const PALETTE_CANDY = {
    ...COTTON_CANDY,
    color1: '#e6e7f0', // --dusk-wash, for Cotton Candy lilac
    color2: '#f8ecd8', // --vanilla-wash, for Cotton Candy mist
    color3: '#e3ebe4', // --matcha-wash, for Cotton Candy sky
    // Brighter than the hero's 1.2 so muted and label text keep 4.5:1.
    brightness: 1.3,
};

export default function WorkGradient() {
    return (
        <ShaderGradientCanvas className="work-gradient-canvas" pixelDensity={1} fov={45} pointerEvents="none">
            <ShaderGradient control="props" {...PALETTE_CANDY} />
        </ShaderGradientCanvas>
    );
}
