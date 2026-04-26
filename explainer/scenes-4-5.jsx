// Scenes 4 + 5 — Result + CTA

const Scene4Result = () => {
  const t = useTime();
  const localT = t - 41; // 0..9

  // Color fill from gray → teal: 0.5s → 3s
  const fillT = clamp((localT - 0.5) / 2.5, 0, 1);
  const fillEased = Easing.easeInOutCubic(fillT);

  // Phone notification at 1s
  const notifOp = clamp((localT - 1) / 0.5, 0, 1);
  // Phone screen enlarges at 2.5s
  const phoneZoomT = clamp((localT - 2.5) / 1.0, 0, 1);
  const phoneScale = 1 + phoneZoomT * 1.6;

  // Headline at 5s
  const headlineOp = clamp((localT - 4.5) / 0.6, 0, 1);
  const headlineY = 880 - (1 - clamp((localT - 4.5) / 0.6, 0, 1)) * 40;

  // Team photo at 7s
  const teamOp = clamp((localT - 6.5) / 0.8, 0, 1);

  // Person color: gray → teal
  const personColor = `rgb(${42 + fillEased * (-42 + 34)},${55 + fillEased * (-55 + 211)},${68 + fillEased * (-68 + 176)})`;

  return (
    <g>
      <ParticleField count={30} seed={11} intensity={0.7} />

      {/* Glow */}
      <ellipse cx="960" cy="540" rx="500" ry="350" fill="#22D3B0" opacity={fillT * 0.15} filter="url(#blur40)" />

      {/* Person sitting up + phone */}
      <g transform="translate(620 700)">
        {/* Body */}
        <path d="M -60 200 Q -60 60 -10 60 L 30 60 Q 80 60 80 200 Z" fill={personColor} opacity={1 - phoneZoomT * 0.4} />
        {/* Head */}
        <circle cx="10" cy="40" r="36" fill={personColor} opacity={1 - phoneZoomT * 0.4} />
        {/* Smile after fillT > 0.6 */}
        {fillT > 0.5 && (
          <path d="M -2 50 Q 10 60 22 50" stroke="#0a1f2c" strokeWidth="2.5" fill="none" opacity={(fillT - 0.5) * 2} strokeLinecap="round" />
        )}
        {/* Eyes */}
        <circle cx="-2" cy="32" r="2.5" fill="#0a1f2c" opacity={1 - phoneZoomT * 0.4} />
        <circle cx="22" cy="32" r="2.5" fill="#0a1f2c" opacity={1 - phoneZoomT * 0.4} />

        {/* Phone in hand */}
        <g transform={`translate(60 100) scale(${phoneScale})`} style={{ transformOrigin: 'center' }} opacity={1 - clamp((localT - 6.5)/0.5, 0, 1)}>
          <rect x="-40" y="-70" width="80" height="140" rx="12" fill="#0a1f2c" stroke="#1a3340" strokeWidth="2" />
          <rect x="-34" y="-62" width="68" height="124" rx="6" fill="#FAFEFD" />
          {/* Notification flash */}
          {notifOp > 0 && (
            <rect x="-34" y="-62" width="68" height="124" rx="6" fill="#22D3B0" opacity={Math.max(0, 0.3 - (localT - 1) * 0.6) + notifOp * 0.05} />
          )}
        </g>
      </g>

      {/* Enlarged phone screen — full report */}
      {phoneZoomT > 0.4 && (
        <g transform="translate(1200 540)" opacity={clamp((phoneZoomT - 0.4) / 0.4, 0, 1) * (1 - clamp((localT - 6.5)/0.5, 0, 1))}>
          <rect x="-220" y="-280" width="440" height="560" rx="32" fill="#0a1f2c" stroke="#22D3B0" strokeWidth="3" />
          <rect x="-220" y="-280" width="440" height="560" rx="32" fill="rgba(34,211,176,0.05)" />
          {/* Telegram header */}
          <rect x="-220" y="-280" width="440" height="60" rx="32" fill="#0088cc" />
          <text x="195" y="-243" fill="#fff" fontSize="20" fontWeight="700" fontFamily="Heebo" textAnchor="end"
            style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>Spike AI Agents</text>
          <circle cx="-180" cy="-250" r="18" fill="#22D3B0" />
          <text x="-180" y="-243" fontSize="14" textAnchor="middle" dominantBaseline="central">🤖</text>

          {/* Message bubble */}
          <rect x="-200" y="-200" width="400" height="440" rx="16" fill="rgba(255,255,255,0.08)" />

          <text x="180" y="-160" fill="#5EEAD4" fontSize="22" fontWeight="800" fontFamily="Heebo" textAnchor="end"
            style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>🌅 דוח בוקר</text>

          {[
            { y: -110, icon: '📞', text: '3 לידים חמים', sub: 'מצורפים בהמשך' },
            { y: -30,  icon: '⭐', text: '1 ביקורת דורשת מענה', sub: '4 כוכבים, התראה' },
            { y: 50,   icon: '📊', text: 'מכירות: +8% השבוע', sub: 'מגמה חיובית' },
            { y: 130,  icon: '💡', text: 'שירות X עלה ב-23%', sub: 'הזדמנות לקדם' },
          ].map((row, i) => (
            <g key={i} opacity={clamp((localT - 3 - i * 0.3) / 0.4, 0, 1)}>
              <rect x="-190" y={row.y - 28} width="380" height="62" rx="10" fill="rgba(34,211,176,0.08)" stroke="rgba(94,234,212,0.2)" />
              <text x="170" y={row.y - 4} fill="#fff" fontSize="17" fontWeight="700" fontFamily="Heebo" textAnchor="end"
                style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>{row.text}</text>
              <text x="170" y={row.y + 18} fill="rgba(255,255,255,0.55)" fontSize="13" fontFamily="Heebo" textAnchor="end"
                style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>{row.sub}</text>
              <text x="-160" y={row.y + 6} fontSize="22" textAnchor="middle">{row.icon}</text>
            </g>
          ))}
        </g>
      )}

      {/* Team photo at end */}
      {teamOp > 0 && (
        <g opacity={teamOp}>
          {/* Spike center */}
          <SpikeMascot x={960} y={620} scale={0.9} hue="teal" bobOffset={Math.sin(localT * 1.5) * 4} />
          {/* 4 around */}
          <SpikeMascot x={620} y={680} scale={0.7} hue="sun" badge="sun" bobOffset={Math.sin(localT * 1.6) * 3} aura={false} />
          <SpikeMascot x={790} y={650} scale={0.75} hue="star" badge="star" bobOffset={Math.sin(localT * 1.7) * 3} aura={false} />
          <SpikeMascot x={1130} y={650} scale={0.75} hue="phone" badge="phone" bobOffset={Math.sin(localT * 1.8) * 3} aura={false} />
          <SpikeMascot x={1300} y={680} scale={0.7} hue="chart" badge="chart" bobOffset={Math.sin(localT * 1.9) * 3} aura={false} />
        </g>
      )}

      {/* Headline */}
      <g transform={`translate(960 ${headlineY})`} opacity={headlineOp}>
        <text fill="#fff" fontSize="84" fontWeight="900" fontFamily="Heebo" textAnchor="middle"
          style={{ direction: 'rtl', unicodeBidi: 'plaintext', letterSpacing: '-0.03em' }}>
          ב-7 בבוקר, הכל כבר מוכן.
        </text>
      </g>

      {/* Clock 07:00 top corner */}
      <g transform="translate(960 180)" opacity={clamp(localT / 0.8, 0, 1)}>
        <rect x="-90" y="-32" width="180" height="64" rx="10" fill="rgba(34,211,176,0.1)" stroke="rgba(94,234,212,0.3)" />
        <text x="0" y="14" fill="#5EEAD4" fontSize="44" fontWeight="900" fontFamily="Heebo" textAnchor="middle"
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>07:00</text>
      </g>
    </g>
  );
};

const Scene5CTA = () => {
  const t = useTime();
  const localT = t - 51; // 0..9

  // Bokeh dissolve in
  const bokehOp = 1 - clamp(localT / 1.0, 0, 1);

  // Logo at 0.5s
  const logoT = clamp((localT - 0.3) / 0.8, 0, 1);
  const logoScale = 0.7 + Easing.easeOutBack(logoT) * 0.3;
  const logoRot = -5 * (1 - Easing.easeOutCubic(logoT));
  const logoOp = clamp((localT - 0.3) / 0.4, 0, 1);

  // Headline at 1.5s
  const headOp = clamp((localT - 1.5) / 0.6, 0, 1);
  const headY = 580 - (1 - clamp((localT - 1.5) / 0.6, 0, 1)) * 40;

  // Sub at 2s
  const subOp = clamp((localT - 2.2) / 0.6, 0, 1);

  // CTA at 3s, then heartbeat
  const ctaT = clamp((localT - 3) / 0.5, 0, 1);
  const heartbeat = ctaT >= 1 ? (1 + 0.06 * Math.sin((localT - 3.5) * Math.PI)) : 1;
  const ctaScale = Easing.easeOutBack(ctaT) * heartbeat;

  // URL
  const urlOp = clamp((localT - 3.5) / 0.6, 0, 1);

  // Spike at 4s, waves
  const spikeT = clamp((localT - 4) / 0.6, 0, 1);
  const spikeX = 1620 + (1 - Easing.easeOutBack(spikeT)) * 300;
  const waveActive = localT > 4.5 && localT < 5.5;
  const waveAmount = waveActive ? Math.abs(Math.sin((localT - 4.5) * 6)) : 0;

  return (
    <g>
      <ParticleField count={50} seed={5} intensity={1.2} />

      {/* Bokeh orbs */}
      {[
        { x: 300, y: 300, r: 80 }, { x: 1600, y: 250, r: 120 },
        { x: 200, y: 800, r: 100 }, { x: 1700, y: 850, r: 90 },
        { x: 800, y: 200, r: 60 }, { x: 1200, y: 900, r: 70 },
      ].map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r}
          fill="#22D3B0" opacity={bokehOp * 0.15 + 0.05} filter="url(#blur40)" />
      ))}

      {/* Logo */}
      <g transform={`translate(960 380) scale(${logoScale}) rotate(${logoRot})`} opacity={logoOp}
        style={{ transformOrigin: 'center' }}>
        <text x="0" y="0" fill="#fff" fontSize="96" fontWeight="900" fontFamily="Heebo" textAnchor="middle"
          style={{ letterSpacing: '-0.04em' }}>
          Spike <tspan fill="#22D3B0">AI</tspan>
        </text>
        <g transform="translate(180 -20)">
          <rect x="-44" y="-22" width="88" height="36" rx="18" fill="#22D3B0" />
          <text x="0" y="4" fill="#0a1f2c" fontSize="18" fontWeight="800" fontFamily="Heebo" textAnchor="middle"
            style={{ letterSpacing: '0.15em' }}>AGENTS</text>
        </g>
      </g>

      {/* Headline */}
      <g transform={`translate(960 ${headY})`} opacity={headOp}>
        <text fill="#fff" fontSize="78" fontWeight="900" fontFamily="Heebo" textAnchor="middle"
          style={{ direction: 'rtl', unicodeBidi: 'plaintext', letterSpacing: '-0.03em' }}>
          צוות שעובד בשבילך.
        </text>
      </g>

      {/* Sub */}
      <g transform="translate(960 680)" opacity={subOp}>
        <text fill="#5EEAD4" fontSize="48" fontWeight="600" fontFamily="Heebo" textAnchor="middle"
          style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>
          בלי לבקש משכורת.
        </text>
      </g>

      {/* CTA button */}
      <g transform={`translate(960 820) scale(${ctaScale})`} opacity={Math.min(ctaT, 1)}
        style={{ transformOrigin: 'center' }}>
        <rect x="-220" y="-44" width="440" height="88" rx="44" fill="url(#ctaGrad)" />
        <rect x="-220" y="-44" width="440" height="88" rx="44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        {/* Glow */}
        <rect x="-230" y="-54" width="460" height="108" rx="54" fill="#22D3B0" opacity="0.3" filter="url(#blur8)" />
        <rect x="-220" y="-44" width="440" height="88" rx="44" fill="url(#ctaGrad)" />
        <text x="0" y="10" fill="#0a1f2c" fontSize="32" fontWeight="800" fontFamily="Heebo" textAnchor="middle"
          style={{ direction: 'rtl', unicodeBidi: 'plaintext' }}>
          🚀 קבל הצעה אישית
        </text>
      </g>

      {/* URL */}
      <g transform="translate(960 920)" opacity={urlOp}>
        <text fill="rgba(255,255,255,0.6)" fontSize="22" fontWeight="500" fontFamily="Heebo" textAnchor="middle"
          style={{ letterSpacing: '0.05em' }}>
          spikeai.co.il
        </text>
      </g>

      {/* Spike corner */}
      {spikeT > 0 && (
        <g opacity={spikeT}>
          <SpikeMascot x={spikeX} y={900} scale={0.8} hue="teal" wave={waveAmount} bobOffset={Math.sin(localT * 1.5) * 4} />
        </g>
      )}
    </g>
  );
};

window.Scene4Result = Scene4Result;
window.Scene5CTA = Scene5CTA;
