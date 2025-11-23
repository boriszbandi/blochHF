# Bloch Gömb Szimulátor

Interaktív 3D vizualizáció a kvantumállapotok (qubitek) és kvantumkapuk megértéséhez.

## Funkciók

- **3D Bloch Gömb**: Valós idejű vizualizáció Three.js segítségével.
- **Kvantum Kapuk**: Pauli-X, Y, Z, Hadamard és forgató kapuk (Rx, Ry, Rz) alkalmazása.
- **Matematikai Háttér**: Állapotvektorok ($|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$) és komplex amplitúdók megjelenítése.
- **Animációk**: Simított átmenetek a kvantumállapotok között.
- **Előzmények**: A végrehajtott műveletek naplózása.

## Technológiák

- **React** (Vite)
- **Three.js** (3D megjelenítés)
- **Material UI** (Felhasználói felület)
- **TypeScript** (Típusbiztonság)

## Telepítés és Futtatás

1. **Klónozás:**
   ```bash
   git clone https://github.com/boriszbandi/blochHF.git
   cd bloch-sim
   ```

2. **Függőségek telepítése:**
   ```bash
   npm install
   ```

3. **Fejlesztői szerver indítása:**
   ```bash
   npm run dev
   ```

4. **Build készítése (Egyetlen HTML fájl):**
   ```bash
   npm run build
   ```
   A kimenet a `dist/index.html` fájl lesz, ami böngészőben közvetlenül megnyitható.

**Sümegh András Borisz** - HRHZ34

