'use client';
import { useEffect, useState } from 'react';
import RsvpForm from '@/components/RsvpForm';
import styles from './fabula.module.css';

const NUM_SHEETS = 7;

export default function Flipbook() {
  const [progress, setProgress] = useState(0);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number, left: string, top: string, animationDuration: string, opacity: number }[]>([]);
  const [countdown, setCountdown] = useState({ days: '—', hours: '—', minutes: '—', seconds: '—' });

  // Minimalist Luxury Sparkles (ambient dust)
  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${3 + Math.random() * 6}s`,
      opacity: 0.1 + Math.random() * 0.4
    }));
    setSparkles(newSparkles);
  }, []);

  useEffect(() => {
    function updateCountdown() {
      const wedding = new Date('2026-09-26T16:00:00');
      const now = new Date();
      const diff = wedding.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      const p = scrollY / wh;
      setProgress(Math.max(0, Math.min(NUM_SHEETS, p)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  function handleCopyPix() {
    navigator.clipboard.writeText('36ed70af-7aae-4610-b4c8-b026a7ccbc1b');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const jumpToSheet = (sheetIndex: number) => {
    window.scrollTo({
      top: sheetIndex * window.innerHeight,
      behavior: 'smooth'
    });
  };

  const renderSheet = (index: number, frontContent: React.ReactNode, backContent: React.ReactNode, isCover = false) => {
    let angle = (progress - index) * -180;
    angle = Math.max(-180, Math.min(0, angle));
    const zIndex = angle < -90 ? index : NUM_SHEETS - index;

    return (
      <div key={index} className={styles.page} style={{ transform: `rotateY(${angle}deg)`, zIndex }}>
        <div className={`${styles.front} ${isCover && index === 0 ? styles.coverFront : ''} ${isCover && index === NUM_SHEETS - 1 ? styles.insideCoverFront : ''}`}>
          {isCover && index === 0 ? null : (
            <>
              <div className={`${styles.cornerDecor} ${styles.topLeft}`}></div>
              <div className={`${styles.cornerDecor} ${styles.topRight}`}></div>
              <div className={`${styles.cornerDecor} ${styles.bottomLeft}`}></div>
              <div className={`${styles.cornerDecor} ${styles.bottomRight}`}></div>
            </>
          )}
          <div className={styles.pageContent}>{frontContent}</div>
        </div>
        
        <div className={`${styles.back} ${isCover && index === NUM_SHEETS - 1 ? styles.coverBack : ''} ${isCover && index === 0 ? styles.insideCoverBack : ''}`}>
          {isCover && index === NUM_SHEETS - 1 ? null : (
            <>
              <div className={`${styles.cornerDecor} ${styles.topLeft}`}></div>
              <div className={`${styles.cornerDecor} ${styles.topRight}`}></div>
              <div className={`${styles.cornerDecor} ${styles.bottomLeft}`}></div>
              <div className={`${styles.cornerDecor} ${styles.bottomRight}`}></div>
            </>
          )}
          <div className={styles.pageContent}>{backContent}</div>
        </div>
      </div>
    );
  };

  const xTranslate = -25 + (progress / NUM_SHEETS) * 50;

  return (
    <div className={styles.bodyWrapper}>
      {sparkles.map(s => (
        <div 
          key={s.id} 
          style={{ 
            position: 'absolute', width: '2px', height: '2px', background: '#C5A059', 
            borderRadius: '50%', pointerEvents: 'none', 
            left: s.left, top: s.top, 
            opacity: s.opacity,
            boxShadow: '0 0 4px #C5A059'
          }} 
        />
      ))}
      
      <div className={styles.scrollContainer} style={{ height: `${(NUM_SHEETS + 1) * 100}vh` }}></div>
      
      <nav className={styles.navBar}>
        <button onClick={() => jumpToSheet(1)}>História</button>
        <button onClick={() => jumpToSheet(2)}>Local</button>
        <button onClick={() => jumpToSheet(3)}>Traje</button>
        <button onClick={() => jumpToSheet(3)}>Presentes</button>
        <button onClick={() => jumpToSheet(4)}>Galeria</button>
        <button onClick={() => jumpToSheet(5)}>Confirmar</button>
      </nav>

      <div className={styles.fixedWrapper}>
        <div className={styles.persistentCountdown}>
          <div className={styles.countdownItem}>
            <span className={styles.countdownNum}>{countdown.days}</span>
            <span className={styles.countdownLabel}>dias</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownNum}>{countdown.hours}</span>
            <span className={styles.countdownLabel}>horas</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownNum}>{countdown.minutes}</span>
            <span className={styles.countdownLabel}>minutos</span>
          </div>
          <div className={styles.countdownItem}>
            <span className={styles.countdownNum}>{countdown.seconds}</span>
            <span className={styles.countdownLabel}>segundos</span>
          </div>
        </div>

        {progress < 0.5 && (
          <div className={styles.scrollPrompt}>Descubra Nossa História</div>
        )}

        <div className={styles.book} style={{ transform: `translateX(${xTranslate}%)` }}>
          
          {/* SHEET 0: COVER / INSIDE COVER */}
          {renderSheet(0, 
            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '2rem' }}>O Casamento de</p>
              <h1 className={styles.title} style={{ fontSize: '4.5rem', marginBottom: '1.5rem', color: '#C5A059' }}>Caio & Sophia</h1>
              <div style={{ width: '40px', height: '1px', background: 'rgba(197, 160, 89, 0.5)', margin: '2rem auto' }}></div>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.8rem', color: '#C5A059', letterSpacing: '0.25em' }}>26 DE SETEMBRO DE 2026</p>
            </div>,
            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#FCFAF6' }}>
              <p style={{ fontFamily: '"Great Vibes", cursive', fontSize: '3rem', color: '#C5A059', marginBottom: '1rem', lineHeight: 1 }}>À Espera do Sim</p>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#FCFAF6', letterSpacing: '0.05em', lineHeight: 1.6, opacity: 0.8, maxWidth: '250px', margin: '0 auto' }}>
                O amor é paciente, é bondoso.<br/>Tudo sofre, tudo crê, tudo espera, tudo suporta.<br/><br/><i>— Coríntios 13:4-7</i>
              </p>
            </div>,
            true
          )}

          {/* SHEET 1: HISTÓRIA P1 / HISTÓRIA P2 */}
          {renderSheet(1, 
            <>
              <h2 className={styles.chapter}>Nossa História</h2>
              <h3 className={styles.chapterTitle}>Uma tarde em 2014</h3>
              <p className={styles.text}>
                <span className={styles.dropCap}>E</span>ra o ano de 2014. A faculdade começava, e com ela um encontro rápido entre dois calouros que logo se perderam nos corredores da vida universitária. Os anos passaram — cada um seguiu o seu caminho, formou-se, seguiu em frente.
              </p>
              <p className={styles.text}>
                Nossos mundos orbitavam separados, aguardando o momento exato em que o destino decidiria cruzar nossas linhas.
              </p>
              <div className={styles.quote} style={{ marginTop: 'auto', fontSize: '1.1rem' }}>
                "Até o dia em que o Caio passou pela Rua John Pinheiro com a galera da República Caverna, e uma voz conhecida gritou: — Pescoço!"
              </div>
            </>,
            <>
              {/* Full natural photo - no cropping */}
              <div style={{ flex: '0 0 auto', margin: '-2.5rem -2rem 0', overflow: 'hidden' }}>
                <img src="/images/image_1.png" alt="O Casal" style={{ width: '100%', height: '55%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
              </div>
              <p className={styles.text} style={{ marginTop: '1.2rem' }}>
                Era a Sophia. Sem pretensão, sem planos — só aquela pergunta simples: <em>"O que tem de bom pra fazer hoje?"</em>
              </p>
              <p className={styles.text}>
                Naquela tarde, os dois ficaram. E desde então, nunca mais se separaram para nada.
              </p>
            </>
          )}

          {/* SHEET 2: PROGRAMAÇÃO / LOCAL */}
          {renderSheet(2, 
            <>
              <h2 className={styles.chapter}>O Grande Dia</h2>
              <h3 className={styles.chapterTitle}>A Celebração</h3>
              <p className={styles.text} style={{ textAlign: 'center', marginBottom: '1rem', fontStyle: 'italic', color: '#7A756D' }}>
                Sábado, 26 de setembro
              </p>
              <div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineTime}>16:00</div>
                  <div>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#19241C', fontSize: '1.15rem', marginBottom: '0.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>Cerimônia</h4>
                    <p className={styles.text} style={{ fontSize: '0.9rem', marginBottom: 0 }}>Início da consagração de nossa união.</p>
                  </div>
                </div>
                <div className={styles.timelineItem} style={{ marginBottom: '0.5rem' }}>
                  <div className={styles.timelineTime}>Após</div>
                  <div>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#19241C', fontSize: '1.15rem', marginBottom: '0.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>Festa & Churrasco</h4>
                    <p className={styles.text} style={{ fontSize: '0.9rem', marginBottom: 0 }}>A recepção começa com música e muito amor.</p>
                  </div>
                </div>
              </div>
              <img src="/images/image_13.png" alt="O Local" className={styles.imgCenter} style={{ maxHeight: '90px', objectFit: 'cover', objectPosition: 'center top' }} />
            </>,
            <>
              <h2 className={styles.chapter}>Onde Será</h2>
              <h3 className={styles.chapterTitle}>Caldas — MG</h3>
              <p className={styles.text} style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '0.8rem' }}>
                Al. Poços de Caldas, 163 — Laranjeiras, Caldas MG. Ambiente ao ar livre.
              </p>
              <div className={styles.localGrid}>
                <div className={styles.localCard}>
                  <div className={styles.localCardTitle}><span>🚗</span> Estacionamento</div>
                  <p className={styles.text} style={{ fontSize: '0.82rem', marginBottom: 0 }}>Disponível no local.</p>
                </div>
                <div className={styles.localCard}>
                  <div className={styles.localCardTitle}><span>🏡</span> Hospedagem</div>
                  <p className={styles.text} style={{ fontSize: '0.82rem', marginBottom: 0 }}>Espaço para familiares distantes.</p>
                </div>
                <div className={styles.localCard} style={{ gridColumn: '1 / -1' }}>
                  <div className={styles.localCardTitle}><span>📍</span> Endereço Completo</div>
                  <p className={styles.text} style={{ fontSize: '0.82rem', marginBottom: 0 }}>Laranjeiras — Caldas, MG / CEP 37780-000</p>
                </div>
              </div>
              <a href="https://maps.google.com/?q=Al.+Po%C3%A7os+de+Caldas,+163+Laranjeiras+Caldas+MG+37780-000" target="_blank" className={styles.mapLink}>
                Ver Rota no Google Maps
              </a>
            </>
          )}

          {/* SHEET 3: DRESS CODE / PRESENTES P1 */}
          {renderSheet(3, 
            <>
              <h2 className={styles.chapter}>Como se Vestir</h2>
              <h3 className={styles.chapterTitle} style={{ marginBottom: '0.8rem' }}>Traje Esporte Fino</h3>
              <p className={styles.text} style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                O casamento será ao ar livre. Sugerimos tons da natureza que harmonizam com o cenário:
              </p>
              <div className={styles.swatchGrid}>
                <div className={styles.swatch}><div className={styles.swatchColor} style={{ background: '#D2C4A8' }}></div> Areia</div>
                <div className={styles.swatch}><div className={styles.swatchColor} style={{ background: '#8FAF8A' }}></div> Sage</div>
                <div className={styles.swatch}><div className={styles.swatchColor} style={{ background: '#C4A882' }}></div> Caramelo</div>
                <div className={styles.swatch}><div className={styles.swatchColor} style={{ background: '#5A7A63' }}></div> Musgo</div>
              </div>
              <p className={styles.text} style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.5rem', textAlign: 'center', marginBottom: 0 }}>
                Dica: para as damas, evitem salto agulha.
              </p>
              <div className={styles.dressCodeAlert}>
                Estas cores são apenas sugestão. <strong>Sinta-se livre</strong> para vestir o que desejar. O que importa é você.
              </div>
            </>,
            <>
              <h2 className={styles.chapter}>Presentear com carinho</h2>
              <h3 className={styles.chapterTitle} style={{ marginBottom: '0.4rem' }}>Lista de Casamento</h3>
              <p className={styles.text} style={{ fontSize: '0.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                A maior alegria é a sua presença. Se desejar, escolha um presente.
              </p>
              {/* Row-style gifts: image + name + price in a horizontal line */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  { img: '/images/image_2.png', name: 'Jogo de Xícaras', price: 'a partir de R$ 100' },
                  { img: '/images/image_3.png', name: 'Jogo de Toalhas', price: 'R$ 150 – R$ 300' },
                  { img: '/images/image_4.png', name: 'Cafeteira', price: 'R$ 200 – R$ 380' },
                  { img: '/images/image_5.png', name: 'Jogo de Panelas', price: 'R$ 350 – R$ 600' },
                  { img: '/images/image_6.png', name: 'Jogo de Cama', price: 'R$ 400 – R$ 700' },
                  { img: '/images/image_7.png', name: 'Air Fryer', price: 'R$ 500 – R$ 900' },
                ].map((gift, i) => (
                  <div key={i} onClick={() => setIsPixModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.2rem 0', borderBottom: '1px solid rgba(197,160,89,0.12)' }}>
                    <img src={gift.img} alt={gift.name} style={{ width: '40px', height: '40px', objectFit: 'cover', flexShrink: 0, borderRadius: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', fontWeight: 500, color: '#19241C', lineHeight: 1.2 }}>{gift.name}</div>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.75rem', fontStyle: 'italic', color: '#7A756D' }}>{gift.price}</div>
                    </div>
                    <span style={{ color: '#C5A059', fontSize: '0.7rem', opacity: 0.7 }}>Pix →</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SHEET 4: PRESENTES P2 / GALERIA P1 */}
          {renderSheet(4, 
            <>
              <h2 className={styles.chapter} style={{ opacity: 0 }}>Lista de Presentes</h2>
              <h3 className={styles.chapterTitle} style={{ marginBottom: '0.4rem' }}>Mais Presentes</h3>
              {/* Row-style gifts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  { img: '/images/image_8.png', name: 'Aparelho de Jantar', price: 'R$ 600 – R$ 1.200' },
                  { img: '/images/image_9.png', name: 'Adega / Frigobar', price: 'R$ 1.200 – R$ 2.000' },
                  { img: '/images/image_10.png', name: 'Robô Aspirador', price: 'R$ 2.000 – R$ 3.500' },
                  { img: '/images/image_11.png', name: 'Smart TV', price: 'R$ 3.500 – R$ 5.000' },
                  { img: '/images/image_12.png', name: 'Lua de Mel', price: 'Valor livre' },
                ].map((gift, i) => (
                  <div key={i} onClick={() => setIsPixModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.2rem 0', borderBottom: '1px solid rgba(197,160,89,0.12)' }}>
                    <img src={gift.img} alt={gift.name} style={{ width: '40px', height: '40px', objectFit: 'cover', flexShrink: 0, borderRadius: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', fontWeight: 500, color: '#19241C', lineHeight: 1.2 }}>{gift.name}</div>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.75rem', fontStyle: 'italic', color: '#7A756D' }}>{gift.price}</div>
                    </div>
                    <span style={{ color: '#C5A059', fontSize: '0.7rem', opacity: 0.7 }}>Pix →</span>
                  </div>
                ))}
              </div>
              {/* Pix Banner */}
              <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', border: '1px solid rgba(197,160,89,0.4)', background: 'rgba(197,160,89,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7A756D', margin: 0 }}>Presentear em dinheiro?</p>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontStyle: 'italic', color: '#19241C', margin: '0.1rem 0 0' }}>Pix — qualquer valor</p>
                </div>
                <button onClick={() => setIsPixModalOpen(true)} style={{ flexShrink: 0, background: '#19241C', color: '#C5A059', border: 'none', padding: '0.45rem 0.8rem', fontFamily: '"Cormorant Garamond", serif', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', whiteSpace: 'nowrap' }}>Ver Chave</button>
              </div>
            </>,
            <>
              <h2 className={styles.chapter}>Momentos</h2>
              <h3 className={styles.chapterTitle}>Galeria</h3>
              <div className={styles.galleryGrid}>
                <img src="/images/image_13.png" className={styles.galleryImg} alt="Galeria" />
                <img src="/images/image_14.png" className={styles.galleryImg} alt="Galeria" />
                <img src="/images/image_15.png" className={styles.galleryImg} alt="Galeria" />
                <img src="/images/image_16.png" className={styles.galleryImg} alt="Galeria" />
              </div>
            </>
          )}

          {/* SHEET 5: GALERIA P2 / RSVP */}
          {renderSheet(5, 
            <>
              <h2 className={styles.chapter} style={{ opacity: 0 }}>Momentos</h2>
              <h3 className={styles.chapterTitle} style={{ marginBottom: '0.8rem' }}>Eternizados</h3>
              {/* Limited to 4 images in a clean 2x2 to prevent overflow */}
              <div className={styles.galleryGrid}>
                <img src="/images/image_17.png" className={styles.galleryImg} alt="Galeria" />
                <img src="/images/image_18.jpg" className={styles.galleryImg} alt="Galeria" />
                <img src="/images/image_19.jpg" className={styles.galleryImg} alt="Galeria" />
                <img src="/images/image_20.jpg" className={styles.galleryImg} alt="Galeria" />
              </div>
              {/* Show 2 more in a smaller strip below */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <img src="/images/image_21.jpg" style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover', objectPosition: 'center top', borderRadius: '2px' }} alt="Galeria" />
                <img src="/images/image_22.jpg" style={{ width: '100%', aspectRatio: '3/1', objectFit: 'cover', objectPosition: 'center top', borderRadius: '2px' }} alt="Galeria" />
              </div>
            </>,
            <>
              <h2 className={styles.chapter}>Confirmação de Presença</h2>
              <h3 className={styles.chapterTitle} style={{ marginBottom: '0.2rem' }}>RSVP</h3>
              <p className={styles.text} style={{ textAlign: 'center', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Confirmar até <strong>31 de agosto de 2026</strong>.
              </p>
              <div className={styles.rsvpWrapper}>
                <RsvpForm />
              </div>
            </>
          )}

          {/* SHEET 6: CONTRACAPA */}
          {renderSheet(6, 
            <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
              <p style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2.8rem', color: '#C5A059', marginBottom: '0.5rem', lineHeight: 1 }}>E viveram felizes</p>
              <h2 className={styles.title} style={{ fontSize: '2rem', color: '#FCFAF6', letterSpacing: '0.05em' }}>
                Para Sempre
              </h2>
              <div style={{ width: '40px', height: '1px', background: '#C5A059', margin: '1.2rem auto' }}></div>
              {/* Circular photo with correct face position */}
              <img
                src="/images/image_1.png"
                alt="Final"
                style={{
                  width: '55%', display: 'block', margin: '0 auto',
                  borderRadius: '50%', aspectRatio: '1', objectFit: 'cover',
                  objectPosition: 'center 15%',
                  border: '2px solid rgba(197,160,89,0.5)'
                }}
              />
            </div>,
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#FCFAF6' }}>
              <div style={{ width: '60px', height: '60px', border: '1px solid rgba(197, 160, 89, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: '"Great Vibes", cursive', color: '#C5A059', fontSize: '1.8rem' }}>C&S</span>
              </div>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C5A059', fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                Fim
              </p>
              <div className={styles.footerBox} style={{ borderTop: 'none', marginTop: '2rem' }}>
                <p style={{ fontSize: '1rem', fontFamily: '"Cormorant Garamond", serif', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Caio & Sophia</p>
                <p style={{ fontSize: '0.7rem', margin: '0.5rem 0', letterSpacing: '0.2em', opacity: 0.8 }}>26 · 09 · 2026</p>
                <p style={{ fontSize: '0.7rem', fontStyle: 'italic', opacity: 0.6 }}>Desenvolvido com carinho para o grande dia.</p>
              </div>
            </div>,
            true
          )}

        </div>
      </div>

      {isPixModalOpen && (
        <div className={styles.pixModal} onClick={() => setIsPixModalOpen(false)}>
          <div className={styles.pixModalContent} onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#19241C', fontWeight: 300 }} onClick={() => setIsPixModalOpen(false)}>×</button>
            <h3 style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2.5rem', color: '#C5A059', margin: '1rem 0 0.5rem' }}>Com gratidão</h3>
            <p className={styles.text} style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}>
              Todos os presentes são recebidos via Pix. Copie a chave abaixo:
            </p>
            <div style={{ padding: '1rem', border: '1px solid rgba(197,160,89,0.3)', wordBreak: 'break-all', margin: '1.5rem 0', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#19241C', letterSpacing: '0.05em' }}>
              36ed70af-7aae-4610-b4c8-b026a7ccbc1b
            </div>
            <p style={{ fontSize: '0.8rem', color: '#7A756D', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Caio Luiz de Paula Vieira · PicPay</p>
            <button 
              onClick={handleCopyPix}
              style={{ background: copied ? '#19241C' : '#C5A059', color: '#FCFAF6', border: 'none', padding: '1rem 2rem', fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', width: '100%', transition: 'all 0.4s ease' }}
            >
              {copied ? "Chave Copiada" : "Copiar Chave Pix"}
            </button>
            <p style={{ fontSize: '0.9rem', color: '#7A756D', fontStyle: 'italic', marginTop: '1.5rem' }}>Qualquer valor é imensamente bem-vindo.</p>
          </div>
        </div>
      )}
    </div>
  );
}
