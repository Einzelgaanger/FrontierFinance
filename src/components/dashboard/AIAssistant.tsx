import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Send, Brain, User } from 'lucide-react';
import { toast } from 'sonner';
import MarkdownRenderer from '@/components/chat/MarkdownRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    const history = [...messages, { role: 'user', content: userMessage }];

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: history }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Failed to get AI response. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[520px] flex flex-col rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200/80 flex items-center gap-2 flex-shrink-0 bg-white">
        <div className="w-6 h-6 rounded-lg bg-navy-900 flex items-center justify-center shrink-0">
          <Brain className="w-3 h-3 text-gold-400" />
        </div>
        <span className="text-xs font-semibold text-navy-900 font-sans">PortIQ</span>
        <span className="text-[10px] text-slate-500 font-sans">— Ask about survey data</span>
      </div>
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden pt-3 pb-3">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-center px-4">
              <div className="space-y-3">
                <div className="relative inline-flex">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center shadow-finance ring-2 ring-gold-500/30">
                    <Brain className="w-6 h-6 text-gold-400" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gold-500 border-2 border-white" aria-hidden />
                </div>
                <p className="text-[11px] text-slate-600 font-sans max-w-xs mx-auto">
                  Ask about fund data, statistics, or insights based on your access.
                </p>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-6 w-6 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="h-3 w-3 text-gold-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-navy-900 text-gold-50 font-sans'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  <p className="text-sm whitespace-pre-wrap font-sans">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="h-6 w-6 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="h-3 w-3 text-navy-900" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="h-3 w-3 text-gold-400" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] text-slate-500 font-sans">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about fund data, sectors, geography..."
            className="resize-none min-h-[36px] max-h-[100px] text-sm rounded-xl border-slate-200 focus-visible:ring-gold-500/30 font-sans flex-1"
            rows={1}
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="sm"
            className="h-9 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-gold-400 flex-shrink-0 shadow-finance"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
