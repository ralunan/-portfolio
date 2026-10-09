import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import SpringyBoxes from './SpringyBoxes.jsx';
import { COTTON_CANDY } from './cottonCandy.js';

export default function HeroGradient() {
    return (
        <>
            <ShaderGradientCanvas className="hero-gradient-canvas" pixelDensity={1} fov={45} pointerEvents="none">
                <ShaderGradient control="props" {...COTTON_CANDY} />
            </ShaderGradientCanvas>
            <SpringyBoxes />
        </>
    );
}
