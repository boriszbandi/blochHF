import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Button, 
  Paper, 
  Chip,
  Stack,  
  TextField,
  InputAdornment
} from "@mui/material";
import { _KAPU_NEVEK } from "../utils/quantumMath";

export type LogEntry = { id: string; name: string };

type ControlPanelProps = {
  szogek: { theta: number; phi: number };
  setSzogek: (val: { theta: number; phi: number }) => void;
  setKapuSorrend: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  animalodikE: boolean;
  kapuKezelo: (gate: string) => void;
  forgatasiSzog: string;
  setForgatasiSzog: (val: string) => void;
  kapuSorrend: LogEntry[];
  animalasKezelo: () => void;
  resetKezelo: () => void;
};

export default function ControlPanel({
  szogek,
  setSzogek,
  setKapuSorrend,
  animalodikE,
  kapuKezelo,
  forgatasiSzog,
  setForgatasiSzog,
  kapuSorrend,
  animalasKezelo,
  resetKezelo
}: Readonly<ControlPanelProps>) {
  return (
    <Paper 
      elevation={0} 
      square 
      sx={{ 
        width: '40%', 
        flexShrink: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        overflowY: 'auto', 
        zIndex: 10,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
        
        {/* 1. Szögbeállítás */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            Állapot Beállítása
          </Typography>
          
          {/* Sliderek */}
          <Stack spacing={2}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">Polár (θ)</Typography>
                <Chip 
                  label={`${Math.round((szogek.theta / Math.PI) * 180)}°`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ fontFamily: 'monospace', color: '#26c6da', borderColor: 'rgba(38,198,218,0.3)' }} 
                />
              </Box>
              <Slider
                value={szogek.theta}
                min={0}
                max={Math.PI}
                step={0.01}
                onChange={(_, val) => {
                  setSzogek({ theta: val, phi: szogek.phi });
                  setKapuSorrend([]);
                }}
                disabled={animalodikE}
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">Azimuth (φ)</Typography>
                <Chip 
                  label={`${Math.round((szogek.phi / Math.PI) * 180)}°`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ fontFamily: 'monospace', color: '#26c6da', borderColor: 'rgba(38,198,218,0.3)' }} 
                />
              </Box>
              <Slider
                value={szogek.phi}
                min={0}
                max={Math.PI * 2}
                step={0.01}
                onChange={(_, val) => {
                  setSzogek({ theta: szogek.theta, phi: val });
                  setKapuSorrend([]);
                }}
                disabled={animalodikE}
              />
            </Box>
          </Stack>
        </Box>

        {/* 2. Kapuk */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            Kapuk
          </Typography>
          
          <Stack spacing={2} sx={{ pl:5 }}>
            {/* Pauli Kapuk */}
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, letterSpacing: 1 }}>
                Pauli Kapuk
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {['X', 'Y', 'Z'].map((gate) => (
                  <Button
                    key={gate}
                    variant="contained"
                    onClick={() => kapuKezelo(gate)}
                    disabled={animalodikE}
                    sx={{ bgcolor: 'rgba(38, 198, 218, 0.2)', color: '#26c6da', border: '1px solid rgba(38, 198, 218, 0.5)', '&:hover': { bgcolor: 'rgba(38, 198, 218, 0.3)' } }}
                  >
                    {gate}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Hadamard */}
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, letterSpacing: 1 }}>
                Hadamard Kapu
              </Typography>
              <Button
                variant="contained"
                onClick={() => kapuKezelo('H')}
                disabled={animalodikE}
                fullWidth
                sx={{ bgcolor: 'rgba(38, 198, 218, 0.2)', color: '#26c6da', border: '1px solid rgba(38, 198, 218, 0.5)', '&:hover': { bgcolor: 'rgba(38, 198, 218, 0.3)' } }}
              >
                Hadamard (H)
              </Button>
            </Box>

            {/* Fázis / Forgatás */}
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, letterSpacing: 1 }}>
                Fázis / Forgatás
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 1 }}>
                <TextField
                  label="Fok"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={forgatasiSzog}
                  onChange={(e) => setForgatasiSzog(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">°</InputAdornment>,
                      style: { fontFamily: 'monospace' }
                    }
                  }}
                />

                {['Rx', 'Ry', 'Rz'].map((gate) => (
                  <Button
                    key={gate}
                    variant="outlined"
                    onClick={() => kapuKezelo(gate)}
                    disabled={animalodikE}
                    sx={{ bgcolor: 'rgba(38, 198, 218, 0.2)', color: '#26c6da', border: '1px solid rgba(38, 198, 218, 0.5)', '&:hover': { bgcolor: 'rgba(38, 198, 218, 0.3)' } }}
                  >
                    {gate}
                  </Button>
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* 3. Előzmények, a kattintott kapukat, végrehajtja */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ mb: 3, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            Előzmények
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              minHeight: 120, 
              bgcolor: 'rgba(0,0,0,0.2)', 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              alignContent: 'flex-start'
            }}
          >
            {kapuSorrend.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic', width: '100%', textAlign: 'center', mt: 4 }}>
                Nincs végrehajtott művelet
              </Typography>
            ) : (
              kapuSorrend.map((entry) => (
                <Chip 
                  key={entry.id} 
                  label={_KAPU_NEVEK[entry.name] || entry.name} 
                  size="small" 
                  sx={{  
                    fontFamily: 'monospace', 
                    bgcolor: '#333', 
                    color: '#26c6da',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} 
                />
              ))
            )}
          </Paper>
        </Box>

      </Box>

      {/* Demo start és reset */}
      <Box sx={{ mt: 'auto', p: 4, borderTop: '1px solid rgba(255,255,255,0.12)', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={animalasKezelo}
          disabled={animalodikE}
          fullWidth                
        >
          {animalodikE ? "Szimuláció fut" : "Demo Futtatása"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={resetKezelo}
          disabled={animalodikE}
          fullWidth
        >
          Alaphelyzet
        </Button>
      </Box>

    </Paper>
  );
}
