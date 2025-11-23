import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type BlochSphereProps = {
  theta: number;              // Polar [0, π]
  phi: number;                // Azimuth [0, 2π]
  isAnimating?: boolean; 
};

export default function BlochSphere({ theta, phi, isAnimating = false }: Readonly<BlochSphereProps>) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<THREE.ArrowHelper | null>(null);
  const tipRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const isAnimatingRef = useRef(isAnimating);
  const controlsRef = useRef<OrbitControls | null>(null);
  const trailRef = useRef<THREE.Line | null>(null);
  const trailPointsRef = useRef<THREE.Vector3[]>([]);

  // Animációhoz szükséges ref-ek, ezek alapján interpolálunk
  // ? Miért kell interpolálni? 
  // Mert ha hirtelen változik a theta vagy phi (pl. egy kapu hatására),
  // akkor azonnal átugrana az új helyre a nyíl, ami nem szép.
  // Az interpolációval simán, fokozatosan mozog a nyíl az új helyre.
  // Összegezve --> kapunk egy cuki animációt az átmenetről.

  const currentTheta = useRef(theta);
  const currentPhi = useRef(phi);
  const targetTheta = useRef(theta);
  const targetPhi = useRef(phi);

  // Amikor a props változik, frissítjük a célállapotot
  useEffect(() => {
    targetTheta.current = theta;
    targetPhi.current = phi;

    // Új cél esetén töröljük a nyomvonalat, hogy az új mozgás látszódjon
    trailPointsRef.current = [];
  }, [theta, phi]);

  useEffect(() => {

    // -----------------------------------------------------------------------------------------
    // NYILATKOZAT GENERATÍV MI HASZNÁLATÁRÓL:
    // A grafikai megjelenítéshez (Three.js implementáció, 3D színtér, animáció) Generatív MI 
    // segítségét vettem igénybe (Gemini 3 Pro, ChatGPT 5.1), mivel a grafikai programozás nem a 
    // legnagyobb előnyöm illetve a Three.js könyvtár használata számomra új terület. 
    // A generált kódot ellenőriztem és a projekthez igazítottam, helyenként módosítottam.
    // 
    // A prompt: Segíts egy Bloch gömb 3D-s megjelenítésében Three.js segítségével, beleértve a
    // gömböt, egy állapotvektort nyílként, és animációt a nyíl mozgatására a gömb felületén.

    // A mount abban segít, hogy a Three.js-t hova rendereljük 

    const mount = mountRef.current;
    if (!mount) return;

    // Jelenet beállítása
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Kamera beállítása
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);

    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    // Renderer létrehozása, illetve basic grafikai beállítások
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);

    // Renderer hozzáadása a DOM-hoz
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Fények hozzáadása
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(3, 4, 5);
    scene.add(directionalLight);

    // Bloch-gömb csoport létrehozása
    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;
    scene.add(sphereGroup);

    // Átlátszó gömb geometria
    const sphereGeometry = new THREE.SphereGeometry(1, 48, 48);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0088ff,
      opacity: 0.2,
      transparent: true,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereGroup.add(sphereMesh);

    // Drótvázas gömb
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      wireframe: true,
      opacity: 0.3,
      transparent: true,
    });
    const wireframe = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    sphereGroup.add(wireframe);

    // Egyenlítő kör
    const equatorPoints = Array.from({ length: 128 }, (_, i) => {
      const angle = (i / 128) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    });
    const equatorGeometry = new THREE.BufferGeometry().setFromPoints(equatorPoints);
    const equatorMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const equator = new THREE.LineLoop(equatorGeometry, equatorMaterial);
    sphereGroup.add(equator);

    // Koordináta-tengelyek
    const axesHelper = new THREE.AxesHelper(1.5);
    scene.add(axesHelper);

    // Állapotvektor (piros nyíl)
    const dir = new THREE.Vector3(0, 1, 0);
    const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 1, 0xff0000, 0.2, 0.1);
    arrowRef.current = arrow;
    scene.add(arrow);

    // Vektor csúcsa (kis gömb)
    const tipGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const tipMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Arany szín
    const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
    tipRef.current = tipMesh;
    scene.add(tipMesh);

    // Nyomvonal (Trail)
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    trailRef.current = trail;
    scene.add(trail);

    // Kamera vezérlés (egérrel forgatható)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 6;
    controlsRef.current = controls;

    // Generatív MI kód vége
    // ----------------------------------------------------------------------------------------- 

    // Ablakméret változás kezelése
    // Forrás: https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/FirstPersonControls.js
    const handleResize = () => {
      if (!mount || !rendererRef.current) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      rendererRef.current.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Kell egy render loop, a gömb megjelenítéséhez és forgatásához.
    const animate = () => {
      if (sphereGroupRef.current) {
        sphereGroupRef.current.rotation.y += 0.001;
      }

      // Interpoláció, hogy látszódjon az átmenet
      // Forrás: https://cg.iit.bme.hu/portal/oktatott-targyak/szamitogepes-grafika-es-kepfeldolgozas/geometriai-modellezes     
      currentTheta.current += (targetTheta.current - currentTheta.current) * 0.01;
      let deltaPhi = targetPhi.current - currentPhi.current;

      while (deltaPhi > Math.PI) deltaPhi -= 2 * Math.PI;
      while (deltaPhi < -Math.PI) deltaPhi += 2 * Math.PI;
      
      currentPhi.current += deltaPhi * 0.1;

      // Nyíl frissítése az interpolált szögekkel
      if (arrowRef.current) {
        const x = Math.sin(currentTheta.current) * Math.cos(currentPhi.current);
        const y = Math.cos(currentTheta.current);
        const z = Math.sin(currentTheta.current) * Math.sin(currentPhi.current);
        
        const dir = new THREE.Vector3(x, y, z).normalize();
        arrowRef.current.setDirection(dir);
        arrowRef.current.setLength(1, 0.2, 0.1);

        // A mutató nyíl pozija
        if (tipRef.current) tipRef.current.position.set(x, y, z);

        const newPos = new THREE.Vector3(x, y, z);
        const points = trailPointsRef.current;
        
        // Csak akkor adunk hozzá pontot, ha elmozdultunk (hogy ne legyen túl sűrű)
        if (points.length === 0 || (points.at(-1)?.distanceTo(newPos) ?? Infinity) > 0.1) {
          points.push(newPos);
          // Limitáljuk a hosszt, hogy ne legyen végtelen, de elég hosszú legyen a mozgáshoz
          if (points.length > 200) points.shift();
          
          if (trailRef.current) {
            trailRef.current.geometry.setFromPoints(points);
          }
        }
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup 
    // Forrás : https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup 
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      if (controlsRef.current) controlsRef.current.dispose();
      renderer.domElement.remove();
      renderer.dispose();
      sphereGeometry.dispose();
      equatorGeometry.dispose();
      equatorMaterial.dispose();
      wireframeMaterial.dispose();
      sphereMaterial.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      tipGeometry.dispose();
      tipMaterial.dispose();
    };
  }, []);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  return <div ref={mountRef} className="h-full w-full" />;
}
