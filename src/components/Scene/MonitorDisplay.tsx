import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MonitorDisplay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const blinkStateRef = useRef(true);
  const lastBlinkRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 576;
    canvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    textureRef.current = texture;

    drawScreen(canvas, true);
    texture.needsUpdate = true;
  }, []);

  const drawScreen = (canvas: HTMLCanvasElement, showCursor: boolean) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#060b17';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Window titlebar
    ctx.fillStyle = '#0d1527';
    ctx.fillRect(0, 0, canvas.width, 36);

    // Window controls
    const dots = ['#ef4444', '#f59e0b', '#10b981'];
    dots.forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(20 + i * 16, 18, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Tab title
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(80, 4, 300, 32);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText('☕ AppointmentController.java', 95, 25);

    // Active project pill
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.strokeRect(400, 8, 140, 22);
    ctx.fillRect(400, 8, 140, 22);
    ctx.fillStyle = '#10b981';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('● eAshaOP : RUNNING', 410, 23);

    // Code lines
    ctx.font = '15px "JetBrains Mono", monospace';
    let lineY = 68;
    const lineHeight = 22;

    const code = [
      { text: '// eAshaOP - Online Healthcare & Doctor Appointment Engine', color: '#64748b' },
      { text: '@RestController', color: '#f59e0b' },
      { text: '@RequestMapping("/api/v1/appointments")', color: '#38bdf8' },
      { text: 'public class AppointmentController {', color: '#f8fafc' },
      { text: '    @Autowired', color: '#f59e0b' },
      { text: '    private AppointmentService appointmentService;', color: '#94a3b8' },
      { text: '', color: '' },
      { text: '    @PostMapping("/book-slot")', color: '#10b981' },
      { text: '    public ResponseEntity<SlotResponse> reserveSlot(', color: '#f8fafc' },
      { text: '            @Valid @RequestBody SlotBookingRequest req) {', color: '#e2e8f0' },
      { text: '        log.info("Processing slot booking for patient: {}", req.getPatientId());', color: '#64748b' },
      { text: '        SlotResponse confirmed = appointmentService.bookWithLock(req);', color: '#00f0ff' },
      { text: '        return ResponseEntity.ok(confirmed);', color: '#f8fafc' },
      { text: '    }', color: '#f8fafc' },
      { text: '}', color: '#f8fafc' }
    ];

    code.forEach((line, index) => {
      // Line numbers
      ctx.fillStyle = '#334155';
      ctx.fillText(String(index + 1).padStart(2, '0'), 20, lineY);

      if (line.text) {
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 55, lineY);
      }
      lineY += lineHeight;
    });

    // Integrated Terminal at bottom
    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 420, canvas.width, 156);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 420, canvas.width, 1);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('TERMINAL : Spring Boot 3.2.0 Console', 20, 440);

    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText('[INFO] Started eAshaOPApplication in 1.84s (JVM running for 2.45)', 20, 465);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('[INFO] MySQL HikariPool-1 : Connection pool established (max: 20)', 20, 488);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('[INFO] REST Endpoints exposed on http://localhost:8080/swagger-ui.html', 20, 511);

    // Command prompt with blinking cursor
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('rambabu@dev-workstation:~/eAshaOP$ mvn spring-boot:run', 20, 542);
    if (showCursor) {
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(495, 530, 8, 15);
    }

    // Vignette / subtle screen glow border
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  };

  useFrame((state) => {
    const now = state.clock.getElapsedTime();
    if (now - lastBlinkRef.current > 0.5) {
      lastBlinkRef.current = now;
      blinkStateRef.current = !blinkStateRef.current;
      if (canvasRef.current && textureRef.current) {
        drawScreen(canvasRef.current, blinkStateRef.current);
        textureRef.current.needsUpdate = true;
      }
    }
  });

  return (
    <mesh position={[0, 0.96, -0.48]} rotation={[-0.05, 0, 0]}>
      <planeGeometry args={[1.92, 1.08]} />
      {textureRef.current && (
        <meshBasicMaterial
          map={textureRef.current}
          toneMapped={false}
        />
      )}
    </mesh>
  );
}
