import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A 3D particle neural network that reacts to the mouse.
 * Nodes (particles) are connected with glowing lines; data pulses
 * travel along the connections.
 */

function NeuralNetwork({ reducedMotion }) {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Generate nodes
  const nodes = useMemo(() => {
    const count = reducedMotion ? 30 : 60;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4,
        ],
        scale: Math.random() * 0.08 + 0.03,
        speed: Math.random() * 0.5 + 0.5,
      });
    }
    return arr;
  }, [reducedMotion]);

  // Generate connections (pairs of nearby nodes)
  const connections = useMemo(() => {
    const conns = [];
    const maxDist = 3.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          nodes[i].position.reduce((sum, p, k) => sum + Math.pow(p - nodes[j].position[k], 2), 0)
        );
        if (dist < maxDist) {
          conns.push({ a: i, b: j, dist });
        }
      }
    }
    return conns;
  }, [nodes]);

  // Positions buffer for lines
  const linePositions = useMemo(() => {
    const positions = new Float32Array(connections.length * 6);
    connections.forEach((c, i) => {
      positions[i * 6] = nodes[c.a].position[0];
      positions[i * 6 + 1] = nodes[c.a].position[1];
      positions[i * 6 + 2] = nodes[c.a].position[2];
      positions[i * 6 + 3] = nodes[c.b].position[0];
      positions[i * 6 + 4] = nodes[c.b].position[1];
      positions[i * 6 + 5] = nodes[c.b].position[2];
    });
    return positions;
  }, [connections, nodes]);

  // Pulse data
  const pulses = useMemo(() => {
    const count = reducedMotion ? 5 : 15;
    return Array.from({ length: count }, () => ({
      connIdx: Math.floor(Math.random() * connections.length),
      progress: Math.random(),
      speed: Math.random() * 0.5 + 0.3,
    }));
  }, [connections.length, reducedMotion]);

  const pulseRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth mouse follow
    mouseRef.current.x += (state.mouse.x - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (state.mouse.y - mouseRef.current.y) * 0.05;

    groupRef.current.rotation.y = mouseRef.current.x * 0.3 + t * 0.02;
    groupRef.current.rotation.x = mouseRef.current.y * 0.2;

    // Update pulses
    if (pulseRef.current) {
      const positions = pulseRef.current.geometry.attributes.position.array;
      pulses.forEach((p, i) => {
        p.progress += p.speed * 0.01;
        if (p.progress > 1) {
          p.progress = 0;
          p.connIdx = Math.floor(Math.random() * connections.length);
        }
        const conn = connections[p.connIdx];
        if (!conn) return;
        const a = nodes[conn.a].position;
        const b = nodes[conn.b].position;
        positions[i * 3] = a[0] + (b[0] - a[0]) * p.progress;
        positions[i * 3 + 1] = a[1] + (b[1] - a[1]) * p.progress;
        positions[i * 3 + 2] = a[2] + (b[2] - a[2]) * p.progress;
      });
      pulseRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.scale, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#22D3EE' : '#3B82F6'} transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Glow halos on some nodes */}
      {nodes.filter((_, i) => i % 5 === 0).map((node, i) => (
        <mesh key={`halo-${i}`} position={node.position}>
          <sphereGeometry args={[node.scale * 2.5, 16, 16]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3B82F6" transparent opacity={0.25} />
      </lineSegments>

      {/* Data pulses travelling along connections */}
      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pulses.length}
            array={new Float32Array(pulses.length * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#22D3EE"
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function NeuralNetworkCanvas({ reducedMotion }) {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={reducedMotion ? 1 : [1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <NeuralNetwork reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
