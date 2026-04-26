// Scene 1 — Hook (0-8s)
// Dark room, sleeping silhouette, ticking clock, chaotic icons

const Scene1Hook = () => {
  const t = useTime();
  const localT = t; // 0..8

  // Clock progression
  const clockMin = 47 + Math.floor(localT / 2.5);
  const clockText = `02:${String(clockMin).padStart(2, '0')}`;

  // Title types in 0-3s
  const titleText = "02:47. העסק שלך עדיין רץ.";
  const charsToShow = Math.floor(Math.max(0, localT - 0.8) / 2.2 * titleText.length);
  const visibleTitle = titleText.slice(0, Math.min(charsToShow, titleText.length));

  // Subtitle 4-8s
  const subOpacity = clamp((localT - 4) / 0.6, 0, 1) * (1 - clamp((localT - 7.5) / 0.5, 0, 1));

  // Shake at 7s
  const shake = localT > 7 ? Math.sin(localT * 50) * (localT - 7) * 4 : 0;

  // Icon positions (around silhouette at ~480, 720)
  const icons = [
    { emoji: '📞', x: 320, y: 600, phase: 0 },
    { emoji: '⭐', x: 380, y: 820, phase: 1 },
    { emoji: '📧', x: 600, y: 820, phase: 2 },
    { emoji: '📊', x: 660, y: 600, phase: 3 },
  ];

  return (
    <g transform={`translate(${shake} 0)`}>
      <ParticleField count={20} seed={7} intensity={0.5} />

      {/* Clock — center top */}
      <g transform="translate(960 280)">
        <rect x="-180" y="-70" width="360" height="140" rx="16"
          fill="rgba(34,211,176,0.05)" stroke="rgba(34,211,176,0.3)" strokeWidth="1.5" />
        <text x="0" y="20" fill="#5EEAD4" fontSize="100" fontWeight="900"
          fontFamily="Heebo, monospace" textAnchor="middle"
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
          {clockText}
        </text>
        <text x="0" y="60" fill="rgba(94,234,212,0.5)" fontSize="14"
          fontFamily="Heebo" textAnchor="middle" style={{ letterSpacing: '0.3em' }}>
          NIGHT MODE
        </text>
      </g>

      {/* Sleeping silhouette — desk + person */}
      <g transform="translate(480 760)">
        {/* Desk */}
        <rect x="-180" y="80" width="360" height="14" rx="2" fill="#1a2733" />
        <rect x="-170" y="94" width="20" height="80" fill="#1a2733" />
        <rect x="150" y="94" width="20" height="80" fill="#1a2733" />
        {/* Laptop */}
        <rect x="-60" y="40" width="120" height="80" rx="6" fill="#0a1f2c" stroke="#1a3340" strokeWidth="2" />
        <rect x="-54" y="46" width="108" height="68" rx="2" fill="#0a1f2c" />
        {/* Faint screen glow */}
        <rect x="-54" y="46" width="108" height="68" rx="2" fill="#22D3B0" opacity="0.08" />
        {/* Person — head down on desk */}
        <ellipse cx="0" cy="40" rx="34" ry="22" fill="#2a3744" />
        <path d="M -50 40 Q -50 -10 -20 -10 L 20 -10 Q 50 -10 50 40 Z" fill="#1a2733" />
        {/* Hair */}
        <path d="M -34 40 Q -36 18 -10 22 L 14 22 Q 34 18 34 40 Z" fill="#0d1922" />
      </g>

      {/* Chaotic icons */}
      {icons.map((ic, i) => {
        const pulse = 0.4 + 0.6 * Math.abs(Math.sin(localT * 1.4 + ic.phase * 1.3));
        return (
          <g key={i} transform={`translate(${ic.x} ${ic.y})`} opacity={pulse * 0.7}>
            <circle r="32" fill="rgba(34,211,176,0.05)" stroke="rgba(94,234,212,0.2)" strokeWidth="1" />
            <text fontSize="32" textAnchor="middle" dominantBaseline="central" opacity="0.7">{ic.emoji}</text>
          </g>
        );
      })}

      {/* Title — typing */}
      <g transform="translate(960 1040)" opacity={localT > 0.8 ? 1 : 0}>
        <text fill="#fff" fontSize="64" fontWeight="900" fontFamily="Heebo"
          textAnchor="middle" style={{ direction: 'rtl', unicodeBidi: 'plaintext', letterSpacing: '-0.02em' }}>
          {visibleTitle}
          {charsToShow < titleText.length && Math.sin(localT * 8) > 0 && '▎'}
        </text>
      </g>

      {/* Subtitle */}
      <g transform="translate(960 1120)" opacity={subOpacity}>
        <text fill="#5EEAD4" fontSize="42" fontWeight="600" fontFamily="Heebo"
          textAnchor="middle" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>
          אבל אתה כבר לא.
        </text>
      </g>
    </g>
  );
};

// Transition shatter (8-9s)
const Transition1 = () => {
  const { localTime, progress } = useSprite();
  const shards = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      arr.push({
        angle,
        dist: 100 + (i % 4) * 200,
        size: 40 + (i % 5) * 20,
      });
    }
    return arr;
  }, []);
  return (
    <g transform="translate(960 540)">
      {shards.map((s, i) => {
        const d = s.dist * progress;
        const x = Math.cos(s.angle) * d;
        const y = Math.sin(s.angle) * d;
        return (
          <polygon key={i}
            points={`0,-${s.size} ${s.size * 0.6},${s.size * 0.4} -${s.size * 0.6},${s.size * 0.4}`}
            fill="#22D3B0"
            opacity={1 - progress}
            transform={`translate(${x} ${y}) rotate(${s.angle * 60})`} />
        );
      })}
      {/* Flash */}
      <rect x="-960" y="-540" width="1920" height="1080" fill="#5EEAD4" opacity={Math.max(0, 0.6 - progress * 1.2)} />
    </g>
  );
};

// Scene 2 — Meet the team (9-20s)
const Scene2Team = () => {
  const t = useTime();
  const localT = t - 9; // 0..11

  // Spike enters 0-1s, bounces in
  const spikeT = clamp(localT / 1.0, 0, 1);
  const spikeX = 960 + (1 - Easing.easeOutBack(spikeT)) * 800;
  const spikeBob = Math.sin(localT * 2) * 8;

  // Wave hand 1-2s
  const waveActive = localT > 1.0 && localT < 2.5;
  const waveAmount = waveActive ? Math.abs(Math.sin((localT - 1) * 6)) : 0;

  // 5 agents pop in: 2.0, 2.5, 3.0, 3.5, 5.0 (social agent comes a beat later, top-center)
  const agents = [
    { x: 460, y: 640, hue: 'sun', badge: 'sun', startT: 2.0 },
    { x: 700, y: 600, hue: 'star', badge: 'star', startT: 2.5 },
    { x: 1220, y: 600, hue: 'phone', badge: 'phone', startT: 3.0 },
    { x: 1460, y: 640, hue: 'chart', badge: 'chart', startT: 3.5 },
    { x: 960, y: 470, hue: 'cyan', badge: 'social', startT: 5.0 },
  ];

  // Background silhouettes — 4 mascots, 30% opacity, blurred
  const silhouettes = [
    { x: 320, y: 700, scale: 0.7, startT: 5.5 },
    { x: 1600, y: 700, scale: 0.7, startT: 5.7 },
    { x: 200, y: 540, scale: 0.55, startT: 5.9 },
    { x: 1720, y: 540, scale: 0.55, startT: 6.1 },
  ];

  // Title 2.5-10s
  const titleOp = clamp((localT - 2.5) / 0.6, 0, 1) * (1 - clamp((localT - 10) / 0.8, 0, 1));
  const titleY = 200 - (1 - clamp((localT - 2.5) / 0.6, 0, 1)) * 60;

  // Subtitle 4-10s
  const subOp = clamp((localT - 4) / 0.6, 0, 1) * (1 - clamp((localT - 10) / 0.8, 0, 1));

  // NEW caption "...וזה רק חלק מהצוות" at 7s (after silhouettes appear)
  const tailOp = clamp((localT - 7) / 0.8, 0, 1) * (1 - clamp((localT - 10) / 0.8, 0, 1));

  return (
    <g>
      <ParticleField count={40} seed={3} intensity={1} />

      {/* Glow blobs */}
      <ellipse cx="500" cy="700" rx="300" ry="200" fill="#22D3B0" opacity="0.08" filter="url(#blur40)" />
      <ellipse cx="1400" cy="700" rx="300" ry="200" fill="#5BD0F2" opacity="0.08" filter="url(#blur40)" />

      {/* Background silhouettes — drawn FIRST so they sit behind agents + Spike */}
      {silhouettes.map((s, i) => {
        const sT = clamp((localT - s.startT) / 0.6, 0, 1);
        if (sT <= 0) return null;
        const bob = Math.sin(localT * 1.5 + i * 0.7) * 4;
        return (
          <g key={`sil-${i}`} opacity={sT * 0.3} filter="url(#blur4)">
            <g transform={`translate(${s.x} ${s.y}) scale(${s.scale})`}>
              <SpikeMascot x={0} y={0} scale={1} hue="teal" bobOffset={bob} aura={false} />
            </g>
          </g>
        );
      })}

      {/* 5 agents behind */}
      {agents.map((a, i) => {
        const aT = clamp((localT - a.startT) / 0.5, 0, 1);
        if (aT <= 0) return null;
        const ringR = aT * 80;
        const ringOp = (1 - aT) * 0.6;
        const bob = Math.sin(localT * 1.8 + i) * 6;
        return (
          <g key={i}>
            <circle cx={a.x} cy={a.y} r={ringR} fill="none" stroke="#5EEAD4" strokeWidth="2" opacity={ringOp} />
            <g opacity={aT} transform={`scale(${0.7 + 0.3 * Easing.easeOutBack(aT)})`} style={{ transformOrigin: `${a.x}px ${a.y}px`, transformBox: 'fill-box' }}>
              <g transform={`translate(${a.x} ${a.y}) scale(0.85)`}>
                <SpikeMascot x={0} y={0} scale={1} hue={a.hue} badge={a.badge} bobOffset={bob} aura={false} />
              </g>
            </g>
          </g>
        );
      })}

      {/* Spike center-front */}
      <SpikeMascot x={spikeX} y={780} scale={1.4} hue="teal" wave={waveAmount} bobOffset={spikeBob} aura={true} />

      {/* Title */}
      <g transform={`translate(960 ${titleY})`} opacity={titleOp}>
        <text fill="#fff" fontSize="92" fontWeight="900" fontFamily="Heebo"
          textAnchor="middle" style={{ direction: 'rtl', unicodeBidi: 'plaintext', letterSpacing: '-0.03em' }}>
          הכר את הצוות שלך.
        </text>
      </g>

      {/* Subtitle */}
      <g transform="translate(960 290)" opacity={subOp}>
        <text fill="#5EEAD4" fontSize="38" fontWeight="500" fontFamily="Heebo"
          textAnchor="middle" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>
          סוכני AI שעובדים במקביל. 24/7.
        </text>
      </g>

      {/* New tail caption — appears after silhouettes */}
      <g transform="translate(960 340)" opacity={tailOp}>
        <text fill="#5EEAD4" fontSize="28" fontWeight="500" fontFamily="Heebo"
          textAnchor="middle" style={{ direction: 'rtl', unicodeBidi: 'plaintext', fontStyle: 'italic' }}>
          ...וזה רק חלק מהצוות
        </text>
      </g>
    </g>
  );
};

window.Scene1Hook = Scene1Hook;
window.Transition1 = Transition1;
window.Scene2Team = Scene2Team;
