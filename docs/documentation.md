<style>
p {
    text-align: justify;
}
.image-wrapper {
    text-align: center;
    margin: 1.5em 0;
}
.caption {
    font-style: italic;
    font-size: 0.9em;
    color: #555;
    margin-top: 0.5em;
}
.header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}
</style>

<div class="header">
    <span>Sümegh András Borisz</span>
    <span>HRHZ34</span>
</div>

# Kvantum HF - Bloch Gömb Szimulátor

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<script type="text/x-mathjax-config">
    MathJax.Hub.Config({ tex2jax: {inlineMath: [['$', '$']]}, messageStyle: "none" });
</script>

## Bevezetés

Ez a felület egy interaktív webes szimulátor, amely megmutatja, hogyan viselkednek a qubitek a Bloch-gömb segítségével. A program különböző kvantumkapukat (X, Y, Z, Hadamard, forgatásokat) tud alkalmazni.

<div class="image-wrapper">
    <img src="./screenshot.png" width="400" alt="Alkalmazás képernyőképe">
    <div class="caption">A szimulátor főképernyője: bal oldalon a Bloch-gömb, jobb oldalon a vezérlők</div>
</div>

## Mi az a Bloch-gömb?

A qubit állapota a klasszikus bittől eltérően nem csak 0 vagy 1 lehet, hanem ezek szuperpozíciója is. 

$$
|\psi\rangle = \alpha|0\rangle + \beta|1\rangle ,    ahol |\alpha|^2 + |\beta|^2 = 1
$$

A Bloch-gömb egy egységsugarú gömb, amelyen minden pont egy qubit állapotot jelöl. Két szöggel írható le az állapot:

$$
|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle
$$

<div class="image-wrapper">
    <img src="./bloch_sphere.png" width="300" alt="Bloch-gömb ábra">
    <div class="caption">A Bloch-gömb: az északi pólus a |0⟩, a déli pólus a |1⟩ állapot</div>
</div>
<div style="page-break-before: always;"></div>

## Kvantumkapuk

### 1. Pauli-kapuk

**X kapu (NOT):** Megcseréli a |0⟩ és |1⟩ állapotokat (X tengely körüli forgatás)

$$
X = \begin{pmatrix} 0 & 1 \\\\ 1 & 0 \end{pmatrix}
$$

**Y kapu:** Y tengely körüli forgatás

$$
Y = \begin{pmatrix} 0 & -i \\\\ i & 0 \end{pmatrix}
$$

**Z kapu:** Fázisfordítás (Z tengely körüli forgatás)

$$
Z = \begin{pmatrix} 1 & 0 \\\\ 0 & -1 \end{pmatrix}
$$

### 2. Hadamard kapu

$$
H = \frac{1}{\sqrt{2}} \begin{pmatrix} 1 & 1 \\\\ 1 & -1 \end{pmatrix}
$$

### 3. Forgató kapuk

$$
R_x(\phi) = \begin{pmatrix} \cos\frac{\phi}{2} & -i\sin\frac{\phi}{2} \\\\ -i\sin\frac{\phi}{2} & \cos\frac{\phi}{2} \end{pmatrix}
$$

$$
R_y(\phi) = \begin{pmatrix} \cos\frac{\phi}{2} & -\sin\frac{\phi}{2} \\\\ \sin\frac{\phi}{2} & \cos\frac{\phi}{2} \end{pmatrix}
$$

$$
R_z(\phi) = \begin{pmatrix} e^{-i\frac{\phi}{2}} & 0 \\\\ 0 & e^{i\frac{\phi}{2}} \end{pmatrix}
$$

<div class="image-wrapper">
    <img src="./rotations.png" width="400" alt="Forgatások">
    <div class="caption">Példa: 45°-os forgatás az X tengely körül (Rx 45°).</div>
</div>

<div style="page-break-before: always;"></div>

## Használat

A felület két részre oszlik:

**Bal oldal - Bloch Gömb:**
- 3D-s Bloch-gömb
- Piros nyíl + Sárga pötty = aktuális qubit állapot
- Egérrel forgatható és görgővel zoomolható
- Felső sarokban: θ és φ szögek
- Alul: az állapotvektor matematikai alakja

**Jobb oldal - Vezérlők:**
1. **Csúszkák:** θ és φ szögek beállítása
2. **Kapu gombok:** X, Y, Z, H műveletek
3. **Forgatás:** Lehet tetszőleges szögű Rx, Ry, Rz
4. **Előzmények:** A kattintott kapukat jelzi ki.
5. **Demo:** A felvett kapukat animálja a felvétel sorrendjében.

## Megvalósítás

<div style="float: right; margin-left: 20px; margin-bottom: 10px; text-align: center;">
    <img src="./code_structure.png" width="200" alt="Kódstruktúra">
    <div class="caption">A projekt fájlszerkezete</div>
</div>

- **React 19** - Keretrendszer
- **TypeScript** - Jobb mint a javascript 
- **Three.js** - 3D grafika 
- **Material UI** - Modern felhasználói felület
- **Vite** - A készített TSX-eket illetve React komponenseket "compileolja" egy html-lé


## Telepítés és Használat

### 1. Felhasználói verzió
A program használatra kész verziója a `index.html` fájl. Ezt egyszerűen nyissa meg bármilyen böngészőben.

### 2. Dev verzió

*A parancsok futtatásához Node.js környezet szükséges.*

> `git clone https://github.com/boriszbandi/blochHF.git`
> `cd blochHF`
> `npm install`

> `npm run dev`

> `npm run build`


