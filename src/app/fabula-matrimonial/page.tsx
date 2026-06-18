'use client';
import { useEffect, useRef, useState } from 'react';
import RsvpForm from '@/components/RsvpForm';
import styles from './fabula.module.css';

const NUM_SHEETS = 7;
const NUM_MOBILE_PAGES = 14;

type Star    = { id: number; left: string; top: string; size: string; dur: string; delay: string; color: string };
type Sparkle = { id: number; left: string; top: string; size: string; dur: string; delay: string };

/* ── Corner ornament — botanical motif ── */
function Ornament({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const s: React.CSSProperties = {
    position: 'absolute', width: 28, height: 28, pointerEvents: 'none', opacity: 0.65,
    ...(pos[0] === 't' ? { top: 10 } : { bottom: 10 }),
    ...(pos[1] === 'l' ? { left: 10 } : { right: 10 }),
    transform:
      pos === 'tr' ? 'scaleX(-1)' :
      pos === 'br' ? 'scale(-1)'  :
      pos === 'bl' ? 'scaleY(-1)' : undefined,
  };
  return (
    <svg style={s} viewBox="0 0 28 28" fill="none">
      <path d="M3 3L3 16" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3 3L16 3" stroke="#C5A059" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="3" cy="3" r="2.4" fill="none" stroke="#C5A059" strokeWidth="0.8"/>
      <path d="M8 3Q6.5 6.5 9 8.5Q11.5 6.5 8 3Z" fill="#5A7A63" opacity="0.6"/>
      <path d="M3 8Q6.5 6.5 8.5 9Q6.5 11.5 3 8Z" fill="#5A7A63" opacity="0.6"/>
      <circle cx="9" cy="9" r="1.3" fill="#C5A059" opacity="0.7"/>
    </svg>
  );
}

const corners = (
  <>
    <Ornament pos="tl"/><Ornament pos="tr"/>
    <Ornament pos="bl"/><Ornament pos="br"/>
  </>
);

/* ── Cover symbol — interlaced rings ── */
const Rings = () => (
  <svg width="60" height="34" viewBox="0 0 60 34" fill="none" style={{ display: 'block', margin: '0 auto' }}>
    <circle cx="22" cy="17" r="12" stroke="#C5A059" strokeWidth="1.4" opacity="0.85"/>
    <circle cx="38" cy="17" r="12" stroke="#C5A059" strokeWidth="1.4" opacity="0.85"/>
    <path d="M22 5Q20 2 17 3Q19 6 22 5Z" fill="#5A7A63" opacity="0.7"/>
    <path d="M22 5Q24 2 27 3Q25 6 22 5Z" fill="#5A7A63" opacity="0.7"/>
    <path d="M38 5Q36 2 33 3Q35 6 38 5Z" fill="#5A7A63" opacity="0.7"/>
    <path d="M38 5Q40 2 43 3Q41 6 38 5Z" fill="#5A7A63" opacity="0.7"/>
  </svg>
);

/* ── Section divider ── */
const Divider = () => (
  <svg width="90" height="16" viewBox="0 0 90 16" fill="none" style={{ display: 'block', margin: '0.75rem auto' }}>
    <line x1="0" y1="8" x2="35" y2="8" stroke="rgba(197,160,89,0.45)" strokeWidth="0.8"/>
    <path d="M45 2Q47 8 45 14Q43 8 45 2Z" fill="#5A7A63" opacity="0.65"/>
    <path d="M40 8Q45 5.5 50 8Q45 10.5 40 8Z" fill="#5A7A63" opacity="0.65"/>
    <circle cx="45" cy="8" r="1.8" fill="#C5A059" opacity="0.8"/>
    <line x1="55" y1="8" x2="90" y2="8" stroke="rgba(197,160,89,0.45)" strokeWidth="0.8"/>
  </svg>
);

const gold  = '#C5A059';
const green = '#3B5442';
const text  = '#2E2A24';
const ivory = '#FCFAF6';

export default function Fabula() {
  const [progress, setProgress]         = useState(0);
  const [isPixOpen, setIsPixOpen]       = useState(false);
  const [copied, setCopied]             = useState(false);
  const [playing, setPlaying]           = useState(false);
  const [stars, setStars]               = useState<Star[]>([]);
  const [sparkles, setSparkles]         = useState<Sparkle[]>([]);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [mobilePage, setMobilePage]     = useState(0);
  const [activeAngle, setActiveAngle]   = useState<number | null>(null);
  const [activeDir, setActiveDir]       = useState<'fwd' | 'bwd' | null>(null);
  const [snapping, setSnapping]         = useState(false);
  const audioRef    = useRef<HTMLAudioElement>(null);
  const touchStart  = useRef<{ x: number; y: number; w: number } | null>(null);
  const snapTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [countdown, setCountdown] = useState({ days: '—', hours: '—', minutes: '—', seconds: '—' });

  useEffect(() => {
    setStars(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left:  `${Math.random() * 100}%`,
      top:   `${Math.random() * 100}%`,
      size:  `${0.5 + Math.random() * 2}px`,
      dur:   `${2 + Math.random() * 5}s`,
      delay: `${Math.random() * 5}s`,
      color: Math.random() > 0.6 ? '#C5A059' : Math.random() > 0.5 ? '#8FAF8A' : '#ffffff',
    })));
    setSparkles(Array.from({ length: 12 }, (_, i) => ({
      id: i + 200,
      left:  `${5 + Math.random() * 90}%`,
      top:   `${20 + Math.random() * 70}%`,
      size:  `${3 + Math.random() * 4}px`,
      dur:   `${5 + Math.random() * 5}s`,
      delay: `${Math.random() * 6}s`,
    })));
  }, []);

  /* Mobile portrait detection */
  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth;
      const mobile   = window.innerWidth < 900;
      setIsMobilePortrait(portrait && mobile);
    };
    check();
    const onOrient = () => { setMobilePage(0); setTimeout(check, 80); };
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', onOrient);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', onOrient);
    };
  }, []);

  /* Lock body scroll on mobile portrait */
  useEffect(() => {
    document.body.style.overflow = isMobilePortrait ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobilePortrait]);

  /* Audio autoplay — muted start bypasses browser block; unmutes on first gesture */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    audio.muted = true;
    audio.play()
      .then(() => {
        const unmute = () => { audio.muted = false; setPlaying(true); };
        window.addEventListener('pointerdown', unmute, { once: true });
        window.addEventListener('touchstart',  unmute, { once: true });
        window.addEventListener('keydown',     unmute, { once: true });
      })
      .catch(() => {
        audio.muted = false;
        const onGesture = () => {
          audio.play().then(() => setPlaying(true)).catch(() => {});
        };
        window.addEventListener('pointerdown', onGesture, { once: true });
        window.addEventListener('touchstart',  onGesture, { once: true });
        window.addEventListener('keydown',     onGesture, { once: true });
      });
  }, []);

  /* Countdown */
  useEffect(() => {
    function tick() {
      const diff = new Date('2026-09-26T15:00:00').getTime() - Date.now();
      if (diff <= 0) { setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' }); return; }
      setCountdown({
        days:    String(Math.floor(diff / 86400000)).padStart(2, '0'),
        hours:   String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Desktop scroll */
  useEffect(() => {
    const onScroll = () => setProgress(Math.max(0, Math.min(NUM_SHEETS, window.scrollY / window.innerHeight)));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  function copyPix() {
    navigator.clipboard.writeText('36ed70af-7aae-4610-b4c8-b026a7ccbc1b');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { audio.play().then(() => setPlaying(true)).catch(() => {}); }
    else              { audio.pause(); setPlaying(false); }
  }

  const jumpTo = (i: number) => window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' });

  /* ── 3-D page helpers ── */
  function mobileTransform(index: number): string {
    if (activeDir !== null && activeAngle !== null) {
      if (activeDir === 'fwd' && index === mobilePage)     return `rotateY(${activeAngle}deg)`;
      if (activeDir === 'bwd' && index === mobilePage - 1) return `rotateY(${activeAngle}deg)`;
    }
    return index < mobilePage ? 'rotateY(-180deg)' : 'rotateY(0deg)';
  }

  function mobileZ(index: number): number {
    if (activeDir !== null) {
      if (activeDir === 'fwd') {
        if (index === mobilePage)     return 100;
        if (index === mobilePage + 1) return 99;
      } else {
        if (index === mobilePage - 1) return 100;
        if (index === mobilePage)     return 99;
      }
    }
    if (index === mobilePage) return 100;
    if (index < mobilePage)   return index + 1;
    return 50 - index;
  }

  function mobileTransition(index: number): string {
    if (!snapping) return 'none';
    const snap = '0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    if (activeDir === 'fwd' && index === mobilePage)     return `transform ${snap}`;
    if (activeDir === 'bwd' && index === mobilePage - 1) return `transform ${snap}`;
    return 'none';
  }

  /* ── Audio unlock — must be called inside a native gesture handler ── */
  function ensureAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else if (audio.muted) {
      audio.muted = false;
      setPlaying(true);
    }
  }

  /* ── Dot / button navigation (no drag) ── */
  function navigateTo(target: number) {
    ensureAudio();
    if (target < 0 || target >= NUM_MOBILE_PAGES || target === mobilePage) return;
    if (activeAngle !== null || snapping) return;
    const dir: 'fwd' | 'bwd' = target > mobilePage ? 'fwd' : 'bwd';
    setActiveDir(dir);
    setSnapping(true);
    setActiveAngle(dir === 'fwd' ? -180 : 0);
    snapTimer.current = setTimeout(() => {
      setMobilePage(target);
      setActiveAngle(null);
      setActiveDir(null);
      setSnapping(false);
    }, 580);
  }

  /* ── Touch drag — page follows finger ── */
  function onTouchStart(e: React.TouchEvent) {
    ensureAudio();
    if (snapping) return;
    if (snapTimer.current) clearTimeout(snapTimer.current);
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, w: (e.currentTarget as HTMLElement).offsetWidth };
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!touchStart.current || snapping) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (activeDir === null && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
      touchStart.current = null; return;
    }
    if (Math.abs(dx) < 4) return;
    const w = touchStart.current.w;
    if (dx < 0 && mobilePage < NUM_MOBILE_PAGES - 1) {
      if (activeDir === null) setActiveDir('fwd');
      setActiveAngle(Math.max(-180, Math.min(0, (dx / w) * 180)));
    } else if (dx > 0 && mobilePage > 0) {
      if (activeDir === null) setActiveDir('bwd');
      setActiveAngle(Math.min(0, Math.max(-180, -180 + (dx / w) * 180)));
    }
  }

  function onTouchEnd() {
    if (!touchStart.current || activeDir === null || activeAngle === null) {
      touchStart.current = null; setActiveAngle(null); setActiveDir(null); return;
    }
    touchStart.current = null;
    const dir = activeDir;
    const angle = activeAngle;
    const SNAP = 310;
    setSnapping(true);
    if (dir === 'fwd') {
      if (angle < -90) {
        setActiveAngle(-180);
        snapTimer.current = setTimeout(() => {
          setMobilePage(p => Math.min(NUM_MOBILE_PAGES - 1, p + 1));
          setActiveAngle(null); setActiveDir(null); setSnapping(false);
        }, SNAP);
      } else {
        setActiveAngle(0);
        snapTimer.current = setTimeout(() => {
          setActiveAngle(null); setActiveDir(null); setSnapping(false);
        }, SNAP);
      }
    } else {
      if (angle > -90) {
        setActiveAngle(0);
        snapTimer.current = setTimeout(() => {
          setMobilePage(p => Math.max(0, p - 1));
          setActiveAngle(null); setActiveDir(null); setSnapping(false);
        }, SNAP);
      } else {
        setActiveAngle(-180);
        snapTimer.current = setTimeout(() => {
          setActiveAngle(null); setActiveDir(null); setSnapping(false);
        }, SNAP);
      }
    }
  }

  /* ── Mobile page renderer ── */
  function renderMobilePage(
    index: number,
    content: React.ReactNode,
    opts: { dark?: boolean; scrollable?: boolean } = {},
  ) {
    const { dark = false, scrollable = false } = opts;
    return (
      <div
        key={index}
        className={[styles.mobilePage, dark ? styles.mobilePageCover : ''].filter(Boolean).join(' ')}
        style={{ transform: mobileTransform(index), zIndex: mobileZ(index), transition: mobileTransition(index) }}
      >
        <div className={[styles.mobilePageContent, scrollable ? styles.mobileScrollable : ''].filter(Boolean).join(' ')}>
          {content}
          {!dark && corners}
        </div>
      </div>
    );
  }

  /* ── Gift row ── */
  const GiftRow = ({ img, name, price }: { img: string; name: string; price: string }) => (
    <div
      onClick={() => setIsPixOpen(true)}
      style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', padding: '0.18rem 0', borderBottom: '1px solid rgba(197,160,89,0.12)' }}
    >
      <img src={img} alt={name} style={{ width: 38, height: 38, objectFit: 'cover', flexShrink: 0, borderRadius: 2 }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.88rem', fontWeight: 500, color: text, lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.72rem', fontStyle: 'italic', color: '#6B5F50' }}>{price}</div>
      </div>
      <span style={{ color: gold, fontSize: '0.65rem', opacity: 0.75 }}>Pix →</span>
    </div>
  );

  /* ── Desktop sheet renderer ── */
  const renderSheet = (index: number, front: React.ReactNode, back: React.ReactNode, isCover = false) => {
    let angle = (progress - index) * -180;
    angle = Math.max(-180, Math.min(0, angle));
    const zIndex = angle < -90 ? index : NUM_SHEETS - index;

    const frontClass = [
      styles.front,
      isCover && index === 0              ? styles.coverFront       : '',
      isCover && index === NUM_SHEETS - 1 ? styles.insideCoverFront : '',
    ].join(' ');

    const backClass = [
      styles.back,
      isCover && index === NUM_SHEETS - 1 ? styles.coverBack       : '',
      isCover && index === 0              ? styles.insideCoverBack  : '',
    ].join(' ');

    return (
      <div key={index} className={styles.page} style={{ transform: `rotateY(${angle}deg)`, zIndex }}>
        <div className={frontClass}>
          {!(isCover && index === 0) && corners}
          <div className={styles.pageContent}>{front}</div>
        </div>
        <div className={backClass}>
          {!(isCover && index === NUM_SHEETS - 1) && corners}
          <div className={styles.pageContent}>{back}</div>
        </div>
      </div>
    );
  };

  /* ── Shared page content blocks ── */
  const coverContent = (
    <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem' }}>
      <Rings/>
      <p style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 'clamp(0.44rem,3vw,0.58rem)', letterSpacing: '0.32em', textTransform: 'uppercase', color: gold, margin: 0 }}>
        O Casamento de
      </p>
      <h1 className={styles.title}>Caio &amp; Sophia</h1>
      <Divider/>
      <p style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 'clamp(0.48rem,3.2vw,0.62rem)', color: gold, letterSpacing: '0.22em', margin: 0 }}>
        26 · 09 · 2026
      </p>
      <p style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontSize: 'clamp(0.7rem,4vw,0.85rem)', color: 'rgba(197,160,89,0.7)', letterSpacing: '0.1em', margin: '3rem 0 0' }}>
        Poços de Caldas — Minas Gerais
      </p>
    </div>
  );

  const insideCoverContent = (
    <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: ivory, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <p style={{ fontFamily: '"Great Vibes",cursive', fontSize: 'clamp(2rem,10vw,2.8rem)', color: gold, lineHeight: 1, margin: 0 }}>Para Sempre</p>
      <div style={{ width: 36, height: 1, background: 'rgba(197,160,89,0.4)' }}/>
      <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(0.78rem,4vw,0.95rem)', color: ivory, letterSpacing: '0.04em', lineHeight: 1.7, opacity: 0.8, maxWidth: 260, margin: 0 }}>
        O amor é paciente, é bondoso.<br/>
        Tudo sofre, tudo crê,<br/>tudo espera, tudo suporta.<br/>
        <br/><em>— 1 Coríntios 13:4‑7</em>
      </p>
    </div>
  );

  const historiaP1Content = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '2.2rem' }}>
      <p className={styles.chapter}>Nossa História</p>
      <h2 className={styles.chapterTitle}>Uma Tarde em 2014</h2>
      <p className={styles.text}>
        <span className={styles.dropCap}>E</span>m 2014, os corredores da universidade os apresentaram brevemente — o suficiente para que duas memórias se formassem sem ainda saber por quê. Os anos passaram, cada um seguiu sua vida, até que o acaso os colocou de volta na mesma calçada.
      </p>
      <p className={styles.text}>
        Nada havia sido perdido. O tempo apenas aguardava o momento certo.
      </p>
      <div className={styles.quote}>
        "Até que, numa tarde na Rua John Pinheiro, uma voz familiar atravessou o ar — <em>Pescoço!</em>"
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginTop: '0.8rem' }}>
        <img src="/images/image_21.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', display: 'block' }}/>
        <img src="/images/image_22.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}/>
      </div>
    </div>
  );

  const historiaP2Content = (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', gap: '0.7rem', overflow: 'hidden' }}>
      <div style={{ flex: '0 0 52%', overflow: 'hidden', borderRadius: 3 }}>
        <img src="/images/image_1.png" alt="Caio e Sophia"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}/>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.9rem' }}>
        <p className={styles.text} style={{ margin: 0, lineHeight: 1.6 }}>
          Era a Sophia.<br/>
          Sem pretensão, sem ensaio — apenas a pergunta certa, na hora certa:<br/>
          <em>"O que tem de bom pra fazer hoje?"</em>
        </p>
        <p className={styles.text} style={{ margin: 0, lineHeight: 1.6 }}>
          Ficaram.<br/>
          E desde aquela tarde, nunca mais precisaram se separar.
        </p>
      </div>
    </div>
  );

  const celebracaoContent = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <p className={styles.chapter}>A Celebração</p>
      <h2 className={styles.chapterTitle}>26 de Setembro de 2026</h2>
      <p className={styles.text} style={{ textAlign: 'center', fontStyle: 'italic', color: '#6B5F50', marginBottom: '0.8rem' }}>
        Sábado · Poços de Caldas, MG
      </p>
      <div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineTime}>15h</div>
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond",serif', color: text, fontSize: '1.1rem', marginBottom: '0.08rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              Cerimônia
            </h4>
            <p className={styles.text} style={{ fontSize: '0.85rem', marginBottom: 0 }}>
              Início da cerimônia de união.
            </p>
          </div>
        </div>
        <div className={styles.timelineItem}>
          <div className={styles.timelineTime}>Após</div>
          <div>
            <h4 style={{ fontFamily: '"Cormorant Garamond",serif', color: text, fontSize: '1.1rem', marginBottom: '0.08rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              Festa &amp; Churrasco
            </h4>
            <p className={styles.text} style={{ fontSize: '0.85rem', marginBottom: 0 }}>
              A recepção começa com música, risos e muito amor.
            </p>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, margin: '0.8rem 0.8rem 1.8rem', overflow: 'hidden', borderRadius: 3 }}>
        <img src="/images/image_13.png" alt="Local"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }}/>
      </div>
    </div>
  );

  const localContent = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
      <div>
        <p className={styles.chapter} style={{ marginBottom: '0.2rem' }}>O Local</p>
        <h2 className={styles.chapterTitle} style={{ marginBottom: '0.5rem' }}>Caldas — Minas Gerais</h2>
        <p className={styles.text} style={{ fontSize: '0.87rem', textAlign: 'center', margin: 0 }}>
          Al. Poços de Caldas, 163 — Laranjeiras, Caldas MG.<br/>Ambiente ao ar livre.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <div className={styles.localCard}>
          <div className={styles.localCardTitle}><span>🚗</span> Estacionamento</div>
          <p className={styles.text} style={{ fontSize: '0.8rem', marginBottom: 0 }}>Disponível no local.</p>
        </div>
        <div className={styles.localCard}>
          <div className={styles.localCardTitle}><span>📍</span> Endereço</div>
          <p className={styles.text} style={{ fontSize: '0.8rem', marginBottom: 0 }}>Laranjeiras — Caldas, MG · CEP 37780-000</p>
        </div>
      </div>
      <a href="https://maps.google.com/?q=Al.+Po%C3%A7os+de+Caldas,+163+Laranjeiras+Caldas+MG+37780-000"
        target="_blank" rel="noreferrer" className={styles.mapLink}>
        Ver Rota no Google Maps
      </a>
    </div>
  );

  const trajeContent = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
      <div>
        <p className={styles.chapter} style={{ marginBottom: '0.2rem' }}>Traje</p>
        <h2 className={styles.chapterTitle} style={{ marginBottom: '0.5rem' }}>Esporte Fino</h2>
        <p className={styles.text} style={{ fontSize: '0.87rem', margin: 0 }}>
          O casamento será ao ar livre. Sugerimos tons que harmonizam com o cenário:
        </p>
      </div>
      <div className={styles.swatchGrid}>
        {[
          { bg: '#D2C4A8', name: 'Areia'   },
          { bg: '#8FAF8A', name: 'Sage'     },
          { bg: '#C4A882', name: 'Caramelo' },
          { bg: '#5A7A63', name: 'Musgo'    },
        ].map(sw => (
          <div key={sw.name} className={styles.swatch}>
            <div className={styles.swatchColor} style={{ background: sw.bg }}/>{sw.name}
          </div>
        ))}
      </div>
      <div>
        <p className={styles.text} style={{ fontSize: '0.82rem', fontStyle: 'italic', textAlign: 'center', margin: '0 0 0.5rem' }}>
          Para as damas, evitem salto agulha no gramado.
        </p>
        <div className={styles.dressCodeAlert}>
          Estas cores são apenas sugestão. <strong>Venha como você é.</strong><br/>O que importa é a sua presença.
        </div>
      </div>
    </div>
  );

  const presentesP1Content = (
    <>
      <p className={styles.chapter}>Lista de Presentes</p>
      <h2 className={styles.chapterTitle} style={{ marginBottom: '0.35rem' }}>Para o Novo Lar</h2>
      <p className={styles.text} style={{ fontSize: '0.78rem', marginBottom: '0.45rem', textAlign: 'center' }}>
        A maior alegria é a sua presença. Se desejar, escolha um presente:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <GiftRow img="/images/image_2.png" name="Jogo de Xícaras"    price="a partir de R$ 100"/>
        <GiftRow img="/images/image_3.png" name="Jogo de Toalhas"    price="R$ 150 – R$ 300"/>
        <GiftRow img="/images/image_4.png" name="Cafeteira Italiana" price="R$ 200 – R$ 380"/>
        <GiftRow img="/images/image_5.png" name="Jogo de Panelas"    price="R$ 350 – R$ 600"/>
        <GiftRow img="/images/image_6.png" name="Jogo de Cama"       price="R$ 400 – R$ 700"/>
        <GiftRow img="/images/image_7.png" name="Air Fryer"          price="R$ 500 – R$ 900"/>
      </div>
    </>
  );

  const presentesP2Content = (
    <>
      <p className={styles.chapter} style={{ opacity: 0 }}>·</p>
      <h2 className={styles.chapterTitle} style={{ marginBottom: '0.35rem' }}>Mais Presentes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <GiftRow img="/images/image_8.png"  name="Aparelho de Jantar" price="R$ 600 – R$ 1.200"/>
        <GiftRow img="/images/image_9.png"  name="Adega / Frigobar"   price="R$ 1.200 – R$ 2.000"/>
        <GiftRow img="/images/image_10.png" name="Robô Aspirador"     price="R$ 2.000 – R$ 3.500"/>
        <GiftRow img="/images/image_11.png" name="Smart TV"           price="R$ 3.500 – R$ 5.000"/>
        <GiftRow img="/images/image_12.png" name="Lua de Mel ✈"      price="Valor livre"/>
      </div>
      <div style={{
        marginTop: '0.75rem', padding: '0.55rem 0.75rem',
        border: '1px solid rgba(197,160,89,0.4)',
        background: 'rgba(197,160,89,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
      }}>
        <div>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B5F50', margin: 0 }}>
            Presentear em dinheiro?
          </p>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem', fontStyle: 'italic', color: text, margin: '0.08rem 0 0' }}>
            Pix — qualquer valor
          </p>
        </div>
        <button onClick={() => setIsPixOpen(true)}
          style={{ flexShrink: 0, background: '#19241C', color: gold, border: 'none', padding: '0.4rem 0.75rem', fontFamily: '"Cinzel Decorative",serif', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Ver Chave
        </button>
      </div>
    </>
  );

  const gi: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: 2, display: 'block' };

  const galeriaP1Content = (
    <>
      <p className={styles.chapter}>Galeria</p>
      <h2 className={styles.chapterTitle} style={{ marginBottom: '0.5rem' }}>Momentos</h2>
      {/* organic asymmetric collage — larger top-left, shifts right on row 2 */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '58% 42%', gridTemplateRows: '56% 44%', gap: '0.25rem' }}>
        <img src="/images/image_13.png" style={gi} alt=""/>
        <img src="/images/image_14.png" style={gi} alt=""/>
        <img src="/images/image_15.png" style={gi} alt=""/>
        <img src="/images/image_16.png" style={gi} alt=""/>
      </div>
    </>
  );

  const galeriaP2Content = (
    <>
      <h2 className={styles.chapterTitle} style={{ marginBottom: '0.4rem' }}>Nosso Álbum</h2>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '54% 46%', gridTemplateRows: '52% 48%', gap: '0.25rem' }}>
        <img src="/images/image_17.png" style={gi} alt=""/>
        <img src="/images/image_18.jpg" style={gi} alt=""/>
        <img src="/images/image_19.jpg" style={gi} alt=""/>
        <img src="/images/image_20.jpg" style={gi} alt=""/>
      </div>
    </>
  );

  const rsvpContent = (
    <>
      <p className={styles.chapter}>Confirmação</p>
      <h2 className={styles.chapterTitle} style={{ marginBottom: '0.15rem' }}>Confirme sua Presença</h2>
      <p className={styles.text} style={{ textAlign: 'center', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
        Confirmar até <strong>31 de agosto de 2026</strong>.
      </p>
      <div className={styles.rsvpWrapper}>
        <RsvpForm/>
      </div>
    </>
  );

  const encerramentoContent = (
    <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
      <p style={{ fontFamily: '"Great Vibes",cursive', fontSize: 'clamp(1.8rem,10vw,2.8rem)', color: gold, lineHeight: 1, margin: 0 }}>
        Caio &amp; Sophia
      </p>
      <h2 style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: 'clamp(0.8rem,4vw,1.1rem)', fontWeight: 400, color: green, letterSpacing: '0.12em', margin: 0 }}>
        26 · 09 · 2026
      </h2>
      <Divider/>
      <img src="/images/image_1.png" alt="Caio e Sophia"
        style={{ width: '52%', display: 'block', borderRadius: '50%', aspectRatio: '1', objectFit: 'cover', objectPosition: 'center 15%', border: '2px solid rgba(197,160,89,0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}/>
    </div>
  );

  const contracapaContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: ivory }}>
      <div style={{ width: 54, height: 54, border: '1px solid rgba(197,160,89,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
        <span style={{ fontFamily: '"Great Vibes",cursive', color: gold, fontSize: '1.6rem' }}>C&amp;S</span>
      </div>
      <div style={{ textAlign: 'center', color: 'rgba(197,160,89,0.65)', fontFamily: '"Cormorant Garamond",serif' }}>
        <p style={{ fontSize: '0.95rem', margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Caio &amp; Sophia</p>
        <p style={{ fontSize: '0.7rem', margin: '0.5rem 0', letterSpacing: '0.2em', opacity: 0.8 }}>26 · 09 · 2026</p>
        <p style={{ fontSize: '0.7rem', fontStyle: 'italic', opacity: 0.55 }}>Feito com amor para o grande dia.</p>
      </div>
    </div>
  );

  /* ── Mobile page list ── */
  const mobilePages = [
    renderMobilePage(0,  coverContent,       { dark: true }),
    renderMobilePage(1,  insideCoverContent, { dark: true }),
    renderMobilePage(2,  historiaP1Content),
    renderMobilePage(3,  historiaP2Content),
    renderMobilePage(4,  celebracaoContent),
    renderMobilePage(5,  localContent),
    renderMobilePage(6,  trajeContent),
    renderMobilePage(7,  presentesP1Content, { scrollable: true }),
    renderMobilePage(8,  presentesP2Content, { scrollable: true }),
    renderMobilePage(9,  galeriaP1Content,  { scrollable: true }),
    renderMobilePage(10, galeriaP2Content,  { scrollable: true }),
    renderMobilePage(11, rsvpContent,        { scrollable: true }),
    renderMobilePage(12, encerramentoContent, { dark: true }),
    renderMobilePage(13, contracapaContent,   { dark: true }),
  ];

  const mobileNavLabels = [
    'Capa','Verso','Hist.','Hist.','Progr.','Local',
    'Traje','Pres.','Pres.','Gal.','Gal.','RSVP','Fim','',
  ];

  return (
    <div className={styles.bodyWrapper}>

      <audio ref={audioRef} src="/musica.mp3" loop preload="auto" />

      {/* ── Music toggle ── */}
      <button
        onClick={toggleMusic}
        aria-label={playing ? 'Pausar música' : 'Tocar música'}
        style={{
          position: 'fixed', bottom: '1rem', right: '1.2rem', zIndex: 200,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(17,20,18,0.75)',
          border: `1px solid rgba(197,160,89,${playing ? '0.7' : '0.35'})`,
          color: gold, fontSize: '1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: playing ? '0 0 10px rgba(197,160,89,0.35)' : 'none',
        }}
      >
        {playing ? '♫' : '♪'}
      </button>

      {/* ── Stars ── */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          width: s.size, height: s.size, background: s.color,
          left: s.left, top: s.top,
          boxShadow: `0 0 ${parseFloat(s.size) * 2.5}px ${s.color}`,
          animation: `twinkle ${s.dur} ${s.delay} infinite ease-in-out`,
        }}/>
      ))}

      {/* ── Sparkles ── */}
      {sparkles.map(s => (
        <div key={s.id} style={{
          position: 'fixed', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          width: s.size, height: s.size,
          background: 'radial-gradient(circle, #C5A059 30%, rgba(197,160,89,0) 100%)',
          left: s.left, top: s.top,
          animation: `sparkleRise ${s.dur} ${s.delay} infinite ease-in-out`,
        }}/>
      ))}

      {/* ══ MOBILE PORTRAIT — immersive open book ══ */}
      <div className={styles.mobileContainer}>

        {/* Top section: brand + section shortcuts */}
        <div className={styles.mobileTopSection}>
          <p className={styles.mobileBrandHeader}>Caio &amp; Sophia</p>
          <div className={styles.mobileTopNav}>
            {[
              { label: 'História',    target: 2,  end: 3  },
              { label: 'Programação', target: 4,  end: 4  },
              { label: 'Local',       target: 5,  end: 5  },
              { label: 'Traje',       target: 6,  end: 6  },
              { label: 'Presentes',   target: 7,  end: 8  },
              { label: 'Galeria',     target: 9,  end: 10 },
              { label: 'Confirmar',   target: 11, end: 13 },
            ].map(s => (
              <button
                key={s.label}
                className={[
                  styles.mobileTopNavBtn,
                  mobilePage >= s.target && mobilePage <= s.end ? styles.mobileTopNavBtnActive : '',
                  s.label === 'Confirmar' ? styles.mobileTopNavBtnCta : '',
                ].filter(Boolean).join(' ')}
                onClick={() => navigateTo(s.target)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.mobileBook}>
          <div
            className={styles.mobilePagesContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            {mobilePages}
          </div>

          {/* Flip hint — only on cover, disappears once user navigates */}
          {mobilePage === 0 && (
            <div className={styles.mobileFlipHint} aria-hidden="true">
              <div className={styles.mobileCornerPeel}/>
              <div className={styles.mobileSwipeHintWrap}>
                <div className={styles.mobileSwipeHint}>
                  <svg width="38" height="18" viewBox="0 0 38 18" fill="none">
                    <path d="M25 2L17 9L25 16" stroke="rgba(197,160,89,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36 2L28 9L36 16" stroke="rgba(197,160,89,0.45)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: '"Cinzel Decorative",serif', fontSize: '0.42rem', color: 'rgba(197,160,89,0.72)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Virar
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mobileBottomBar}>
          <div className={styles.mobileNavDots}>
            <button className={styles.mobilePrev} onClick={() => navigateTo(mobilePage - 1)} aria-label="Anterior">‹</button>
            {Array.from({ length: NUM_MOBILE_PAGES }, (_, i) => (
              <div
                key={i}
                className={[styles.mobileDot, i === mobilePage ? styles.mobileDotActive : ''].join(' ')}
                onClick={() => navigateTo(i)}
                title={mobileNavLabels[i]}
              />
            ))}
            <button className={styles.mobileNext} onClick={() => navigateTo(mobilePage + 1)} aria-label="Próximo">›</button>
          </div>

          <div className={styles.mobileCountdown}>
            {(['days','hours','minutes','seconds'] as const).map((k, i) => (
              <div key={k} className={styles.mobileCountdownItem}>
                <span className={styles.mobileCountdownNum}>{countdown[k]}</span>
                <span className={styles.mobileCountdownLabel}>{['dias','horas','min','seg'][i]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ══ DESKTOP — scroll-driven flipbook ══ */}
      <div className={styles.scrollContainer} style={{ height: `${(NUM_SHEETS + 1) * 100}vh` }}/>

      <nav className={styles.navBar}>
        <button onClick={() => jumpTo(1)}>História</button>
        <button onClick={() => jumpTo(2)}>Programação</button>
        <button onClick={() => jumpTo(2)}>Local</button>
        <button onClick={() => jumpTo(3)}>Traje</button>
        <button onClick={() => jumpTo(3)}>Presentes</button>
        <button onClick={() => jumpTo(4)}>Galeria</button>
        <button onClick={() => jumpTo(5)}>Confirmar</button>
      </nav>

      <div className={styles.fixedWrapper}>

        <div className={styles.persistentCountdown}>
          {(['days','hours','minutes','seconds'] as const).map((k, i) => (
            <div key={k} className={styles.countdownItem}>
              <span className={styles.countdownNum}>{countdown[k]}</span>
              <span className={styles.countdownLabel}>{['dias','horas','min','seg'][i]}</span>
            </div>
          ))}
        </div>

        {progress < 0.5 && (
          <div className={styles.scrollPrompt}>Vire a Página</div>
        )}

        <div className={styles.book} style={{ transform: `translateX(0%)` }}>

          {renderSheet(0,
            coverContent,
            insideCoverContent,
            true,
          )}

          {renderSheet(1,
            historiaP1Content,
            historiaP2Content,
          )}

          {renderSheet(2,
            celebracaoContent,
            localContent,
          )}

          {renderSheet(3,
            trajeContent,
            presentesP1Content,
          )}

          {renderSheet(4,
            presentesP2Content,
            galeriaP1Content,
          )}

          {renderSheet(5,
            galeriaP2Content,
            rsvpContent,
          )}

          {renderSheet(6,
            encerramentoContent,
            contracapaContent,
            true,
          )}

        </div>
      </div>

      {/* ── Pix modal ── */}
      {isPixOpen && (
        <div className={styles.pixModal} onClick={() => setIsPixOpen(false)}>
          <div className={styles.pixModalContent} onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: text, fontWeight: 300, lineHeight: 1 }}
              onClick={() => setIsPixOpen(false)}>×</button>
            <h3 style={{ fontFamily: '"Great Vibes",cursive', fontSize: '2.4rem', color: gold, margin: '0.8rem 0 0.4rem' }}>Com Gratidão</h3>
            <p className={styles.text} style={{ fontSize: '1rem', textAlign: 'center', marginBottom: '1.4rem' }}>
              Todos os presentes são recebidos via Pix. Copie a chave abaixo:
            </p>
            <div style={{ padding: '0.9rem', border: '1px solid rgba(197,160,89,0.3)', wordBreak: 'break-all', margin: '1rem 0', fontFamily: '"Cormorant Garamond",serif', fontSize: '1rem', color: text, letterSpacing: '0.04em' }}>
              36ed70af-7aae-4610-b4c8-b026a7ccbc1b
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6B5F50', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Caio Luiz de Paula Vieira · PicPay
            </p>
            <button onClick={copyPix}
              style={{ background: copied ? '#19241C' : gold, color: ivory, border: 'none', padding: '0.9rem 1.8rem', fontFamily: '"Cinzel Decorative",serif', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', width: '100%', transition: 'all 0.4s ease' }}>
              {copied ? 'Chave Copiada ✓' : 'Copiar Chave Pix'}
            </button>
            <p style={{ fontSize: '0.85rem', color: '#6B5F50', fontStyle: 'italic', marginTop: '1.2rem' }}>
              Qualquer valor é imensamente bem-vindo.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
