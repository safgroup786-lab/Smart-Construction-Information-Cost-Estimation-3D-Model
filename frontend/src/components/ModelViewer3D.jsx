import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ModelViewer3D({ project }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const width = mountRef.current.clientWidth || 300;
    const height = 350;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#1e1e1e");
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 6, 8);
    camera.lookAt(0, 1, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const isDouble = project?.storyType === "double";
    const isCommercial = project?.constructionType === "commercial";
    
    const group = new THREE.Group();
    
    // Base Slab
    const slabGeo = new THREE.BoxGeometry(3.5, 0.15, 3.5);
    const slabMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8 });
    const baseSlab = new THREE.Mesh(slabGeo, slabMat);
    group.add(baseSlab);
    
    // Floor 1 Framework Blueprint
    const f1Geo = new THREE.BoxGeometry(3, 1.4, 3);
    const f1Mat = new THREE.MeshStandardMaterial({ 
      color: isCommercial ? 0x2b4c7e : 0xb45309, 
      wireframe: true,
      transparent: true,
      opacity: 0.9 
    });
    const floor1 = new THREE.Mesh(f1Geo, f1Mat);
    floor1.position.y = 0.77;
    group.add(floor1);
    
    // Floor 2 Structure (Conditional deployment)
    if (isDouble) {
      const f2Geo = new THREE.BoxGeometry(3, 1.4, 3);
      const f2Mat = new THREE.MeshStandardMaterial({ 
        color: isCommercial ? 0x3a6ea5 : 0xd97706, 
        wireframe: true 
      });
      const floor2 = new THREE.Mesh(f2Geo, f2Mat);
      floor2.position.y = 2.17;
      group.add(floor2);
    }
    
    scene.add(group);
    
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.y += 0.007;
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [project]);

  return (
    <div style={{ background: "#111", borderRadius: 12, padding: 16, border: "1px solid #333" }}>
      <h4 style={{ margin: "0 0 10px", color: "#FFF" }}>Interactive 3D Framework Viewer</h4>
      <div ref={mountRef} style={{ width: "100%", height: 350, borderRadius: 8, overflow: "hidden" }} />
      <p style={{ fontSize: 11, color: "#888", marginTop: 8, textAlign: "center" }}>Rotating real-time blueprint layout matrix view</p>
    </div>
  );
}