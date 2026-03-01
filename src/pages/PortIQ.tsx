import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="h-screen overflow-hidden">
      <SidebarLayout>
        <div className="h-screen bg-cover bg-center bg-fixed overflow-hidden" style={{ backgroundImage: 'url(/auth.jpg)' }}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 h-full flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-20 pb-[env(safe-area-inset-bottom,0)]">
            <div className="w-full max-w-5xl min-w-0 h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] flex flex-col">

              <Card className="shadow-2xl border-2 border-blue-100 bg-white/95 backdrop-blur-md h-full flex flex-col relative overflow-hidden">
                {/* Header */}
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50 flex-shrink-0 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">PortIQ</CardTitle>
                        <CardDescription className="text-xs">CFF Network Data Assistant</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={createNewChat}
                        className="h-8 px-2 text-xs gap-1"
                        title="New Chat"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className={`h-8 px-2 text-xs gap-1 ${showHistory ? 'bg-blue-100' : ''}`}
                        title="Chat History"
                      >
                        <History className="w-4 h-4" />
                        <span className="hidden sm:inline">History</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <div className="flex flex-1 min-h-0">
                  {/* History Sidebar */}
                  {showHistory && (
                    <div className="w-64 border-r bg-slate-50/80 flex flex-col flex-shrink-0">
                      <div className="p-3 border-b flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Chat History</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowHistory(false)}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      </div>
                      <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                          {conversations.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-3 text-center">No conversations yet</p>
                          ) : (
                            conversations.map((conv) => (
                              <div
                                key={conv.id}
                                onClick={() => loadConversation(conv.id)}
                                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-colors ${
                                  conv.id === conversationId ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
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
                          <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                              <Brain className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 mb-1">Welcome to PortIQ</h3>
                              <p className="text-sm text-slate-500 max-w-md mx-auto">
                                Ask about fund data, survey responses, network profiles, or any CFF platform data.
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                              {[
                                'How many total surveys do we have?',
                                'Give me a summary of 2024 survey data',
                                'Which companies are in East Africa?',
                                'Show me fund size distribution',
                              ].map((prompt) => (
                                <button
                                  key={prompt}
                                  onClick={() => { setInput(prompt); }}
                                  className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
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
                                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                        {(userProfile?.company_name || userProfile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </>
                                  ) : (
                                    <>
                                      <AvatarImage src="/robot.png" />
                                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
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
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                        : 'bg-slate-50 text-slate-800 border border-slate-200'
                                    }`}
                                  >
                                    {message.role === 'assistant' ? (
                                      <div className="text-sm prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-1.5 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-strong:text-slate-900 prose-table:text-xs prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1 prose-table:border-collapse [&_table]:w-full [&_th]:bg-slate-100 [&_th]:border [&_th]:border-slate-300 [&_td]:border [&_td]:border-slate-200 whitespace-pre-wrap break-words">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                      </div>
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
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                                  <Brain className="w-3.5 h-3.5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-medium mb-0.5 text-slate-500">PortIQ</span>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-xs text-slate-500">Analyzing data...</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                    
                    {/* Input Area */}
                    <div className="border-t bg-white/90 backdrop-blur-sm p-3 sm:p-4">
                      {/* Output format selector */}
                      {outputFormat && (
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <span className="text-xs text-slate-500">Output:</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                            {formatOptions.find(f => f.value === outputFormat)?.icon}
                            {formatOptions.find(f => f.value === outputFormat)?.label}
                            <button onClick={() => setOutputFormat(null)} className="ml-1 hover:text-blue-900"><X className="w-3 h-3" /></button>
                          </span>
                        </div>
                      )}
                      <div className="flex items-end gap-2">
                        {/* Format dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-2 flex-shrink-0 border-slate-300" title="Output format">
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
                            className="resize-none min-h-[36px] max-h-[150px] pr-2 py-2 pl-3 text-sm border-slate-300"
                            disabled={loading}
                          />
                        </div>
                        <Button
                          onClick={sendMessage}
                          disabled={loading || !input.trim()}
                          size="sm"
                          className="h-9 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default PortIQ;
