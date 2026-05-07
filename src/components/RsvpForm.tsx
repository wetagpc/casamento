'use client';

import { useState, useEffect } from 'react';

type Guest = {
  id: string;
  nome: string;
  familia: string;
  pin: string;
};

export default function RsvpForm() {
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState('Carregando convidados...');
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  
  const [presenca, setPresenca] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchGuests() {
      try {
        const res = await fetch('/api/guests');
        const json = await res.json();
        
        if (!res.ok || json.error) {
          setStatus('Erro ao carregar: ' + (json.error || 'Desconhecido'));
        } else if (json.data) {
          setAllGuests(json.data);
          setStatus('Pronto! ' + json.data.length + ' convidados carregados.');
        } else {
          setStatus('Erro: Nenhum dado retornado.');
        }
      } catch(err: any) {
        setStatus('Erro inesperado: ' + err.message);
      }
    }
    fetchGuests();
  }, []);

  function normalize(str: string) {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function handleSearch(val: string) {
    setSearch(val);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setNotFound(false);
      return;
    }
    const q = normalize(val.trim());
    const matches = allGuests.filter(g => normalize(g.nome).includes(q));
    
    if (matches.length === 0) {
      setSuggestions([]);
      setNotFound(true);
    } else {
      setSuggestions(matches);
      setNotFound(false);
    }
  }

  function handleSelect(guest: Guest) {
    setSelectedGuest(guest);
    setSearch(guest.nome);
    setSuggestions([]);
    setPin('');
    setPinError(false);
  }

  function handlePinChange(val: string) {
    const onlyNums = val.replace(/\D/g, '');
    setPin(onlyNums);
    setPinError(false);
    
    if (onlyNums.length === 4) {
      if (selectedGuest && selectedGuest.pin === onlyNums) {
        setPinSuccess(true);
      } else {
        setPinError(true);
        setTimeout(() => {
          setPin('');
          setPinError(false);
        }, 1200);
      }
    }
  }

  function reset() {
    setSelectedGuest(null);
    setSearch('');
    setPin('');
    setPinSuccess(false);
    setPresenca('');
    setMensagem('');
  }

  async function submitForm() {
    if (!presenca) {
      alert('Por favor, selecione se vai comparecer ou não.');
      return;
    }
    if (!selectedGuest) return;

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_convidado: selectedGuest.nome,
          familia: selectedGuest.familia,
          presenca: presenca === 'Sim',
          mensagem: mensagem
        })
      });
      const json = await res.json();
      
      if (!res.ok || json.error) {
        alert('Erro ao enviar. Tente novamente. Detalhes: ' + (json.error || 'Erro desconhecido'));
      } else {
        setIsSuccess(true);
      }
    } catch(err: any) {
      alert('Erro ao enviar. Tente novamente. Detalhes: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="rsvp-success" style={{ display: 'block' }}>
        Obrigado! Já anotamos sua resposta. Nos vemos em setembro! 🌿
      </div>
    );
  }

  return (
    <div id="rsvp-form" className="rsvp-form reveal">
      {/* DEBUG STATUS */}
      <div style={{ display: 'none', padding: '10px', marginBottom: '15px', fontSize: '0.8rem', color: allGuests.length > 0 ? 'green' : 'red', background: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
        Status do Banco: {status}
      </div>

      {/* STEP 1 */}
      {!selectedGuest && (
        <div id="step-1">
          <div className="form-group">
            <label htmlFor="rsvp-search">Digite seu nome *</label>
            <input 
              type="text" 
              id="rsvp-search" 
              placeholder="Ex: João, Marina, Isabela..." 
              autoComplete="off"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={allGuests.length === 0}
            />
          </div>
          
          {suggestions.length > 0 && (
            <div id="rsvp-suggestions" style={{ border: '1px solid rgba(139,110,78,0.25)', background: 'white', marginTop: '0.25rem' }}>
              {suggestions.map(g => (
                <div 
                  key={g.id}
                  onClick={() => handleSelect(g)}
                  style={{ padding: '1rem', cursor: 'pointer', borderBottom: '1px solid rgba(139,110,78,0.1)', fontFamily: "'Jost',sans-serif", fontSize: '0.9rem', color: 'var(--text)', transition: 'background 0.15s' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(59,84,66,0.06)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '')}
                >
                  <div style={{ fontWeight: '500' }}>{g.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>família {g.familia}</div>
                </div>
              ))}
            </div>
          )}

          {notFound && (
            <p id="rsvp-not-found" style={{ fontSize: '0.85rem', color: 'var(--terracotta)', marginTop: '0.5rem' }}>
              Nome não encontrado na lista de convidados. Entre em contato com os noivos.
            </p>
          )}
        </div>
      )}

      {/* STEP 2 */}
      {selectedGuest && !pinSuccess && (
        <div id="step-2">
          <div style={{ background: 'rgba(59,84,66,0.05)', border: '1px solid rgba(59,84,66,0.1)', padding: '1.25rem', marginBottom: '1.5rem', borderRadius: '2px' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Confirmando presença de:</p>
            <p id="selected-name" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: 'var(--green)', marginTop: '0.25rem', lineHeight: '1.2' }}>
              {selectedGuest.nome}
            </p>
            <button onClick={reset} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--terracotta)', cursor: 'pointer', marginTop: '0.75rem', padding: '0.5rem 0', textDecoration: 'underline', display: 'block' }}>
              Não sou eu, voltar
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="rsvp-pin">4 últimos dígitos do telefone do responsável pela família *</label>
            <input 
              type="tel" 
              id="rsvp-pin" 
              maxLength={4} 
              placeholder="_ _ _ _"
              style={{ letterSpacing: '0.4em', fontSize: '1.4rem', textAlign: 'center', borderColor: pinError ? 'var(--terracotta)' : undefined }}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
            />
          </div>
          {pinError && (
            <p id="pin-error" style={{ fontSize: '0.83rem', color: 'var(--terracotta)', marginTop: '0.5rem' }}>
              Código incorreto. Verifique os 4 últimos dígitos do telefone do responsável.
            </p>
          )}
          <p id="pin-hint" style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.5rem', lineHeight: '1.6' }}>
            Ex: se o telefone for (35) 99999-<strong>1234</strong>, digite <strong>1234</strong>.
          </p>
        </div>
      )}

      {/* STEP 3 */}
      {selectedGuest && pinSuccess && (
        <div id="step-3">
          <div style={{ background: 'rgba(59,84,66,0.07)', border: '1px solid rgba(59,84,66,0.15)', padding: '1.2rem 1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Confirmando presença de:</p>
            <p id="selected-name-2" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: 'var(--green)', marginTop: '0.2rem' }}>
              {selectedGuest.nome}
            </p>
          </div>
          <div className="form-group">
            <label>Vai comparecer? *</label>
            <div className="rsvp-radio-group">
              <div className="radio-option">
                <input type="radio" id="sim" name="presenca" value="Sim" checked={presenca === 'Sim'} onChange={() => setPresenca('Sim')} />
                <label htmlFor="sim">Sim, estarei lá! 🥂</label>
              </div>
              <div className="radio-option">
                <input type="radio" id="nao" name="presenca" value="Não" checked={presenca === 'Não'} onChange={() => setPresenca('Não')} />
                <label htmlFor="nao">Infelizmente não poderei ir</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="mensagem">Deixe uma mensagem para os noivos (opcional)</label>
            <textarea 
              id="mensagem" 
              name="mensagem" 
              placeholder="Uma palavra, um abraço, uma lembrança..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            ></textarea>
          </div>
          <button id="rsvp-confirm-btn" className="form-submit" onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Confirmar Presença →'}
          </button>
        </div>
      )}
    </div>
  );
}
