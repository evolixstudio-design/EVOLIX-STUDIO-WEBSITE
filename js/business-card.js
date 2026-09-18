/**
 * EVOLIX STUDIO — 3D DIGITAL BUSINESS CARD
 * Uses Three.js to render a realistic 3D physical card with drag-to-rotate, tap-to-flip, and mouse movement interactions.
 */

function initBusinessCard() {
    const container = document.getElementById('card-3d-container');
    if (!container || typeof THREE === 'undefined') return;

    // Scene Setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25; // Adjusted for card size

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);

    // Card Group
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);

    // Card Dimensions (Standard Business Card Ratio ~ 3.5 x 2)
    const cardWidth = 14;
    const cardHeight = 8;
    const cardThickness = 0.08;
    const radius = 0.5;

    // Helper function to create rounded rect shape
    function createRoundedRectShape(width, height, radius) {
        const x = -width / 2;
        const y = -height / 2;
        const shape = new THREE.Shape();
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.lineTo(x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);
        return shape;
    }

    // Geometry
    const shape = createRoundedRectShape(cardWidth, cardHeight, radius);
    const extrudeSettings = {
        depth: cardThickness,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center(); // Center the geometry

    // Textures
    const textureLoader = new THREE.TextureLoader();
    
    // Materials
    // Create base material for edges
    const edgeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222,
        roughness: 0.4,
        metalness: 0.1
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1
    });

    const backMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1
    });

    // Load textures
    textureLoader.load('/assets/event/note/new-front.png', (tex) => {
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        frontMaterial.map = tex;
        frontMaterial.needsUpdate = true;
    });

    textureLoader.load('/assets/event/note/new-back.png', (tex) => {
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        // The back texture needs to be flipped horizontally because it's on the back face
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = -1;
        backMaterial.map = tex;
        backMaterial.needsUpdate = true;
    });

    // Assign materials to ExtrudeGeometry
    // ExtrudeGeometry faces: 0 is front, 1 is back, others are sides
    const materials = [
        edgeMaterial, // sides
        frontMaterial, // front
        backMaterial // back
    ];

    // Map materials to faces
    geometry.clearGroups();
    geometry.addGroup(0, geometry.index.count, 0); // Default to edges
    
    // In ExtrudeGeometry, we need to map UVs carefully. 
    // For simplicity, we create a plane for front/back and a rounded rect for the core.
    
    // Create Core (Thickness + Edges)
    const coreMesh = new THREE.Mesh(geometry, edgeMaterial);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    cardGroup.add(coreMesh);

    // Create Front Face Plane
    const faceGeo = new THREE.PlaneGeometry(cardWidth - 0.1, cardHeight - 0.1);
    const frontMesh = new THREE.Mesh(faceGeo, frontMaterial);
    frontMesh.position.z = (cardThickness / 2) + 0.041; // Slightly above bevel
    cardGroup.add(frontMesh);

    // Create Back Face Plane
    const backMesh = new THREE.Mesh(faceGeo, backMaterial);
    backMesh.position.z = -(cardThickness / 2) - 0.041;
    backMesh.rotation.y = Math.PI; // Face outwards
    cardGroup.add(backMesh);

    // Interaction State
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    
    // Mouse movement parallax (desktop only)
    let mouseX = 0;
    let mouseY = 0;
    let isFlipped = false;
    let isFlipping = false;

    // Flip animation
    function flipCard() {
        if (isFlipping) return;
        isFlipping = true;
        isFlipped = !isFlipped;
        
        const targetY = isFlipped ? Math.PI : 0;
        
        // Simple animation
        let startY = targetRotation.y % (Math.PI * 2);
        
        // Normalize rotation for smooth flipping
        if (isFlipped && startY < 0) startY += Math.PI * 2;
        
        const duration = 800; // ms
        const startTime = performance.now();
        
        function animateFlip(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            
            targetRotation.y = startY + (targetY - startY) * ease;
            
            if (progress < 1) {
                requestAnimationFrame(animateFlip);
            } else {
                isFlipping = false;
                targetRotation.y = targetY;
            }
        }
        requestAnimationFrame(animateFlip);
    }

    // Event Listeners for Interaction
    const onPointerDown = (e) => {
        isDragging = true;
        previousMousePosition = {
            x: e.touches ? e.touches[0].clientX : e.clientX,
            y: e.touches ? e.touches[0].clientY : e.clientY
        };
        container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
        if (!isDragging) {
            // Parallax effect on hover (only when not dragging)
            if (!e.touches) {
                const x = (e.clientX / window.innerWidth) * 2 - 1;
                const y = -(e.clientY / window.innerHeight) * 2 + 1;
                mouseX = x * 0.2;
                mouseY = y * 0.2;
            }
            return;
        }

        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaMove = {
            x: currentX - previousMousePosition.x,
            y: currentY - previousMousePosition.y
        };

        if (!isFlipping) {
            targetRotation.y += deltaMove.x * 0.01;
            targetRotation.x += deltaMove.y * 0.01;
            
            // Limit X rotation
            targetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotation.x));
        }

        previousMousePosition = { x: currentX, y: currentY };
    };

    const onPointerUp = (e) => {
        isDragging = false;
        container.style.cursor = 'grab';
        
        // Snap back to front or back if not manually rotating significantly
        if (!isFlipping) {
            const normalizedY = ((targetRotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            if (normalizedY > Math.PI / 2 && normalizedY < Math.PI * 1.5) {
                isFlipped = true;
                targetRotation.y = Math.PI;
            } else {
                isFlipped = false;
                targetRotation.y = 0;
            }
            targetRotation.x = 0; // Snap X back to 0
        }
    };

    const onClick = (e) => {
        // Only flip if it was a click without dragging
        if (Math.abs(targetRotation.y - currentRotation.y) < 0.1 && 
            Math.abs(targetRotation.x - currentRotation.x) < 0.1) {
            flipCard();
        }
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('click', onClick);

    // Zoom Logic
    let targetZoom = camera.position.z;
    const minZoom = 12;
    const maxZoom = 40;

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetZoom += e.deltaY * 0.05;
        targetZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
    }, { passive: false });

    let initialPinchDistance = null;
    let initialZoom = targetZoom;

    const getPinchDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialPinchDistance = getPinchDistance(e.touches);
            initialZoom = targetZoom;
            isDragging = false; // Disable rotation while zooming
        } else {
            onPointerDown(e);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialPinchDistance !== null) {
            const currentDistance = getPinchDistance(e.touches);
            const scale = initialPinchDistance / currentDistance;
            targetZoom = initialZoom * scale;
            targetZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
        } else {
            onPointerMove(e);
        }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            initialPinchDistance = null;
        }
        onPointerUp(e);
    });

    // Initial float animation parameters
    let time = 0;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smoothly interpolate current rotation towards target
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

        // Add floating effect and mouse parallax
        const floatY = Math.sin(time) * 0.5;
        
        if (!isDragging && !isFlipping) {
            cardGroup.rotation.x = currentRotation.x + mouseY;
            cardGroup.rotation.y = currentRotation.y + mouseX;
        } else {
            cardGroup.rotation.x = currentRotation.x;
            cardGroup.rotation.y = currentRotation.y;
        }
        
        cardGroup.position.y = floatY;

        // Smooth zoom
        camera.position.z += (targetZoom - camera.position.z) * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBusinessCard);
} else {
    initBusinessCard();
}
