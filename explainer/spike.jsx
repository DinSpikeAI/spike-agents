// Spike Mascot — pure SVG, animatable parts
// Props: x, y, scale, hue (color override), badge ('sun'|'star'|'phone'|'chart'|null),
//        wave (0..1 wave hand), point (bool), aura (bool), bobOffset (px), eyeBlink (0..1)

const SpikeMascot = ({
  x = 0, y = 0, scale = 1, hue = 'teal',
  badge = null, wave = 0, point = false,
  aura = true, bobOffset = 0, eyeBlink = 0,
  rotate = 0, flip = false,
}) => {
  const palette = {
    teal:   { body: '#22D3B0', light: '#5EEAD4', deep: '#14B8A6', shadow: '#0F766E' },
    cyan:   { body: '#5BD0F2', light: '#7DD8F2', deep: '#0EA5E9', shadow: '#0369A1' },
    sun:    { body: '#22D3B0', light: '#FCD34D', deep: '#14B8A6', shadow: '#0F766E' },
    star:   { body: '#22D3B0', light: '#FBBF24', deep: '#14B8A6', shadow: '#0F766E' },
    phone:  { body: '#22D3B0', light: '#5EEAD4', deep: '#14B8A6', shadow: '#0F766E' },
    chart:  { body: '#22D3B0', light: '#5BD0F2', deep: '#14B8A6', shadow: '#0F766E' },
  }[hue] || { body: '#22D3B0', light: '#5EEAD4', deep: '#14B8A6', shadow: '#0F766E' };

  const eyeRy = Math.max(0.3, 1 - eyeBlink) * 7;
  // wave: 0 = arm down, 1 = arm up waving
  const armAngle = -10 + wave * 90;

  return (
    <g transform={`translate(${x} ${y + bobOffset}) scale(${flip ? -scale : scale} ${scale}) rotate(${rotate})`}>
      {/* Aura */}
      {aura && (
        <circle cx="0" cy="0" r="110"
          fill="url(#auraGrad)" opacity="0.5">
          <animate attributeName="r" values="105;115;105" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.6;0.4" dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Body shadow */}
      <ellipse cx="0" cy="92" rx="48" ry="6" fill="#000" opacity="0.4" />

      {/* Antenna */}
      <line x1="0" y1="-72" x2="0" y2="-92" stroke={palette.shadow} strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-96" r="6" fill={palette.light}>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="-96" r="10" fill={palette.light} opacity="0.3">
        <animate attributeName="r" values="8;14;8" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.6s" repeatCount="indefinite" />
      </circle>

      {/* Head */}
      <g>
        <rect x="-46" y="-72" width="92" height="76" rx="26"
          fill={palette.body} stroke="#0a1f2c" strokeWidth="2.5" />
        {/* Glossy highlight */}
        <path d="M -38 -68 Q -38 -72 -34 -72 L 30 -72 Q 38 -72 38 -64 L 38 -40 Q 0 -54 -38 -36 Z"
          fill="#fff" opacity="0.18" />
        {/* Inner shadow */}
        <rect x="-46" y="-20" width="92" height="24" rx="8" fill="#0a1f2c" opacity="0.18" />

        {/* Face panel */}
        <rect x="-34" y="-54" width="68" height="44" rx="18" fill="#FAFEFD" stroke="#0a1f2c" strokeWidth="1.5" />

        {/* Eyes */}
        <ellipse cx="-14" cy="-32" rx="6" ry={eyeRy} fill="#0a1f2c" />
        <ellipse cx="14" cy="-32" rx="6" ry={eyeRy} fill="#0a1f2c" />
        {eyeBlink < 0.3 && (
          <>
            <circle cx="-12" cy="-34" r="1.8" fill="#fff" />
            <circle cx="16" cy="-34" r="1.8" fill="#fff" />
          </>
        )}

        {/* Blush */}
        <ellipse cx="-22" cy="-20" rx="5" ry="3" fill="#FFA4B5" opacity="0.7" />
        <ellipse cx="22" cy="-20" rx="5" ry="3" fill="#FFA4B5" opacity="0.7" />

        {/* Smile */}
        <path d="M -8 -16 Q 0 -10 8 -16" stroke="#0a1f2c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>

      {/* Body/torso */}
      <rect x="-30" y="2" width="60" height="56" rx="14"
        fill={palette.body} stroke="#0a1f2c" strokeWidth="2.5" />
      <rect x="-22" y="14" width="44" height="20" rx="6"
        fill="#0a1f2c" opacity="0.2" />
      {/* Chest light */}
      <circle cx="0" cy="32" r="6" fill={palette.light}>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Right arm (waving if wave > 0) */}
      <g transform={`rotate(${-armAngle} 28 6)`}>
        <line x1="28" y1="6" x2="38" y2="32" stroke="#0a1f2c" strokeWidth="6" strokeLinecap="round" />
        <line x1="28" y1="6" x2="38" y2="32" stroke={palette.body} strokeWidth="4" strokeLinecap="round" />
        <circle cx="38" cy="32" r="6" fill={palette.body} stroke="#0a1f2c" strokeWidth="2" />
      </g>

      {/* Left arm (pointing if point) */}
      <g transform={point ? 'rotate(-25 -28 6)' : ''}>
        <line x1="-28" y1="6" x2="-38" y2="32" stroke="#0a1f2c" strokeWidth="6" strokeLinecap="round" />
        <line x1="-28" y1="6" x2="-38" y2="32" stroke={palette.body} strokeWidth="4" strokeLinecap="round" />
        <circle cx="-38" cy="32" r="6" fill={palette.body} stroke="#0a1f2c" strokeWidth="2" />
      </g>

      {/* Legs */}
      <rect x="-18" y="58" width="12" height="28" rx="5" fill={palette.deep} stroke="#0a1f2c" strokeWidth="2" />
      <rect x="6" y="58" width="12" height="28" rx="5" fill={palette.deep} stroke="#0a1f2c" strokeWidth="2" />

      {/* Badge (specialty icon) */}
      {badge && (
        <g transform="translate(36 -54)">
          <circle r="18" fill="#fff" stroke="#0a1f2c" strokeWidth="2" />
          <circle r="18" fill={palette.light} opacity="0.3" />
          <text fontSize="20" textAnchor="middle" dominantBaseline="central" y="2">
            {badge === 'sun' ? '☀️' : badge === 'star' ? '⭐' : badge === 'phone' ? '📞' : badge === 'chart' ? '📊' : badge === 'social' ? '📸' : ''}
          </text>
        </g>
      )}
    </g>
  );
};

// Particle field — drifting teal dots
const ParticleField = ({ count = 30, seed = 1, intensity = 1 }) => {
  const t = useTime();
  const particles = React.useMemo(() => {
    const arr = [];
    let s = seed;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rnd() * 1920,
        y: rnd() * 1080,
        r: rnd() * 2 + 0.5,
        speed: rnd() * 8 + 4,
        opacity: rnd() * 0.5 + 0.2,
      });
    }
    return arr;
  }, [count, seed]);
  return (
    <g>
      {particles.map((p, i) => {
        const yPos = ((p.y - t * p.speed) % 1080 + 1080) % 1080;
        const opacity = p.opacity * intensity * (0.6 + 0.4 * Math.sin(t * 2 + i));
        return <circle key={i} cx={p.x} cy={yPos} r={p.r} fill="#5EEAD4" opacity={opacity} />;
      })}
    </g>
  );
};

// RTL Hebrew text helper — renders SVG <text> right-aligned
const HText = ({ x, y, children, size = 48, weight = 800, color = '#fff',
  family = 'Heebo, sans-serif', anchor = 'middle', opacity = 1, letterSpacing = '-0.01em' }) => (
  <text x={x} y={y} fill={color} fontSize={size} fontWeight={weight}
    fontFamily={family} textAnchor={anchor} opacity={opacity}
    style={{ direction: 'rtl', unicodeBidi: 'plaintext', letterSpacing }}>
    {children}
  </text>
);

// Glassmorphism panel
const GlassPanel = ({ x, y, width, height, radius = 16, opacity = 1, glow = false }) => (
  <g opacity={opacity}>
    {glow && <rect x={x - 4} y={y - 4} width={width + 8} height={height + 8} rx={radius + 4}
      fill="#22D3B0" opacity="0.15" filter="url(#blur8)" />}
    <rect x={x} y={y} width={width} height={height} rx={radius}
      fill="rgba(255,255,255,0.05)" stroke="rgba(94,234,212,0.25)" strokeWidth="1" />
  </g>
);

window.SpikeMascot = SpikeMascot;
window.ParticleField = ParticleField;
window.HText = HText;
window.GlassPanel = GlassPanel;
