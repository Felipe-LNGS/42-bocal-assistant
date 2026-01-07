'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Plus, MessageSquare } from 'lucide-react';
import Image from 'next/image';

/**
 * COMPOSANT : Logo42
 * Utilité : Centralise l'identité visuelle de l'école. 
 * L'utilisation de 'object-contain' assure que le logo ne soit jamais déformé.
 */
const Logo42 = ({ className = "", size = 50 }: { className?: string, size?: number }) => (
  <div className={`relative flex-shrink-0 ${className} rounded-full overflow-hidden`} style={{ width: size, height: size }}>
    <Image
      src="/42.png"
      alt="Logo 42"
      fill
      className="object-contain"
      priority
    />
  </div>
);

export default function Chat() {
  // --- ÉTATS & RÉFÉRENCES ---
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Gère l'état d'attente pour bloquer l'input
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * NAVIGATION : Scroll Automatique
   * Utilité : Améliore le confort de lecture en suivant le texte au fur et à mesure 
   * de sa génération (essentiel pour le mode 'streaming').
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewChat = () => {
    setMessages([]);
    setInput('');
  };

  /**
   * CORE : Envoi du message et gestion du flux (Streaming)
   * Utilité : On utilise un 'ReadableStream' pour afficher la réponse mot par mot.
   * Pourquoi : Cela réduit la latence perçue par l'utilisateur.
   */
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input || isLoading) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    // On initialise une bulle vide pour l'assistant avant de recevoir le flux
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantAnswer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantAnswer += chunk;

          // Mise à jour progressive du texte pour l'effet d'écriture
          setMessages([...newMessages, { role: 'assistant', content: assistantAnswer }]);
        }
      }
    } catch (error) {
      console.error("Erreur de connexion API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * FEATURE : Simulation de Connaissance (Easter Egg / Template)
   * Utilité : Permet d'intégrer des réponses institutionnelles parfaites pour la démo.
   * Pourquoi : On simule un délai aléatoire pour garder l'aspect naturel d'une IA.
   */
  const triggerTemplate = async (question: string, answer: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const userMessage = { role: 'user', content: question };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setInput('');

    let currentText = "";
    const words = answer.split(' ');

    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + " ";
      setMessages([...newMessages, { role: 'assistant', content: currentText }]);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 40 + 20));
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 font-mono overflow-hidden">

      {/* --- SECTION : SIDEBAR --- 
          Utilité : Navigation et accès rapide aux connaissances système.
      */}
      <aside className="w-64 bg-[#0d0d0d] border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
          <div className="flex items-center gap-2">
            <Logo42 size={24} />
            <span className="text-xs uppercase tracking-widest font-bold text-zinc-400">Assistant</span>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 px-3 py-2 border border-zinc-700 bg-zinc-900/50 rounded-xl hover:bg-zinc-800 hover:border-[#00babc]/50 transition-all group"
          >
            <Plus size={16} className="text-[#00babc] group-hover:rotate-90 transition-transform" />
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-300">Nouveau Chat</span>
          </button>
        </div>

        {/* ZONE DE CONNAISSANCES : Idéal pour les FAQ ou informations pré-définies */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scroller-clean">
          <p className="text-[10px] text-zinc-600 px-3 py-2 uppercase tracking-[0.2em] font-bold italic opacity-50">
            System_Knowledge
          </p>

          <div
            onClick={() => triggerTemplate(
              "Pourquoi Mistral AI ?",
              "**Mistral AI** est une entreprise française d’intelligence artificielle qui se distingue par plusieurs piliers stratégiques :\n\n" +
              "• **Excellence technologique** : Développement de modèles performants et adaptés à tout type d'usage.\n\n" +
              "• **Approche éthique** : Transparence et respect des valeurs européennes.\n\n" +
              "• **Innovation ouverte** : Partage avec la communauté scientifique.\n\n" +
              "• **Souveraineté** : Autonomie technologique face aux géants mondiaux.\n\n" +
              "• **Applications concrètes** : Rendre l’IA accessible via des outils comme 'Le Chat'.\n\n" +
              "**En résumé** : Mistral AI incarne une vision performante et souveraine de l'IA."
            )}
            className="flex items-center gap-3 px-3 py-2 text-xs text-zinc-300 bg-[#00babc]/5 hover:bg-[#00babc]/10 rounded-xl border border-[#00babc]/20 cursor-pointer transition-all group"
          >
            <MessageSquare size={14} className="text-[#00babc] group-hover:scale-110 transition-transform" />
            <span className="truncate font-medium italic text-zinc-400 group-hover:text-zinc-200">Pourquoi Mistral AI ?</span>
          </div>
        </div>

        {/* FOOTER SIDEBAR : Identité utilisateur via Intra 42 */}
        <div className="p-4 border-t border-zinc-800 bg-[#0a0a0a] flex items-center gap-3 text-xs text-zinc-400">
          <div className="w-10 h-10 rounded-xl bg-[#00babc]/10 border border-[#00babc]/30 flex items-center justify-center overflow-hidden">
            <Logo42 size={28} />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-bold text-zinc-200">philippe@student.42.fr</span>
            <span className="text-[10px] opacity-60">Connecté via intra</span>
          </div>
        </div>
      </aside>

      {/* --- SECTION : CHAT PRINCIPAL --- */}
      <main className="flex-1 flex flex-col relative bg-[#0a0a0a]">
        <header className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#0d0d0d]/80 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Logo42 size={32} className="drop-shadow-[0_0_8px_rgba(0,186,188,0.6)]" />
            <h1 className="text-[10px] tracking-[0.3em] uppercase font-bold text-zinc-500">BOCAL_CORE // SYSTEM V1.2</h1>
          </div>
        </header>

        {/* CONTENEUR DE MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 scroller-clean">
          <div className="max-w-3xl mx-auto space-y-8 w-full py-4">

            {/* ÉTAT INITIAL : Landing page minimaliste avec lien vers 42.fr */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-800 mt-[20vh]">
                <a
                  href="https://42.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-6 opacity-20 hover:opacity-100 transition-all duration-500 hover:scale-110 cursor-pointer group relative"
                >
                  <div className="absolute inset-0 bg-[#00babc] blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <Logo42 size={120} className="relative z-10" />
                </a>
                <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-zinc-600 animate-pulse">
                  Système prêt à recevoir une commande
                </p>
              </div>
            )}

            {/* RENDU DES MESSAGES : 
                On gère l'alignement différencié entre l'utilisateur et l'IA.
            */}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`border shadow-lg relative overflow-hidden ${m.role === 'user'
                  ? 'max-w-[85%] bg-zinc-900 border-zinc-800/60 text-zinc-100 rounded-3xl rounded-tr-none ml-12'
                  : 'w-full bg-[#00babc]/[0.03] border-[#00babc]/20 text-zinc-100 rounded-xl rounded-tl-none'
                  }`}>

                  {/* EN-TÊTE DE BULLE : Indique l'identité de l'émetteur */}
                  <div className={`flex items-center gap-2 px-5 py-2 border-b text-[10px] font-bold uppercase tracking-wider ${m.role === 'user'
                    ? 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 justify-end'
                    : 'bg-[#00babc]/10 border-[#00babc]/20 text-[#00babc]'
                    }`}>
                    {m.role === 'assistant' && <Logo42 size={14} />}
                    <span>{m.role === 'user' ? 'STU_SESSION >' : 'BOCAL_PROMPT'}</span>
                  </div>

                  {/* CORPS DU MESSAGE : 
                      On parse manuellement le Markdown simple (**gras**) pour éviter
                      d'importer des bibliothèques externes trop lourdes.
                  */}
                  <div className="p-5">
                    <p className="text-[13px] leading-7 whitespace-pre-wrap font-medium text-zinc-200/90 tracking-wide">
                      {m.content.split('**').map((part, index) => (
                        index % 2 === 1 ? (
                          <strong key={index} className="text-zinc-100 font-extrabold underline underline-offset-4 decoration-[#00babc]/30">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      ))}
                      {/* Curseur animé pendant la génération */}
                      {m.role === 'assistant' && isLoading && i === messages.length - 1 && (
                        <span className="inline-block w-2 h-4 ml-1 bg-[#00babc] animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* --- SECTION : BARRE DE SAISIE --- 
            Design 'Floating Pill' pour une esthétique moderne et aérée.
        */}
        <div className="p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-10">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00babc]/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            <input
              className="w-full bg-[#0d0d0d]/90 border border-zinc-800/80 p-4 pl-6 pr-14 rounded-full focus:outline-none focus:border-[#00babc]/40 focus:ring-1 focus:ring-[#00babc]/10 transition-all text-sm placeholder:text-zinc-700 font-mono shadow-2xl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="$> ~/ask_bocal..."
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-zinc-500 hover:text-[#00babc] disabled:opacity-20 transition-all hover:scale-110 rounded-full bg-zinc-900/50 border border-zinc-800 group-hover:border-[#00babc]/30"
            >
              <Send size={18} className={isLoading ? "animate-pulse" : ""} />
            </button>
          </form>

          <p className="text-center text-[9px] text-zinc-800 mt-4 uppercase tracking-[0.3em] font-bold">
            Propulsé par <span className="text-zinc-600">Mistral AI</span> • Made with ❤️ by <span className="text-[#00babc]/60">Philippe</span>
          </p>
        </div>
      </main>
    </div>
  );
}