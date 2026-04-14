"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#0A1628") },
      uColor2: { value: new THREE.Color("#1B4965") },
      uColor3: { value: new THREE.Color("#2E86AB") },
      uGold: { value: new THREE.Color("#C9A96E") },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta * 0.3;
  });

  const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // 多层波浪叠加
      float wave1 = sin(pos.x * 2.0 + uTime * 1.2) * 0.15;
      float wave2 = sin(pos.x * 3.5 + pos.y * 2.0 + uTime * 0.8) * 0.08;
      float wave3 = sin(pos.x * 5.0 + pos.y * 3.0 + uTime * 1.5) * 0.04;
      float wave4 = cos(pos.y * 2.5 + uTime * 0.6) * 0.1;

      pos.z = wave1 + wave2 + wave3 + wave4;
      vElevation = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uGold;

    void main() {
      // 基础海洋颜色（深蓝到浅蓝渐变）
      vec3 color = mix(uColor1, uColor2, vUv.y * 0.8 + 0.2);

      // 波峰高亮
      float highlight = smoothstep(0.05, 0.25, vElevation);
      color = mix(color, uColor3, highlight * 0.5);

      // 金色光斑（模拟阳光在水面的反射）
      float goldSpot = sin(vUv.x * 20.0 + uTime * 2.0) * sin(vUv.y * 15.0 + uTime * 1.5);
      goldSpot = smoothstep(0.7, 1.0, goldSpot);
      color = mix(color, uGold, goldSpot * 0.15);

      // 金色沉淀效果（底部更多金色）
      float goldSink = smoothstep(0.0, 0.4, 1.0 - vUv.y);
      color = mix(color, uGold * 0.3, goldSink * 0.08);

      // 波纹泡沫线
      float foam = sin(vUv.x * 40.0 + uTime * 3.0 + vElevation * 10.0);
      foam = smoothstep(0.92, 1.0, foam);
      color = mix(color, vec3(0.8, 0.85, 0.9), foam * 0.06);

      // 边缘渐隐
      float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(0.0, 0.15, 1.0 - vUv.y);
      float alpha = edgeFade * 0.85;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[8, 6, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 金色沉淀粒子
function GoldParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 4 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      spd[i] = 0.002 + Math.random() * 0.005;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i]; // 缓慢下沉
      pos[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.001; // 轻微水平漂移
      if (pos[i * 3 + 1] < -2) {
        pos[i * 3 + 1] = 3;
        pos[i * 3] = (Math.random() - 0.5) * 8;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#C9A96E"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function OceanScene() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 2, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#C9A96E" />
        <Ocean />
        <GoldParticles />
      </Canvas>
    </div>
  );
}
