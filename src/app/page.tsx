
'use client';
import { useEffect, useState } from 'react';
import RsvpForm from '@/components/RsvpForm';

export default function Home() {
  
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: '—', hours: '—', minutes: '—', seconds: '—' });
  const [copied, setCopied] = useState(false);

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

  function handleCopyPix() {
    navigator.clipboard.writeText('(35) 99970-3093');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  

  useEffect(() => {
    // Scroll reveal logic
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      

  <nav>
    <a href="#historia">Nossa História</a>
    <a href="#programacao">Programação</a>
    <a href="#local">Local</a>
    <a href="#dresscode">Traje</a>
    <a href="#presentes">Presentes</a>
    <a href="#galeria">Galeria</a>
    <a href="#rsvp">Confirmar</a>
  </nav>

  {/*  HERO  */}
  <section id="hero">
    <div className="hero-bg"></div>
    <div className="hero-bg-fallback"></div>
    <div className="hero-content">
      <p className="hero-eyebrow">Você está convidado para o nosso casamento</p>
      <h1 className="hero-names">
        <em>Caio</em>
        <span className="hero-amp">&amp;</span>
        <em>Sophia</em>
      </h1>
      <p className="hero-date">26 · 09 · 2026 &nbsp;—&nbsp; Poços de Caldas, MG</p>
      <div className="hero-divider"></div>
      <div className="countdown" id="countdown">
        <div className="countdown-item">
          <span className="countdown-num" id="cd-days">{countdown.days}</span>
          <span className="countdown-label">dias</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-num" id="cd-hours">{countdown.hours}</span>
          <span className="countdown-label">horas</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-num" id="cd-minutes">{countdown.minutes}</span>
          <span className="countdown-label">minutos</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-num" id="cd-seconds">{countdown.seconds}</span>
          <span className="countdown-label">segundos</span>
        </div>
      </div>
      <a href="#rsvp" className="hero-cta">Confirmar Presença</a>
    </div>
  </section>

  {/*  HISTÓRIA  */}
  <section id="historia">
    <div className="section-inner">
      <p className="section-label reveal">Nossa História</p>
      <h2 className="section-title reveal">Uma tarde na <em>Rua John Pinheiro</em><br />que mudou tudo</h2>
      <div className="thin-rule reveal"></div>
      <p className="section-text reveal">
        Era 2014. A faculdade começava, e com ela um encontro rápido entre dois calouros que logo se perderam
        nos corredores da vida universitária. Os anos passaram — cada um seguiu o seu caminho, formou-se,
        seguiu em frente.
      </p>
      <blockquote className="story-quote reveal">
        "Até o dia em que o Caio passou pela Rua John Pinheiro com a galera da República Caverna,
        e uma voz conhecida gritou do outro lado da rua: <strong>— Pescoço!</strong>"
      </blockquote>
      <p className="section-text reveal">
        Era a Sophia. Sem pretensão, sem planos — só aquela pergunta simples: <em>"O que tem de bom pra fazer hoje?"</em>
        Naquela tarde, os dois ficaram. E desde então, nunca mais se separaram pra nada.
      </p>
      <div className="couple-photo-block reveal">
        <img src="/images/image_1.png" alt="Caio e Sophia" />
      </div>
    </div>
  </section>

  {/*  PROGRAMAÇÃO  */}
  <section id="programacao">
    <div className="section-inner">
      <p className="section-label reveal">O Grande Dia</p>
      <h2 className="section-title reveal">Programação <em>26 de setembro</em></h2>
      <div className="thin-rule reveal"></div>
      <div className="timeline">
        <div className="timeline-item reveal">
          <span className="timeline-time">16h</span>
          <div className="timeline-dot"></div>
          <div className="timeline-body">
            <p className="timeline-title">Cerimônia</p>
            <p className="timeline-desc">Início da celebração da união de Caio e Sophia.<br />
            Al. Poços de Caldas, 163 — Laranjeiras, Caldas, MG.</p>
          </div>
        </div>
        <div className="timeline-item reveal">
          <span className="timeline-time">após</span>
          <div className="timeline-dot"></div>
          <div className="timeline-body">
            <p className="timeline-title">Festa & Churrasco</p>
            <p className="timeline-desc">Logo após a cerimônia, a festa começa!
            Churrasco, boa música e muito amor para comemorar com quem importa.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  LOCAL  */}
  <section id="local">
    <div className="section-inner">
      <p className="section-label reveal">Onde Será</p>
      <h2 className="section-title reveal">Laranjeiras,<br /><em>Caldas — MG</em></h2>
      <div className="thin-rule reveal"></div>
      <p className="section-text reveal">
        O casamento acontece na Al. Poços de Caldas, 163 — Laranjeiras, Caldas, MG.
        Um ambiente aberto, entre verde e céu aberto, perfeito para esse momento.
      </p>
      <div className="local-details">
        <div className="local-card reveal">
          <span className="local-card-icon">🚗</span>
          <p className="local-card-title">Estacionamento</p>
          <p className="local-card-text">Estacionamento disponível no local. Sem necessidade de buscar vaga nas redondezas.</p>
        </div>
        <div className="local-card reveal">
          <span className="local-card-icon">🏡</span>
          <p className="local-card-title">Hospedagem</p>
          <p className="local-card-text">O local conta com espaço para familiares que vierem de longe.</p>
        </div>
        <div className="local-card reveal">
          <span className="local-card-icon">📍</span>
          <p className="local-card-title">Endereço</p>
          <p className="local-card-text">Al. Poços de Caldas, 163<br />Laranjeiras — Caldas, MG<br />CEP 37780-000</p>
        </div>
      </div>
      <a href="https://maps.google.com/?q=Al.+Po%C3%A7os+de+Caldas,+163+Laranjeiras+Caldas+MG+37780-000" target="_blank" className="map-link reveal">
        Ver no Google Maps →
      </a>
    </div>
  </section>

  {/*  DRESS CODE  */}
  <section id="dresscode">
    <div className="section-inner">
      <p className="section-label reveal">Como Se Vestir</p>
      <h2 className="section-title reveal">Traje <em>Esporte Fino</em></h2>
      <div className="thin-rule reveal"></div>
      <div className="dresscode-box reveal">
        <p className="section-text">
          O casamento será em área rural, com um clima descontraído e acolhedor. Venha confortável —
          não é preciso de traje formal, mas capricha no visual. Esporte fino é a pedida certa.
        </p>
        <div className="dresscode-swatches">
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.5rem', gridColumn: '1 / -1' }}>
            <strong>Sugestão de cores:</strong> tons naturais ficam lindos no cenário
          </p>
          <div className="swatch"><div className="swatch-color" style={{ background: '#D2C4A8' }}></div> Areia</div>
          <div className="swatch"><div className="swatch-color" style={{ background: '#8FAF8A' }}></div> Sage</div>
          <div className="swatch"><div className="swatch-color" style={{ background: '#C4A882' }}></div> Caramelo</div>
          <div className="swatch"><div className="swatch-color" style={{ background: '#5A7A63' }}></div> Verde musgo</div>
        </div>
        <p className="dresscode-note">
          Dica: para as mulheres, salto agulha pode ser desconfortável no gramado —
          prefira salto bloco ou rasteirinha.
        </p>
        <p style={{ marginTop: '1.5rem', fontFamily: '\'Jost\',sans-serif', fontSize: '0.95rem', fontWeight: '400', color: 'var(--green)', background: 'rgba(59,84,66,0.08)', border: '1px solid rgba(59,84,66,0.2)', padding: '1rem 1.2rem', lineHeight: '1.7' }}>
          ⚠️ <strong>Importante:</strong> As cores acima são apenas sugestões de paleta para quem quiser se inspirar no clima do evento. <strong>Não há nenhuma obrigação</strong> de seguir essas cores — venha como se sentir bem! O que importa é a sua presença. 🤍
        </p>
      </div>
    </div>
  </section>

  {/*  PRESENTES  */}
  <section id="presentes">
    <div className="section-inner">
      <p className="section-label reveal">Lista de Presentes</p>
      <h2 className="section-title reveal">Presentear com <em>carinho</em></h2>
      <div className="thin-rule reveal"></div>
      <p className="gifts-intro reveal">
        A maior alegria é ter vocês com a gente nesse dia. Se quiserem nos presentear,
        escolhemos alguns itens que vão fazer parte do nosso novo lar — clique em qualquer
        presente e receba a chave Pix para nos surpreender! 🤍
      </p>
      <div className="gifts-grid">
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_2.png" alt="Jogo de Xícaras" />
          <div className="gift-card-body">
          <p className="gift-name">Jogo de Xícaras</p>
          <p className="gift-value">A partir de R$ 100</p>
          <p className="gift-desc">Conjunto de xícaras de chá ou café em porcelana — para os momentos tranquilos a dois.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_3.png" alt="Jogo de Toalhas" />
          <div className="gift-card-body">
          <p className="gift-name">Jogo de Toalhas</p>
          <p className="gift-value">R$ 150 – R$ 300</p>
          <p className="gift-desc">Conjunto de banho e rosto 100% algodão felpudo, 5 peças.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_4.png" alt="Cafeteira Italiana" />
          <div className="gift-card-body">
          <p className="gift-name">Cafeteira Italiana</p>
          <p className="gift-value">R$ 200 – R$ 380</p>
          <p className="gift-desc">Cafeteira Moka Bialetti em alumínio — café espresso clássico para as manhãs a dois.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_5.png" alt="Jogo de Panelas" />
          <div className="gift-card-body">
          <p className="gift-name">Jogo de Panelas</p>
          <p className="gift-value">R$ 350 – R$ 600</p>
          <p className="gift-desc">Conjunto antiaderente completo, 8 peças. Tramontina ou similar.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_6.png" alt="Jogo de Cama Queen" />
          <div className="gift-card-body">
          <p className="gift-name">Jogo de Cama Queen</p>
          <p className="gift-value">R$ 400 – R$ 700</p>
          <p className="gift-desc">Lençol queen 4 peças, 100% algodão fio egípcio 400 fios.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_7.png" alt="Air Fryer" />
          <div className="gift-card-body">
          <p className="gift-name">Air Fryer</p>
          <p className="gift-value">R$ 500 – R$ 900</p>
          <p className="gift-desc">Fritadeira elétrica sem óleo digital, 12L — praticidade no dia a dia.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_8.png" alt="Aparelho de Jantar" />
          <div className="gift-card-body">
          <p className="gift-name">Aparelho de Jantar</p>
          <p className="gift-value">R$ 600 – R$ 1.200</p>
          <p className="gift-desc">Aparelho de jantar em porcelana branca, 42 peças. Oxford ou Porto Brasil.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_9.png" alt="Adega / Frigobar" />
          <div className="gift-card-body">
          <p className="gift-name">Adega / Frigobar</p>
          <p className="gift-value">R$ 1.200 – R$ 2.000</p>
          <p className="gift-desc">Adega climatizada para até 20 garrafas — para os momentos especiais em casa.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_10.png" alt="Robô Aspirador" />
          <div className="gift-card-body">
          <p className="gift-name">Robô Aspirador</p>
          <p className="gift-value">R$ 2.000 – R$ 3.500</p>
          <p className="gift-desc">Aspirador robô inteligente — para manter o novo lar sempre em ordem sem esforço.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_11.png" alt="Smart TV" />
          <div className="gift-card-body">
          <p className="gift-name">Smart TV</p>
          <p className="gift-value">R$ 3.500 – R$ 5.000</p>
          <p className="gift-desc">Smart TV 55" 4K — para as noites de filme no novo lar do casal.</p>
          </div>
        </div>
        <div className="gift-card reveal" onClick={() => setIsPixModalOpen(true)}  title="Clique para presentear">
          <img className="gift-card-img" src="/images/image_12.png" alt="Lua de Mel" />
          <div className="gift-card-body">
          <p className="gift-name">Lua de Mel</p>
          <p className="gift-value">Do coração ✨</p>
          <p className="gift-desc">Contribua com o que sentir no coração. Cada real vai direto para as memórias da nossa viagem.</p>
          </div>
        </div>
      </div>

      <div className="pix-block reveal">
        <div className="pix-block-content">
          <p className="pix-block-label">Preferir presentear em dinheiro?</p>
          <p className="pix-block-title">Presente via Pix</p>
          <p className="pix-block-desc">100% do valor vai direto para os noivos, sem taxas.<br />
          Qualquer quantia é recebida com muito carinho.</p>
        </div>
        <div className="pix-key-box">
          <p className="pix-key-label">Chave Pix (Telefone)</p>
          <p className="pix-key" id="pix-key">(35) 99970-3093</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(237,227,208,0.5)', marginBottom: '0.8rem' }}>Caio Luiz de Paula Vieira · PicPay</p>
          <button className="pix-copy-btn" onClick={handleCopyPix}>{copied ? "Copiado! ✓" : "Copiar chave"}</button>
        </div>
      </div>
    </div>
  </section>

  {/*  GALERIA  */}
  <section id="galeria">
    <div className="section-inner">
      <p className="section-label reveal">Momentos</p>
      <h2 className="section-title reveal">Nossa <em>galeria</em></h2>
      <div className="thin-rule reveal"></div>
      <div className="gallery-grid">
        <div className="gallery-item reveal">
          <img src="/images/image_13.png" alt="Poços de Caldas, nosso lugar" style={{ objectPosition: 'center 25%' }} />
          <p className="gallery-caption">Poços de Caldas, nosso lugar</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_14.png" alt="Aquele olhar que diz tudo" style={{ objectPosition: 'center 30%' }} />
          <p className="gallery-caption">Aquele olhar que diz tudo</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_15.png" alt="Sempre juntos" style={{ objectPosition: 'center 20%' }} />
          <p className="gallery-caption">Sempre juntos</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_16.png" alt="Padrinho e madrinha perfeitos" style={{ objectPosition: 'center 15%' }} />
          <p className="gallery-caption">Padrinho e madrinha perfeitos</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_17.png" alt="Um casal de parque" style={{ objectPosition: 'center 20%' }} />
          <p className="gallery-caption">Um casal de parque</p>
        </div>

        <div className="gallery-item reveal">
          <img src="/images/image_18.jpg" alt="Juntos em cada festa" style={{ objectPosition: 'center 20%' }} />
          <p className="gallery-caption">Juntos em cada festa</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_19.jpg" alt="O sorriso que diz tudo" style={{ objectPosition: 'center 25%' }} />
          <p className="gallery-caption">O sorriso que diz tudo</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_20.jpg" alt="Céu e flores" style={{ objectPosition: 'center 30%' }} />
          <p className="gallery-caption">Céu e flores</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_21.jpg" alt="Pertinho, sempre" style={{ objectPosition: 'center 25%' }} />
          <p className="gallery-caption">Pertinho, sempre</p>
        </div>
        <div className="gallery-item reveal">
          <img src="/images/image_22.jpg" alt="No nosso jeito" style={{ objectPosition: 'center 20%' }} />
          <p className="gallery-caption">No nosso jeito</p>
        </div>
      </div>
    </div>
  </section>

  {/*  RSVP  */}
  <section id="rsvp">
    <div className="section-inner">
      <p className="section-label reveal">Confirmação de Presença</p>
      <h2 className="section-title reveal">Você vai <em>estar lá?</em></h2>
      <div className="thin-rule reveal"></div>
      <p className="section-text reveal" style={{ marginBottom: '0' }}>
        Confirme sua presença até <strong>31 de agosto de 2026</strong> para que possamos
        garantir seu lugar nesse dia tão especial.
      </p>
      {/*  RSVP COM VALIDAÇÃO DE LISTA  */}
      <RsvpForm />

      <div className="rsvp-success" id="rsvp-success">
        Obrigado! Já anotamos sua presença. Nos vemos em setembro! 🌿
      </div>
    </div>
  </section>

  {/*  FOOTER  */}
  <footer>
    <p className="footer-names">Caio & Sophia</p>
    <p className="footer-date">26 · 09 · 2026 &nbsp;—&nbsp; Poços de Caldas, MG</p>
    <p className="footer-small">Feito com amor para o nosso grande dia 🤍</p>
  </footer>

  
  {/*  PIX MODAL  */}
  {isPixModalOpen && (
    <div id="pix-modal" className="open" onClick={() => setIsPixModalOpen(false)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setIsPixModalOpen(false)}>×</button>
        <p className="section-label">Presente via Pix</p>
        <h3 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: '300', color: 'var(--green)', margin: '0.5rem 0 0.4rem' }}>Obrigado pelo carinho! 🤍</h3>
        <p style={{ fontSize: '0.88rem', fontWeight: '300', color: 'var(--text-light)', lineHeight: '1.7' }}>Todos os presentes são recebidos via Pix, direto na conta dos noivos. Copie a chave abaixo:</p>
        
        <div className="modal-pix-key-box" style={{ background: 'var(--green)', padding: '1.5rem', margin: '1.5rem 0' }}>
          <p className="modal-pix-label">Chave Pix (Telefone)</p>
          <p className="modal-pix-key" style={{ color: 'var(--parchment)', wordBreak: 'break-all', fontFamily: 'serif' }}>(35) 99970-3093</p>
          <p className="modal-pix-name" style={{ color: 'rgba(237,227,208,0.5)', fontSize: '0.7rem', marginTop: '0.5rem' }}>Caio Luiz de Paula Vieira · PicPay</p>
        </div>
        <button className="modal-copy-btn" onClick={handleCopyPix} style={{ background: copied ? 'var(--green-light)' : 'var(--terracotta)', color: 'white', width: '100%', border: 'none', padding: '1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {copied ? "Copiado! ✓" : "Copiar Chave Pix"}
        </button>
        <p className="modal-note">Qualquer valor é muito bem-vindo. ✨</p>
      </div>
    </div>
  )}


  

    </>
  );
}
