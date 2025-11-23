import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Box, Paper, Typography } from "@mui/material";
import { darkTheme } from "./theme";
import SphereDisplay from "./components/SphereDisplay";
import ControlPanel from "./components/ControlPanel";
import { 
  _anglesToState, 
  _stateToAngles, 
  _applyGate, 
  _KAPU_MATRIXOK, 
  _FORGATO_KAPUK, 
  _KEZDO_ALLAPOT, 
  _DEFAULT_ROTATION, 
  _varakozas 
} from "./utils/quantumMath";

// --- "Main" ---
export default function App() {
  const [szogek, setSzogek] = useState(_KEZDO_ALLAPOT);
  const [animalodikE, setAnimalodikE] = useState(false);
  const [kapuSorrend, setKapuSorrend] = useState([]);
  const [forgatasiSzog, setForgatasiSzog] = useState("90");

  useEffect(() => {
    document.title = "Sümegh András Borisz HRHZ34 - Kvantum HF";
  }, []);

  const amplitudok = useMemo(() => _anglesToState(szogek.theta, szogek.phi), [szogek]);

  // Mátrix alapján frissítjük az állapotot
  const frissitesMatrixbol = useCallback((matrix, gateName = null, logGate = true) => {
    setSzogek((prev) => {
      // Jelenlegi állapotvektor
      const currentState = _anglesToState(prev.theta, prev.phi);

      // Új állapotvektor a kapu alkalmazása után
      const nextState = _applyGate(matrix, currentState);

      // Új szögek kiszámítása
      const newAngles = _stateToAngles(nextState);
      return newAngles;
    });

    // Itt felvesszük a kiválasztott kaput az előzmények közé
    if (gateName && logGate) {
      setKapuSorrend((seq) => [...seq, { id: crypto.randomUUID(), name: gateName }]);
    }
  }, []);

  // Kapunak a gombjának a eventhandlere 
  const kapuKezelo = useCallback(
    (gate) => {
      if (animalodikE) return;
      if (_KAPU_MATRIXOK[gate]) {
        frissitesMatrixbol(_KAPU_MATRIXOK[gate], gate, true);
        return;
      }
      if (_FORGATO_KAPUK[gate]) {
        const deg = parseFloat(forgatasiSzog) || 90;
        const rad = (deg * Math.PI) / 180;

        // A forgató kapukhoz az aktuális rotationAngle értéket használjuk, illetve 
        // az előzménybe, az alábbi formátumban szerepeletem: "Rz 90°"
        frissitesMatrixbol(_FORGATO_KAPUK[gate](rad), `${gate} ${deg}°`, true);
      }
    },
    [animalodikE, frissitesMatrixbol, forgatasiSzog]
  );

  // Resetelni az állapotot és az előzményeket
  const resetKezelo = useCallback(() => {
    if (animalodikE) return;
    setSzogek(_KEZDO_ALLAPOT);
    setKapuSorrend([]);
  }, [animalodikE]);

  // Demo szekvencia lejátszása
  const animalasKezelo = useCallback(async () => {
    if (animalodikE) return;
    setAnimalodikE(true);

    // Egy egyszerű példa szekvencia: H -> Rz -> X -> Ry -> Z
    // a delay azért kell, hogy lássuk a változás útját a gömbön
    const sequence = [
      { type: "gate", name: "H", delay: 600 },
      { type: "rotation", name: "Rz", angle: Math.PI / 2, delay: 600 },
      { type: "gate", name: "X", delay: 600 },
      { type: "rotation", name: "Ry", angle: Math.PI, delay: 600 },
      { type: "gate", name: "Z", delay: 600 },
    ];

    // Végigmegyünk a szekvencián és alkalmazzuk a kapukat
    for (const step of sequence) {
      if (step.type === "gate" && _KAPU_MATRIXOK[step.name]) {
        frissitesMatrixbol(_KAPU_MATRIXOK[step.name], step.name, false);
      }
      if (step.type === "rotation" && _FORGATO_KAPUK[step.name]) {
        frissitesMatrixbol(_FORGATO_KAPUK[step.name](step.angle ?? _DEFAULT_ROTATION), step.name, false);
      }
      await _varakozas(step.delay);
    }

    setAnimalodikE(false);
  }, [animalodikE, frissitesMatrixbol]);

  // Az aktuális amplitúdók kinyerése a megjelenítéshez
  const [alfa, beta] = amplitudok;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Fejléc */}
        <Paper 
          elevation={0} 
          square 
          sx={{ 
            height: 25, 
            flexShrink: 0, 
            borderBottom: '1px solid rgba(255,255,255,0.12)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            px: 3,
            zIndex: 20,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Bloch Gömb 
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
            Sümegh András Borisz - HRHZ34
          </Typography>
        </Paper>

        {/* Main */}
        <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
          
          {/* Bal oldalt a Gömb (60%) */}
          <SphereDisplay 
            theta={szogek.theta} 
            phi={szogek.phi} 
            isAnimating={animalodikE}
            alpha={alfa}
            beta={beta}
          />

          {/* JOBB OLDAL: Vezérlők, kapuk, és szim. futtatása (40%) */}
          <ControlPanel 
            szogek={szogek}
            setSzogek={setSzogek}
            setKapuSorrend={setKapuSorrend}
            animalodikE={animalodikE}
            kapuKezelo={kapuKezelo}
            forgatasiSzog={forgatasiSzog}
            setForgatasiSzog={setForgatasiSzog}
            kapuSorrend={kapuSorrend}
            animalasKezelo={animalasKezelo}
            resetKezelo={resetKezelo}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

