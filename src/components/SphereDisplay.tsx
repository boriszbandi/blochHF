import React from 'react';
import { Box, Paper, Typography } from "@mui/material";
import BlochSphere from "./BlochSphere";
import { KomplexSzam } from "./MathDisplay";
import { Complex } from "../utils/quantumMath";

type SphereDisplayProps = {
  theta: number;
  phi: number;
  isAnimating: boolean;
  alpha: Complex;
  beta: Complex;
};

export default function SphereDisplay({ theta, phi, isAnimating, alpha, beta }: Readonly<SphereDisplayProps>) {
  return (
    <Box sx={{ width: '60%', position: 'relative', bgcolor: 'black', minWidth: 0, borderRight: '1px solid rgba(255,255,255,0.12)' }}>
      <BlochSphere 
        theta={theta} 
        phi={phi} 
        isAnimating={isAnimating}
      />
      
      {/* Infó adatok a bal felső sarokban */}
      <Box sx={{ position: 'absolute', top: 24, left: 24, display: 'flex', flexDirection: 'column', gap: 1, pointerEvents: 'none' }}>
        <Paper sx={{ bgcolor: 'rgba(30,30,30,0.8)', backdropFilter: 'blur(8px)', px: 2, py: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, letterSpacing: 1 }}>
            Polár
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#26c6da' }}>
            θ = {theta.toFixed(3)}
          </Typography>
        </Paper>
        <Paper sx={{ bgcolor: 'rgba(30,30,30,0.8)', backdropFilter: 'blur(8px)', px: 2, py: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, letterSpacing: 1 }}>
            Azimuth
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#26c6da' }}>
            φ = {phi.toFixed(3)}
          </Typography>
        </Paper>
      </Box>

      {/* Állapotvektor sáv, a gömb alatt */}
      <Paper 
        sx={{ 
          position: 'absolute', 
          bottom: 24, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          bgcolor: 'rgba(30,30,30,0.9)', 
          backdropFilter: 'blur(8px)', 
          px: 3, 
          py: 1.5, 
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 4
        }}
      >
        <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#26c6da', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#9e9e9e', marginRight: 8 }}>|ψ⟩ =</span>
          <KomplexSzam re={alpha.re} im={alpha.im} />
          <span style={{ color: '#9e9e9e', marginLeft: 4 }}>|0⟩</span>
          <span style={{ margin: '0 8px', color: '#757575' }}>+</span>
          <KomplexSzam re={beta.re} im={beta.im} />
          <span style={{ color: '#9e9e9e', marginLeft: 4 }}>|1⟩</span>
        </Typography>
      </Paper>
    </Box>
  );
}
