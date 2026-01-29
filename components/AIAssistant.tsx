import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Send, Volume2, Cpu, Activity, Loader2 } from 'lucide-react';
import { SimiAIService, decode, decodeAudioData, createBlob, getOutputContext, getInputContext } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Pilot, your Big Sister Simi here! I ready to find you better loads today. Oya, wetin we dey do? Just talk to me." }
  ]);
  const [input, setInput] = useState('');
  
  const simiServiceRef = useRef<SimiAIService>(new SimiAIService());
  const activeSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const micStreamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef({ user: '', bot: '' });

  const handleAIMessage = async (message: LiveServerMessage) => {
    if (message.serverContent?.interrupted) {
      sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) {}
      });
      sourcesRef.current.clear();
      nextStartTimeRef.current = 0;
    }

    const base64Audio = message.serverContent?.modelTurn?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
    if (base64Audio) {
      const outCtx = getOutputContext();
      if (outCtx.state === 'suspended') await outCtx.resume();

      const audioData = decode(base64Audio);
      const buffer = await decodeAudioData(audioData, outCtx);
      const source = outCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(outCtx.destination);
      
      const currentTime = outCtx.currentTime;
      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);
      
      source.onended = () => sourcesRef.current.delete(source);
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration;
      sourcesRef.current.add(source);
    }

    if (message.serverContent?.outputTranscription) {
      const text = message.serverContent.outputTranscription.text;
      transcriptionBufferRef.current.bot += text;
      updateMessages('bot', transcriptionBufferRef.current.bot);
    }

    if (message.serverContent?.inputTranscription) {
      const text = message.serverContent.inputTranscription.text;
      transcriptionBufferRef.current.user += text;
      updateMessages('user', transcriptionBufferRef.current.user);
    }

    if (message.serverContent?.turnComplete) {
      transcriptionBufferRef.current = { user: '', bot: '' };
    }
  };

  const updateMessages = (role: 'user' | 'bot', text: string) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.role === role) {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { ...last, text: text };
        return newArr;
      }
      return [...prev, { role, text }];
    });
  };

  const toggleListening = async () => {
    if (!isListening) {
      try {
        const outCtx = getOutputContext();
        const inCtx = getInputContext();
        if (outCtx.state === 'suspended') await outCtx.resume();
        if (inCtx.state === 'suspended') await inCtx.resume();

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        transcriptionBufferRef.current = { user: '', bot: '' };

        const sessionPromise = simiServiceRef.current.connectLive({
          onopen: () => {
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              }).catch(err => console.error(err));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: handleAIMessage,
          onerror: (e) => {
            console.error(e);
            setIsListening(false);
          },
          onclose: () => {
            setIsListening(false);
          }
        });

        activeSessionRef.current = await sessionPromise;
        setIsListening(true);
      } catch (err) { 
        setIsListening(false);
      }
    } else {
      stopSimi();
    }
  };

  const stopSimi = async () => {
    setIsListening(false);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    if (activeSessionRef.current) {
      try { activeSessionRef.current.close(); } catch (e) {}
      activeSessionRef.current = null;
    }
    nextStartTimeRef.current = 0;
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: `Pilot, I don hear you. You say "${userText}". Make I check the grid for you...` }]);
    }, 800);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-6 z-50">
        {isOpen && (
          <div className="w-[350px] md:w-[480px] h-[650px] bg-[#020202] border-4 border-white/10 rounded-[4rem] shadow-[0_0_80px_rgba(230,0,0,0.4)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12">
            <div className="p-10 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#E60000] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                  <Cpu size={36} />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl uppercase tracking-widest italic leading-none">Talk to Simi</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Activity size={12} className={isListening ? "text-[#E60000] animate-pulse" : "text-white/20"} />
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{isListening ? 'SIMI IS LISTENING' : 'SIMI OFFLINE'}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-4 text-white/40 hover:text-white transition-all">
                <X size={32} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#020202] scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-6 rounded-[2rem] font-black italic shadow-2xl leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-white/10 text-white border border-white/10 rounded-tr-none' 
                    : 'bg-[#E60000] text-white rounded-tl-none shadow-[0_15px_40px_rgba(230,0,0,0.3)]'
                  }`}>
                    <p className="text-lg">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 bg-[#0A0A0A] border-t border-white/5 flex items-center gap-5">
              <button 
                onClick={toggleListening}
                className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${
                  isListening ? 'bg-[#E60000] text-white shadow-[0_0_30px_#E60000]' : 'bg-white/5 text-white/20 hover:text-white'
                }`}
              >
                {isListening ? <MicOff size={40} /> : <Mic size={40} />}
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk to Simi..."
                className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-xl font-black text-white outline-none focus:border-[#E60000] transition-all"
              />
              <button onClick={handleSend} className="w-20 h-20 bg-white text-black rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl">
                <Send size={32} />
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-28 h-28 rounded-[2.5rem] shadow-[0_30px_80px_rgba(230,0,0,0.5)] flex flex-col items-center justify-center transition-all border-4 ${
            isOpen ? 'bg-[#0A0A0A] border-[#E60000] text-white' : 'bg-[#E60000] border-[#020202] text-white'
          } group relative`}
        >
          {isOpen ? <X size={48} /> : (
            <>
              <Volume2 size={44} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase mt-1 tracking-widest italic">TALK</span>
            </>
          )}
          {!isOpen && (
             <span className="absolute -top-3 -right-3 w-8 h-8 bg-white text-[#E60000] rounded-full flex items-center justify-center text-[12px] font-black animate-bounce shadow-2xl border-4 border-[#020202]">1</span>
          )}
        </button>
      </div>
    </>
  );
};

export default AIAssistant;