import { useState } from 'react';
import { Icon } from '../../components/common/Icon';

type Msg = { from: 'user' | 'bot'; text: string };

const sugestoes = [
  'Como precificar meu brigadeiro?',
  'Quais receitas rendem mais lucro com R$50?',
  'Como conservar coxinhas por mais tempo?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Olá! Sou o Assistente IA da Central de Receitas & Renda. Em breve poderei te ajudar a escolher receitas, calcular preços e planejar sua produção.' },
  ]);
  const [text, setText] = useState('');

  function send() {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { from: 'user', text },
      { from: 'bot', text: 'O Assistente IA ainda está em configuração. Em breve essa resposta virá de verdade — por enquanto, explore as Calculadoras e a Central de Renda!' },
    ]);
    setText('');
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-2xl flex-col">
      <h1 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-ink-900">
        <Icon name="bot" className="h-6 w-6 text-brand-500" /> Assistente IA
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">Novo</span>
      </h1>

      <div className="card flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === 'user' ? 'ml-auto bg-brand-500 text-white' : 'bg-black/5 text-ink-800'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-black/5 p-3">
          {sugestoes.map((s) => (
            <button key={s} onClick={() => setText(s)} className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink-700 hover:bg-black/5">
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-black/5 p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Pergunte algo ao Assistente IA…"
            className="input flex-1"
          />
          <button onClick={send} className="btn-primary">Enviar</button>
        </div>
      </div>
    </div>
  );
}
