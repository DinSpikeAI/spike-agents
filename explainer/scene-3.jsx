// Scene 3 — 4-quadrant demo (21-40s)
// Each quadrant reveals an agent at work

const Quadrant = ({ x, y, w, h, localT, bgColor, clipId, children }) => {
  // localT is already shifted (0 = quadrant's reveal moment)
  if (localT < 0) return null;
  const enter = clamp(localT / 0.4, 0, 1);
  const eased = Easing.easeOutCubic(enter);

  return (
    <g opacity={eased} transform={`translate(${x + (1-eased)*40} ${y})`}>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={w} height={h} />
        </clipPath>
      </defs>
      {/* BG */}
      <rect x="0" y="0" width={w} height={h} fill={bgColor} />
      <rect x="0" y="0" width={w} height={h} fill="url(#quadFade)" opacity="0.4" />
      {/* Clipped content */}
      <g clipPath={`url(#${clipId})`}>
        {children}
      </g>
      {/* Border (drawn on top, not clipped) */}
      <rect x="0" y="0" width={w} height={h} fill="none" stroke="rgba(94,234,212,0.2)" strokeWidth="2" />
    </g>
  );
};

// Q1: Morning agent
const Q1Morning = ({ localT, x, y, w, h }) => {
  const qT = localT - 0; // local within quadrant 0..5
  // Clock progression
  const clocks = ['06:00', '06:30', '07:00'];
  const clockIdx = Math.min(2, Math.floor(qT / 1.5));
  // Data streams flowing
  const streams = [];
  for (let i = 0; i < 6; i++) {
    const phase = (qT * 0.8 + i * 0.4) % 1;
    streams.push({ phase, y: 100 + i * 50, label: ['📊','📈','📉','💼','🔍','💡'][i] });
  }
  // Telegram message at 4s
  const msgOp = clamp((qT - 4) / 0.4, 0, 1);

  const bobOffset = Math.sin(qT * 1.5) * 4;
  return (
    <g>
      {/* Sun gradient bg */}
      <rect x="0" y="0" width={w} height={h} fill="url(#sunriseGrad)" opacity="0.15" />
      {/* Sun */}
      <circle cx={w * 0.85} cy="80" r="40" fill="#FCD34D" opacity="0.6">
        <animate attributeName="r" values="38;44;38" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={w * 0.85} cy="80" r="60" fill="#FCD34D" opacity="0.2" />

      {/* Clock */}
      <g transform={`translate(${w - 140} 50)`}>
        <rect x="-50" y="-22" width="100" height="40" rx="6" fill="rgba(7,17,26,0.7)" stroke="rgba(94,234,212,0.3)" />
        <text x="0" y="6" fill="#5EEAD4" fontSize="22" fontWeight="700" fontFamily="Heebo"
          textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>{clocks[clockIdx]}</text>
      </g>

      {/* Data streams flowing right→agent */}
      {streams.map((s, i) => (
        <g key={i} opacity={Math.sin(s.phase * Math.PI)}>
          <text x={w * 0.85 - s.phase * (w * 0.55)} y={s.y} fontSize="22" textAnchor="middle">{s.label}</text>
        </g>
      ))}

      {/* Agent center-left */}
      <g transform={`translate(${w * 0.32} ${h * 0.55}) scale(0.85)`}>
        <SpikeMascot x={0} y={0} hue="sun" badge="sun" bobOffset={bobOffset} />
      </g>

      {/* Telegram bubble */}
      <g transform={`translate(${w * 0.55} ${h - 110})`} opacity={msgOp}>
        <rect x="-180" y="-40" width="360" height="80" rx="14" fill="#0088cc" />
        <rect x="-180" y="-40" width="360" height="80" rx="14" fill="rgba(255,255,255,0.08)" />
        <text x="160" y="-10" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>📊 דוח בוקר</text>
        <text x="160" y="20" fill="rgba(255,255,255,0.85)" fontSize="13" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>3 לידים חמים, 2 ביקורות חדשות</text>
      </g>

      {/* Title (foreignObject for reliable RTL) */}
      <foreignObject x="20" y="30" width={w - 40} height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          direction: 'rtl', textAlign: 'right',
          fontFamily: 'Heebo, sans-serif',
          paddingRight: '8px',
        }}>
          <div style={{ color: '#fff', fontSize: '26px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em' }}>סוכן הבוקר</div>
          <div style={{ color: '#5EEAD4', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>סוקר את הלילה, מסכם את החשוב</div>
        </div>
      </foreignObject>
    </g>
  );
};

// Q2: Reviews agent
const Q2Reviews = ({ localT, x, y, w, h }) => {
  const qT = localT - 0;
  // Star particles
  const stars = [];
  for (let i = 0; i < 12; i++) {
    stars.push({ x: (i * 137) % w, y: ((i * 89) % (h - 60)) + 30, phase: i });
  }
  // Review cards floating up
  const cards = [
    { x: w * 0.7, startT: 0.3, positive: true },
    { x: w * 0.3, startT: 0.8, positive: true },
    { x: w * 0.55, startT: 1.3, positive: false },
    { x: w * 0.78, startT: 1.8, positive: true },
    { x: w * 0.25, startT: 2.3, positive: true },
  ];
  const summaryOp = clamp((qT - 4) / 0.4, 0, 1);
  const bobOffset = Math.sin(qT * 1.5) * 4;

  return (
    <g>
      {/* Star bg */}
      {stars.map((s, i) => {
        const tw = 0.3 + 0.5 * Math.abs(Math.sin(qT * 1.2 + s.phase));
        return <text key={i} x={s.x} y={s.y} fontSize="14" opacity={tw * 0.4}>✦</text>;
      })}

      {/* Agent center */}
      <g transform={`translate(${w * 0.5} ${h * 0.55}) scale(0.85)`}>
        <SpikeMascot x={0} y={0} hue="star" badge="star" bobOffset={bobOffset} />
      </g>

      {/* Review cards floating up + arrows */}
      {cards.map((c, i) => {
        const ct = qT - c.startT;
        if (ct < 0 || ct > 2.5) return null;
        const yT = clamp(ct / 1.2, 0, 1);
        const cy = h - 50 - yT * (h * 0.4);
        const op = ct > 2 ? Math.max(0, 1 - (ct - 2) * 2) : Math.min(1, ct * 3);
        const color = c.positive ? '#22D3B0' : '#F87171';
        return (
          <g key={i} opacity={op} transform={`translate(${c.x} ${cy})`}>
            <rect x="-50" y="-22" width="100" height="44" rx="8" fill="rgba(7,17,26,0.85)" stroke={color} strokeWidth="1.5" />
            <text x="0" y="-4" fontSize="13" textAnchor="middle" fill="#FCD34D">★ ★ ★ ★ ★</text>
            <text x="0" y="14" fontSize="10" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="Heebo"
              style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>{c.positive ? 'מעולה!' : 'לא מרוצה'}</text>
          </g>
        );
      })}

      {/* Summary bubble */}
      <g transform={`translate(${w / 2} ${h - 90})`} opacity={summaryOp}>
        <rect x="-180" y="-30" width="360" height="60" rx="12" fill="rgba(7,17,26,0.9)" stroke="rgba(94,234,212,0.4)" />
        <text x="160" y="0" fill="#22D3B0" fontSize="14" fontWeight="700" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>✓ 12 חיוביות</text>
        <text x="160" y="20" fill="#F87171" fontSize="12" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>⚠ 1 דורשת מענה</text>
      </g>

      {/* Title (foreignObject for reliable RTL) */}
      <foreignObject x="20" y="30" width={w - 40} height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          direction: 'rtl', textAlign: 'right',
          fontFamily: 'Heebo, sans-serif',
          paddingRight: '8px',
        }}>
          <div style={{ color: '#fff', fontSize: '26px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em' }}>סוכן הביקורות</div>
          <div style={{ color: '#5EEAD4', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>מזהה ביקורות, מסמן את הדחופות</div>
        </div>
      </foreignObject>
    </g>
  );
};

// Q3: Leads agent
const Q3Leads = ({ localT, x, y, w, h }) => {
  const qT = localT - 0;
  const leads = [
    { x: w * 0.25, y: h * 0.4, tag: 'חם', color: '#F97316', startT: 0.3 },
    { x: w * 0.75, y: h * 0.4, tag: 'פושר', color: '#FCD34D', startT: 0.9 },
    { x: w * 0.2, y: h * 0.7, tag: 'קר', color: '#5BD0F2', startT: 1.5 },
    { x: w * 0.78, y: h * 0.65, tag: 'חם', color: '#F97316', startT: 2.1 },
    { x: w * 0.5, y: h * 0.75, tag: 'פושר', color: '#FCD34D', startT: 2.7 },
  ];
  const boxOp = clamp((qT - 3) / 0.5, 0, 1);
  const bobOffset = Math.sin(qT * 1.5) * 4;

  return (
    <g>
      {/* Agent */}
      <g transform={`translate(${w * 0.5} ${h * 0.45}) scale(0.85)`}>
        <SpikeMascot x={0} y={0} hue="phone" badge="phone" bobOffset={bobOffset} />
      </g>

      {/* Leads */}
      {leads.map((l, i) => {
        const lt = qT - l.startT;
        if (lt < 0) return null;
        const enter = clamp(lt / 0.3, 0, 1);
        const tagged = lt > 0.6;
        const flyToBox = lt > 1.2 && l.tag === 'חם';
        const flyT = clamp((lt - 1.2) / 0.6, 0, 1);
        const finalX = flyToBox ? l.x + (w * 0.85 - l.x) * flyT : l.x;
        const finalY = flyToBox ? l.y + (h * 0.9 - l.y) * flyT : l.y;
        const op = flyToBox && flyT > 0.9 ? 0 : enter;

        return (
          <g key={i} opacity={op} transform={`translate(${finalX} ${finalY}) scale(${enter})`}>
            <circle r="22" fill="rgba(7,17,26,0.9)" stroke={l.color} strokeWidth="2" />
            <text fontSize="20" textAnchor="middle" dominantBaseline="central">📞</text>
            {tagged && (
              <g transform="translate(20 -20)" opacity={clamp((lt - 0.6) / 0.3, 0, 1)}>
                <rect x="-16" y="-9" width="34" height="18" rx="4" fill={l.color} />
                <text x="0" y="3" fontSize="11" fontWeight="700" fontFamily="Heebo"
                  textAnchor="middle" fill="#0a1f2c" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>{l.tag}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* "לטיפול היום" box */}
      <g transform={`translate(${w - 150} ${h - 100})`} opacity={boxOp}>
        <rect x="-90" y="-30" width="180" height="60" rx="10" fill="rgba(249,115,22,0.15)" stroke="#F97316" strokeWidth="1.5" />
        <text x="80" y="-8" fill="#F97316" fontSize="14" fontWeight="700" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>🔥 לטיפול היום</text>
        <text x="80" y="14" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>2 לידים חמים</text>
      </g>

      {/* Title (foreignObject for reliable RTL) */}
      <foreignObject x="20" y="30" width={w - 40} height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          direction: 'rtl', textAlign: 'right',
          fontFamily: 'Heebo, sans-serif',
          paddingRight: '8px',
        }}>
          <div style={{ color: '#fff', fontSize: '26px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em' }}>סוכן הלידים</div>
          <div style={{ color: '#5EEAD4', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>מסנן, מדרג ומכין רשימה לטיפול</div>
        </div>
      </foreignObject>
    </g>
  );
};

// Q4: Manager agent
const Q4Manager = ({ localT, x, y, w, h }) => {
  const qT = localT - 0;
  // Animated chart
  const points = [];
  for (let i = 0; i < 7; i++) {
    const baseY = 100 - Math.sin(i * 0.7 + qT * 0.5) * 20 - i * 6;
    points.push({ x: 30 + i * 35, y: baseY });
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const insightOp = clamp((qT - 3) / 0.5, 0, 1);
  const bobOffset = Math.sin(qT * 1.5) * 4;

  return (
    <g>
      {/* Mini charts in corners */}
      <g transform={`translate(${w * 0.7} 130)`} opacity="0.7">
        <rect x="-110" y="-20" width="220" height="120" rx="8" fill="rgba(7,17,26,0.6)" stroke="rgba(94,234,212,0.2)" />
        <path d={pathD.replace(/[\d.]+/g, n => parseFloat(n).toFixed(1))} stroke="#22D3B0" strokeWidth="2.5" fill="none" transform="translate(-110 0)" />
        {points.map((p, i) => <circle key={i} cx={p.x - 110} cy={p.y} r="3" fill="#5EEAD4" />)}
        {/* Red dot — anomaly */}
        <circle cx={points[3].x - 110} cy={points[3].y} r="6" fill="#F87171">
          <animate attributeName="r" values="5;9;5" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Bar chart */}
      <g transform={`translate(${w * 0.18} ${h * 0.65})`} opacity="0.5">
        {[40, 60, 35, 70, 55].map((bh, i) => (
          <rect key={i} x={i * 18} y={-bh} width="14" height={bh} rx="2" fill="#5BD0F2" opacity="0.7" />
        ))}
      </g>

      {/* Agent */}
      <g transform={`translate(${w * 0.4} ${h * 0.5}) scale(0.85)`}>
        <SpikeMascot x={0} y={0} hue="chart" badge="chart" bobOffset={bobOffset} point={true} />
      </g>

      {/* Insight bubble */}
      <g transform={`translate(${w / 2} ${h - 90})`} opacity={insightOp}>
        <rect x="-200" y="-32" width="400" height="64" rx="12" fill="rgba(248,113,113,0.15)" stroke="#F87171" strokeWidth="1.5" />
        <text x="180" y="-10" fill="#FCA5A5" fontSize="14" fontWeight="700" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>💡 ההכנסה ירדה 12% השבוע</text>
        <text x="180" y="14" fill="rgba(255,255,255,0.7)" fontSize="12" fontFamily="Heebo"
          textAnchor="end" style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>בדוק את שירות X</text>
      </g>

      {/* Title (foreignObject for reliable RTL) */}
      <foreignObject x="20" y="30" width={w - 40} height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          direction: 'rtl', textAlign: 'right',
          fontFamily: 'Heebo, sans-serif',
          paddingRight: '8px',
        }}>
          <div style={{ color: '#fff', fontSize: '26px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.01em' }}>סוכן המנהל</div>
          <div style={{ color: '#5EEAD4', fontSize: '15px', fontWeight: 500, marginTop: '4px' }}>מנתח את הביצועים, מזהה הזדמנויות</div>
        </div>
      </foreignObject>
    </g>
  );
};

const Scene3Demo = () => {
  const t = useTime();
  const localT = t - 21; // 0..19
  const W = 1920, H = 1080;
  const halfW = W / 2, halfH = H / 2;

  return (
    <g>
      {/* Q1 — top-right (RTL: starts top-right) — Morning, reveals at 0 */}
      <Quadrant x={halfW} y={0} w={halfW} h={halfH} localT={localT} bgColor="#0a1a22" clipId="clipQ1">
        <Q1Morning localT={localT} w={halfW} h={halfH} />
      </Quadrant>
      {/* Q2 — top-left — Reviews, reveals at 5 */}
      <Quadrant x={0} y={0} w={halfW} h={halfH} localT={localT - 5} bgColor="#0d1620" clipId="clipQ2">
        <Q2Reviews localT={localT - 5} w={halfW} h={halfH} />
      </Quadrant>
      {/* Q3 — bottom-right — Leads, reveals at 10 */}
      <Quadrant x={halfW} y={halfH} w={halfW} h={halfH} localT={localT - 10} bgColor="#091820" clipId="clipQ3">
        <Q3Leads localT={localT - 10} w={halfW} h={halfH} />
      </Quadrant>
      {/* Q4 — bottom-left — Manager, reveals at 15 */}
      <Quadrant x={0} y={halfH} w={halfW} h={halfH} localT={localT - 15} bgColor="#0c1a24" clipId="clipQ4">
        <Q4Manager localT={localT - 15} w={halfW} h={halfH} />
      </Quadrant>

      {/* Divider lines */}
      <line x1={halfW} y1="0" x2={halfW} y2={H} stroke="rgba(94,234,212,0.3)" strokeWidth="2" />
      <line x1="0" y1={halfH} x2={W} y2={halfH} stroke="rgba(94,234,212,0.3)" strokeWidth="2" />
    </g>
  );
};

window.Scene3Demo = Scene3Demo;
