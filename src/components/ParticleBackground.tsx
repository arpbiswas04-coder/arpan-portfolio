import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export const ParticleBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030014, 0.008);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Post-processing setup
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // Strength
      0.1, // Radius
      1.0  // Threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- Particles Setup (15,000 points) ---
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();

    const origPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(0x001f3f);
    const targetColor = new THREE.Color(0xCCFF00); // Acid Lime

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 220;
      const y = (Math.random() - 0.5) * 160;
      const z = (Math.random() - 0.5) * 160;

      origPositions[i * 3] = x;
      origPositions[i * 3 + 1] = y;
      origPositions[i * 3 + 2] = z;

      currentPositions[i * 3] = x;
      currentPositions[i * 3 + 1] = y;
      currentPositions[i * 3 + 2] = z;

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(currentPositions, 3)
    );
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // --- Energy Lines Setup (530 forward-moving lines) ---
    const lineCount = 530;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineSpeeds = new Float32Array(lineCount);

    for (let i = 0; i < lineCount; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 150;
      const zStart = (Math.random() - 0.5) * 200;
      const lineLength = 5 + Math.random() * 15;

      linePositions[i * 6] = x;
      linePositions[i * 6 + 1] = y;
      linePositions[i * 6 + 2] = zStart;

      linePositions[i * 6 + 3] = x;
      linePositions[i * 6 + 4] = y;
      linePositions[i * 6 + 5] = zStart - lineLength;

      lineSpeeds[i] = 0.4 + Math.random() * 0.8;
    }

    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x88aaff,
      transparent: true,
      opacity: 0.20,
      blending: THREE.AdditiveBlending,
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    // --- Interaction Setup ---
    const mouse = new THREE.Vector2(-9999, -9999);
    const target3D = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, target3D);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update Particles
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const colorArray = colorAttr.array as Float32Array;

      const interactionRadius = 25;
      const repulsionForce = 0.04;
      const springFactor = 0.06;
      const damping = 0.85;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        let px = posArray[idx];
        let py = posArray[idx + 1];
        let pz = posArray[idx + 2];

        const ox = origPositions[idx];
        const oy = origPositions[idx + 1];
        const oz = origPositions[idx + 2];

        // Repulsion from mouse
        const dx = px - target3D.x;
        const dy = py - target3D.y;
        const dz = pz - target3D.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);

        if (dist < interactionRadius && dist > 0.001) {
          const factor = (1 - dist / interactionRadius) * repulsionForce;
          velocities[idx] += (dx / dist) * factor * 10;
          velocities[idx + 1] += (dy / dist) * factor * 10;
          velocities[idx + 2] += (dz / dist) * factor * 10;

          // Color Mix towards Acid Lime (#CCFF00)
          const mixVal = Math.min((1 - dist / interactionRadius) * 0.5, 0.4);
          colorArray[idx] = baseColor.r + (targetColor.r - baseColor.r) * mixVal;
          colorArray[idx + 1] = baseColor.g + (targetColor.g - baseColor.g) * mixVal;
          colorArray[idx + 2] = baseColor.b + (targetColor.b - baseColor.b) * mixVal;
        } else {
          // Fade back to base color
          colorArray[idx] += (baseColor.r - colorArray[idx]) * 0.05;
          colorArray[idx + 1] += (baseColor.g - colorArray[idx + 1]) * 0.05;
          colorArray[idx + 2] += (baseColor.b - colorArray[idx + 2]) * 0.05;
        }

        // Spring force towards original positions
        velocities[idx] += (ox - px) * springFactor;
        velocities[idx + 1] += (oy - py) * springFactor;
        velocities[idx + 2] += (oz - pz) * springFactor;

        // Apply velocity with damping
        velocities[idx] *= damping;
        velocities[idx + 1] *= damping;
        velocities[idx + 2] *= damping;

        posArray[idx] += velocities[idx];
        posArray[idx + 1] += velocities[idx + 1];
        posArray[idx + 2] += velocities[idx + 2];
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Update Energy Lines
      const linePosAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;

      for (let i = 0; i < lineCount; i++) {
        const z1Idx = i * 6 + 2;
        const z2Idx = i * 6 + 5;
        const speed = lineSpeeds[i];

        linePosArray[z1Idx] += speed;
        linePosArray[z2Idx] += speed;

        // Reset lines that pass camera
        if (linePosArray[z1Idx] > 100) {
          const lineLength = 5 + Math.random() * 15;
          linePosArray[z1Idx] = -120;
          linePosArray[z2Idx] = -120 - lineLength;
        }
      }

      linePosAttr.needsUpdate = true;

      // Subtle scene drift
      particleSystem.rotation.y += 0.0003;
      lineSystem.rotation.y += 0.0002;

      composer.render();
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      bloomPass.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup logic to prevent WebGL memory leaks
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      geometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    />
  );
};
