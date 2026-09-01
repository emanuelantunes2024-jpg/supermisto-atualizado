// Cronómetro de cocina — cada ficha de receta trae uno propio, arrancando
// del tiempo de cocción sugerido. Suena y muestra una notificación al
// llegar a cero, para que quien está cocinando no tenga que mirar el
// celular todo el tiempo.

import { useCallback, useEffect, useRef, useState } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.3, 0.6].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.value = 0.15;
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    });
  } catch {
    // Navegador sin soporte de audio: no interrumpe el cronómetro.
  }
}

export default function CookingTimer({ minutosSugeridos = 10, nombreReceta = '' }) {
  const [segundosTotales, setSegundosTotales] = useState(Math.max(1, minutosSugeridos) * 60);
  const [segundosRestantes, setSegundosRestantes] = useState(segundosTotales);
  const [activo, setActivo] = useState(false);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (!activo) return undefined;
    intervaloRef.current = setInterval(() => {
      setSegundosRestantes((s) => {
        if (s <= 1) {
          clearInterval(intervaloRef.current);
          setActivo(false);
          beep();
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¡Listo! ⏰', {
              body: nombreReceta ? `El temporizador de "${nombreReceta}" terminó.` : 'Tu temporizador terminó.',
            });
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervaloRef.current);
  }, [activo, nombreReceta]);

  const ajustarMinutos = useCallback((delta) => {
    setActivo(false);
    setSegundosTotales((prev) => {
      const nuevo = Math.max(60, prev + delta * 60);
      setSegundosRestantes(nuevo);
      return nuevo;
    });
  }, []);

  const iniciar = useCallback(() => {
    if (segundosRestantes <= 0) setSegundosRestantes(segundosTotales);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    setActivo(true);
  }, [segundosRestantes, segundosTotales]);

  const pausar = useCallback(() => setActivo(false), []);
  const reiniciar = useCallback(() => {
    setActivo(false);
    setSegundosRestantes(segundosTotales);
  }, [segundosTotales]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const progreso = segundosTotales > 0 ? 1 - segundosRestantes / segundosTotales : 0;
  const terminado = segundosRestantes === 0;

  return (
    <div className="rounded-2xl border border-line bg-shell p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">Temporizador de cocina</h3>
        <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
          {activo ? 'En marcha' : terminado ? 'Terminado' : 'Pausado'}
        </span>
      </div>

      <div className="relative mx-auto mb-4 flex h-40 w-40 items-center justify-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#E7D7BE" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={terminado ? '#4E8C3F' : '#A8433A'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - progreso)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="font-display text-3xl font-bold tabular-nums text-ink">
          {pad(minutos)}:{pad(segundos)}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => ajustarMinutos(-1)}
          className="h-8 w-8 rounded-full border border-line text-ink/70 transition hover:bg-cream"
          aria-label="Restar un minuto"
        >
          −
        </button>
        <span className="text-sm text-ink/60">min</span>
        <button
          type="button"
          onClick={() => ajustarMinutos(1)}
          className="h-8 w-8 rounded-full border border-line text-ink/70 transition hover:bg-cream"
          aria-label="Sumar un minuto"
        >
          +
        </button>
      </div>

      <div className="flex gap-2">
        {!activo ? (
          <button
            type="button"
            onClick={iniciar}
            className="flex-1 rounded-xl bg-wine-500 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-wine-600"
          >
            {terminado ? 'Reiniciar y empezar' : 'Empezar'}
          </button>
        ) : (
          <button
            type="button"
            onClick={pausar}
            className="flex-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-ink/90"
          >
            Pausar
          </button>
        )}
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-cream"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
