import React, { useState, useEffect, useRef, useCallback } from 'react';
import MarkdownRenderer from '@/components/chat/MarkdownRenderer';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Brain, Plus, History, Trash2, MessageSquare, ChevronLeft, FileText, FileSpreadsheet, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

type OutputFormat = 'text' | 'excel' | 'pdf';

const PortIQ = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Fetch profile and conversations
  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('company_name, profile_picture_url, full_name')
        .eq('id', user.id)
        .single();
      if (profileData) setUserProfile(profileData);

      await loadConversations();
    };
    init();
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('chat_conversations' as any)
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    
    if (data) {
      setConversations(data as any);
      // Auto-load most recent if no conversation selected
      if (!conversationId && (data as any).length > 0) {
        await loadConversation((data as any)[0].id);
      }
    }
  };

  const loadConversation = async (convId: string) => {
    setConversationId(convId);
    const { data: messagesData } = await supabase
      .from('chat_messages' as any)
      .select('role, content, created_at')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    
    if (messagesData && messagesData.length > 0) {
      setMessages(messagesData.map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content })));
    } else {
      setMessages([]);
    }
    setShowHistory(false);
  };

  const createNewChat = async () => {
    if (!user) return;
    const { data: newConv, error } = await supabase
      .from('chat_conversations' as any)
      .insert({ user_id: user.id, title: 'New Chat' })
      .select('id')
      .single();
    
    if (!error && newConv) {
      setConversationId((newConv as any).id);
      setMessages([]);
      setShowHistory(false);
      await loadConversations();
    }
  };

  const deleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Delete messages first, then conversation
    await supabase.from('chat_messages' as any).delete().eq('conversation_id', convId);
    await supabase.from('chat_conversations' as any).delete().eq('id', convId);
    
    if (convId === conversationId) {
      setConversationId(null);
      setMessages([]);
    }
    await loadConversations();
    toast({ title: 'Chat deleted' });
  };

  const resetTextareaHeight = () => {
    const textarea = document.querySelector('textarea[placeholder*="Ask PortIQ"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = '36px';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    let userMessage = input.trim();
    
    // Prepend format instruction if selected
    if (outputFormat) {
      const formatLabel = outputFormat === 'excel' ? 'spreadsheet/table' : outputFormat === 'pdf' ? 'detailed report' : 'text';
      userMessage = `[Output format: ${formatLabel}] ${userMessage}`;
      setOutputFormat(null);
    }

    setInput('');
    resetTextareaHeight();
    
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Create conversation if none exists
      let activeConvId = conversationId;
      if (!activeConvId) {
        const { data: newConv, error: createError } = await supabase
          .from('chat_conversations' as any)
          .insert({ user_id: user.id, title: userMessage.slice(0, 50) })
          .select('id')
          .single();
        if (createError) throw createError;
        activeConvId = (newConv as any).id;
        setConversationId(activeConvId);
      }

      // Save user message
      await supabase.from('chat_messages' as any).insert({
        conversation_id: activeConvId,
        user_id: user.id,
        role: 'user',
        content: userMessage
      });

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        await supabase
          .from('chat_conversations' as any)
          .update({ title: userMessage.slice(0, 60) })
          .eq('id', activeConvId);
      }

      // Send to AI
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw new Error((error as any)?.message || 'AI error');

      const resText = (data as any)?.reply;
      if (resText) {
        const assistantMsg: Message = { role: 'assistant', content: resText };
        setMessages(prev => [...prev, assistantMsg]);
        
        await supabase.from('chat_messages' as any).insert({
          conversation_id: activeConvId,
          user_id: user.id,
          role: 'assistant',
          content: resText
        });

        await supabase
          .from('chat_conversations' as any)
          .update({ updated_at: new Date().toISOString() })
          .eq('id', activeConvId);
        
        loadConversations();
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({ title: 'Error', description: error?.message || 'Failed to send message', variant: 'destructive' });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    document.title = 'PortIQ – AI Assistant for CFF Network';
  }, []);

  const formatOptions: { value: OutputFormat; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'text', label: 'Text', icon: <FileText className="w-4 h-4" />, desc: 'Formatted text response' },
    { value: 'excel', label: 'Table', icon: <FileSpreadsheet className="w-4 h-4" />, desc: 'Structured table format' },
    { value: 'pdf', label: 'Report', icon: <File className="w-4 h-4" />, desc: 'Detailed report format' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] selection:bg-gold-500/20 selection:text-navy-900">
      <SidebarLayout>
        {/* Page header — compact, navy/gold */}
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">AI</span>
              <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">PortIQ</h1>
              <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
              <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">CFF Network Data Assistant — fund data, surveys, network</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex items-stretch justify-center p-4 sm:p-6 pb-4 min-w-0 overflow-hidden">
            <div className="w-full max-w-5xl min-w-0 h-full flex flex-col">

              <div className="rounded-xl border border-slate-200/90 bg-white shadow-finance h-full flex flex-col relative overflow-hidden">
                {/* Card toolbar — New / History */}
                <div className="border-b border-slate-200/80 flex-shrink-0 px-4 py-2.5 flex items-center justify-end gap-1 bg-white">
                  <Button variant="ghost" size="sm" onClick={createNewChat} className="h-8 px-2 text-xs gap-1 rounded-lg text-navy-900 hover:bg-gold-50/80 font-sans" title="New Chat">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)} className={`h-8 px-2 text-xs gap-1 rounded-lg font-sans ${showHistory ? 'bg-gold-50 text-gold-700' : 'text-navy-900 hover:bg-gold-50/80'}`} title="Chat History">
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                  </Button>
                </div>
                
                <div className="flex flex-1 min-h-0">
                  {/* History Sidebar */}
                  {showHistory && (
                    <div className="w-64 border-r border-slate-200/80 bg-slate-50/60 flex flex-col flex-shrink-0">
                      <div className="p-3 border-b border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 font-sans">Chat history</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-lg text-slate-500 hover:text-navy-900" onClick={() => setShowHistory(false)}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      </div>
                      <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                          {conversations.length === 0 ? (
                            <p className="text-xs text-slate-500 font-sans p-3 text-center">No conversations yet</p>
                          ) : (
                            conversations.map((conv) => (
                              <div
                                key={conv.id}
                                onClick={() => loadConversation(conv.id)}
                                className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer text-sm font-sans transition-colors ${
                                  conv.id === conversationId ? 'bg-gold-50 text-navy-900' : 'hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate text-xs">{conv.title || 'Untitled'}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  onClick={(e) => deleteConversation(conv.id, e)}
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Main Chat Area */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      <div className="p-4 sm:p-6 space-y-4 pb-32">
                        {messages.length === 0 ? (
                          <div className="text-center py-10 sm:py-12 space-y-5">
                            <div className="relative inline-flex">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center shadow-finance ring-2 ring-gold-500/30">
                                <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-gold-400" />
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-500 border-2 border-white" aria-hidden />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-display font-semibold text-navy-900 mb-1">Welcome to PortIQ</h3>
                              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-sans">
                                Ask about fund data, survey responses, network profiles, or any CFF platform data.
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
                              {[
                                'How many total surveys do we have?',
                                'Give me a summary of 2024 survey data',
                                'Which companies are in East Africa?',
                                'Show me fund size distribution',
                              ].map((prompt) => (
                                <button
                                  key={prompt}
                                  onClick={() => { setInput(prompt); }}
                                  className="text-[11px] sm:text-xs px-3 py-2 rounded-xl bg-white border border-slate-200/90 text-navy-900 hover:bg-gold-50 hover:border-gold-500/50 hover:text-navy-900 transition-all shadow-sm font-sans"
                                >
                                  {prompt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          messages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2.5 max-w-[85%]`}>
                                <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
                                  {message.role === 'user' ? (
                                    <>
                                      <AvatarImage src={userProfile?.profile_picture_url} />
                                      <AvatarFallback className="bg-navy-900 text-gold-400 text-xs">
                                        {(userProfile?.company_name || userProfile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </>
                                  ) : (
                                    <>
                                      <AvatarImage src="/robot.png" />
                                      <AvatarFallback className="bg-navy-900 text-gold-400">
                                        <Brain className="w-3.5 h-3.5" />
                                      </AvatarFallback>
                                    </>
                                  )}
                                </Avatar>
                                
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-[10px] font-medium mb-0.5 ${message.role === 'user' ? 'text-right' : 'text-left'} text-slate-500`}>
                                    {message.role === 'user' 
                                      ? (userProfile?.company_name || userProfile?.full_name || 'You')
                                      : 'PortIQ'}
                                  </span>
                                  <div
                                    className={`rounded-2xl px-4 py-2.5 ${
                                      message.role === 'user'
                                        ? 'bg-navy-900 text-gold-50'
                                        : 'bg-slate-50 text-slate-800 border border-slate-200'
                                    }`}
                                  >
                                    {message.role === 'assistant' ? (
                                      <MarkdownRenderer content={message.content} />
                                    ) : (
                                      <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        {loading && (
                          <div className="flex justify-start">
                            <div className="flex items-start gap-2.5">
                              <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
                                <AvatarImage src="/robot.png" />
                                <AvatarFallback className="bg-navy-900 text-gold-400">
                                  <Brain className="w-3.5 h-3.5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-medium mb-0.5 text-slate-500">PortIQ</span>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                  <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-sans">Analyzing data...</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200/80 bg-white p-3 sm:p-4">
                      {outputFormat && (
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <span className="text-xs text-slate-500 font-sans">Output:</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 flex items-center gap-1 font-sans">
                            {formatOptions.find(f => f.value === outputFormat)?.icon}
                            {formatOptions.find(f => f.value === outputFormat)?.label}
                            <button onClick={() => setOutputFormat(null)} className="ml-1 hover:text-navy-900"><X className="w-3 h-3" /></button>
                          </span>
                        </div>
                      )}
                      <div className="flex items-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-2 flex-shrink-0 rounded-xl border-slate-200 text-navy-900 hover:border-gold-500 font-sans" title="Output format">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48">
                            {formatOptions.map((opt) => (
                              <DropdownMenuItem
                                key={opt.value}
                                onClick={() => setOutputFormat(opt.value)}
                                className="flex items-center gap-2"
                              >
                                {opt.icon}
                                <div>
                                  <div className="text-sm font-medium">{opt.label}</div>
                                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex-1 relative">
                          <Textarea
                            value={input}
                            onChange={(e) => {
                              setInput(e.target.value);
                              const textarea = e.target;
                              textarea.style.height = 'auto';
                              textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
                            }}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask PortIQ about fund data, surveys, network..."
                            rows={1}
                            className="resize-none min-h-[36px] max-h-[150px] pr-2 py-2 pl-3 text-sm rounded-xl border-slate-200 focus-visible:ring-gold-500/30 font-sans"
                            disabled={loading}
                          />
                        </div>
                        <Button
                          onClick={sendMessage}
                          disabled={loading || !input.trim()}
                          size="sm"
                          className="h-9 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white flex-shrink-0 shadow-finance font-sans"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default PortIQ;
