import React, { useState, useEffect, useRef } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Send,
  Brain,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  MessageSquare,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  BarChart3,
  Zap,
  FileText,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MarkdownRenderer from '@/components/chat/MarkdownRenderer';
import { downloadAsExcel, downloadAsPdf } from '@/utils/chatExportUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

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

const formatOptions: { value: OutputFormat; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'text', label: 'Text', icon: <FileText className="w-4 h-4" />, desc: 'Standard text response' },
  { value: 'excel', label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4 text-green-600" />, desc: 'Downloadable spreadsheet' },
  { value: 'pdf', label: 'PDF', icon: <File className="w-4 h-4 text-red-600" />, desc: 'Professional report' },
];

const AdminChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, userRole } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!input.trim()) resetTextareaHeight();
  }, [input]);

  const resetTextareaHeight = () => {
    const textarea = document.querySelector('textarea[placeholder*="Ask Portiq"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = '36px';
    }
  };

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
    setLoadingConversations(true);
    const { data } = await supabase
      .from('chat_conversations')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    setConversations((data as Conversation[]) || []);
    setLoadingConversations(false);
  };

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (data) {
      setMessages(data.map((m: any) => ({ role: m.role, content: m.content })));
    }
  };

  const selectConversation = async (id: string) => {
    setActiveConversationId(id);
    await loadMessages(id);
  };

  const createNewChat = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({ user_id: user.id, title: 'New Chat' })
      .select('id, title, updated_at')
      .single();
    if (error) {
      toast({ title: 'Error', description: 'Failed to create chat', variant: 'destructive' });
      return;
    }
    const newConv = data as Conversation;
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages([]);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from('chat_messages').delete().eq('conversation_id', id);
    await supabase.from('chat_conversations').delete().eq('id', id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
    toast({ title: 'Chat deleted' });
  };

  const renameConversation = async (id: string) => {
    if (!editTitle.trim()) return;
    await supabase.from('chat_conversations').update({ title: editTitle.trim() }).eq('id', id);
    setConversations(prev => prev.map(c => (c.id === id ? { ...c, title: editTitle.trim() } : c)));
    setEditingId(null);
    setEditTitle('');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    let convId = activeConversationId;
    if (!convId) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, title: input.trim().slice(0, 50) })
        .select('id, title, updated_at')
        .single();
      if (error || !data) {
        toast({ title: 'Error', description: 'Failed to create conversation', variant: 'destructive' });
        return;
      }
      const newConv = data as Conversation;
      convId = newConv.id;
      setActiveConversationId(convId);
      setConversations(prev => [newConv, ...prev]);
    }

    const userMessage = input.trim();
    const currentFormat = outputFormat;
    setInput('');
    resetTextareaHeight();
    const userMsg: Message = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      await supabase.from('chat_messages').insert({
        conversation_id: convId,
        user_id: user.id,
        role: 'user',
        content: userMessage
      });

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          outputFormat: currentFormat || 'text'
        }
      });

      if (error) throw error;

      const resText = (data as any)?.reply ?? (data as any)?.response;
      if (resText) {
        // If format is excel or pdf, download directly instead of showing in chat
        if (currentFormat === 'excel') {
          downloadAsExcel(resText, `portiq-${Date.now()}`);
          const assistantMsg: Message = { role: 'assistant', content: '📊 Your Excel file has been downloaded.' };
          setMessages(prev => [...prev, assistantMsg]);
          await supabase.from('chat_messages').insert({
            conversation_id: convId,
            user_id: user.id,
            role: 'assistant',
            content: resText
          });
        } else if (currentFormat === 'pdf') {
          downloadAsPdf(resText, `portiq-report-${Date.now()}`);
          const assistantMsg: Message = { role: 'assistant', content: '📄 Your PDF report has been downloaded.' };
          setMessages(prev => [...prev, assistantMsg]);
          await supabase.from('chat_messages').insert({
            conversation_id: convId,
            user_id: user.id,
            role: 'assistant',
            content: resText
          });
        } else {
          const assistantMsg: Message = { role: 'assistant', content: resText };
          setMessages(prev => [...prev, assistantMsg]);
          await supabase.from('chat_messages').insert({
            conversation_id: convId,
            user_id: user.id,
            role: 'assistant',
            content: resText
          });
        }
        await supabase.from('chat_conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);
        // Reset format after sending
        setOutputFormat(null);
      } else {
        throw new Error('Empty response');
      }
    } catch (error: any) {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] selection:bg-gold-500/20 selection:text-navy-900">
      <SidebarLayout>
        {/* Compact page header — navy/gold */}
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">AI</span>
              <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">PortIQ · Admin</h1>
              <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
              <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">Multi-table access — surveys, applications, network</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          <div className="flex flex-1 p-3 sm:p-4 min-w-0">
            {/* Conversations sidebar */}
            <div
              className={`${sidebarOpen ? 'w-64' : 'w-0'
                } transition-all duration-300 overflow-hidden flex flex-col shrink-0`}
            >
              <div className="h-full flex flex-col rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
                <div className="px-3 py-2.5 border-b border-slate-200/80 flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 font-sans">Conversations</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={createNewChat}
                    title="New Chat"
                    className="h-7 w-7 p-0 text-navy-900 hover:bg-gold-50/80 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {loadingConversations ? (
                    <div className="p-4 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-gold-500" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="p-3 text-center text-[11px] text-slate-500 font-sans">No conversations yet</div>
                  ) : (
                    conversations.map(conv => (
                      <div
                        key={conv.id}
                        className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${activeConversationId === conv.id
                            ? 'bg-gold-50/80 border border-gold-200/80 text-navy-900'
                            : 'border border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        onClick={() => selectConversation(conv.id)}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                        {editingId === conv.id ? (
                          <div className="flex-1 flex items-center gap-1 min-w-0">
                            <Input
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="h-6 text-xs bg-white border-slate-200 font-sans"
                              onClick={e => e.stopPropagation()}
                              onKeyDown={e => {
                                if (e.key === 'Enter') renameConversation(conv.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 shrink-0"
                              onClick={e => {
                                e.stopPropagation();
                                renameConversation(conv.id);
                              }}
                            >
                              <Check className="w-3 h-3 text-gold-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 shrink-0"
                              onClick={e => {
                                e.stopPropagation();
                                setEditingId(null);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 text-xs text-navy-900 font-sans truncate">{conv.title}</span>
                            <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-slate-500 hover:text-navy-900"
                                onClick={e => {
                                  e.stopPropagation();
                                  setEditingId(conv.id);
                                  setEditTitle(conv.title);
                                }}
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-slate-500 hover:text-red-600"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this conversation and all its messages.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteConversation(conv.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center w-7 bg-white border border-slate-200/80 hover:bg-gold-50/80 rounded-r-lg transition-colors shrink-0 shadow-finance text-slate-500 hover:text-navy-900"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Main chat area */}
            <div className="flex-1 min-w-0 flex flex-col ml-2 rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
                <div className="border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between flex-shrink-0 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-navy-900 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5 text-gold-400" />
                    </div>
                    <span className="text-xs font-semibold text-navy-900 font-sans">Chat with PortIQ</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-50/80 border border-gold-200/60 text-[10px] font-medium text-gold-700 font-sans">
                      <Zap className="w-3 h-3" /> Multi-table
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600 font-sans">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 pb-28 bg-slate-50/30">
                  <div className="space-y-4">
                    {messages.length === 0 && !activeConversationId ? (
                      <div className="text-center py-10 space-y-4">
                        <div className="relative inline-flex">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center shadow-finance ring-2 ring-gold-500/30">
                            <Brain className="w-7 h-7 text-gold-400" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gold-500 border-2 border-white" aria-hidden />
                        </div>
                        <div className="rounded-xl border border-slate-200/80 bg-white p-4 max-w-sm mx-auto shadow-sm">
                          <h3 className="text-sm font-semibold text-navy-900 mb-1 font-sans">Welcome to PortIQ</h3>
                          <p className="text-[11px] text-slate-600 font-sans">
                            Start a conversation below or open an existing chat from the sidebar.
                          </p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 max-w-sm mx-auto">
                        <p className="text-[11px] text-slate-500 font-sans">Send a message to start</p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                              } items-start gap-2.5 max-w-[85%] w-full`}
                          >
                            <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
                              {message.role === 'user' ? (
                                <>
                                  <AvatarImage src={userProfile?.profile_picture_url} />
                                  <AvatarFallback className="bg-navy-900 text-gold-400 text-xs">
                                    {userProfile?.company_name?.charAt(0).toUpperCase() ||
                                      userProfile?.full_name?.charAt(0).toUpperCase() ||
                                      user?.email?.charAt(0).toUpperCase() ||
                                      'U'}
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
                              <span className={`text-[10px] font-medium mb-0.5 ${message.role === 'user' ? 'text-right' : 'text-left'} text-slate-500 font-sans`}>
                                {message.role === 'user'
                                  ? userProfile?.company_name || userProfile?.full_name || user?.email?.split('@')[0] || 'You'
                                  : 'PortIQ'}
                              </span>
                              <div
                                className={`rounded-2xl px-4 py-2.5 ${
                                  message.role === 'user'
                                    ? 'bg-navy-900 text-gold-50 border border-navy-800'
                                    : 'bg-white text-slate-800 border border-slate-200/90 shadow-sm'
                                }`}
                              >
                                {message.role === 'assistant' ? (
                                  <MarkdownRenderer content={message.content} />
                                ) : (
                                  <div className="text-sm whitespace-pre-wrap break-words font-sans">{message.content}</div>
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
                            <span className="text-[10px] font-medium mb-0.5 text-slate-500 font-sans">PortIQ</span>
                            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-[11px] text-slate-500 font-sans">Analyzing...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input area */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-slate-200/80 z-10">
                  {outputFormat && (
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <span className="text-[11px] text-slate-500 font-sans">Output:</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gold-50 text-gold-700 flex items-center gap-1 font-sans">
                        {formatOptions.find(f => f.value === outputFormat)?.icon}
                        {formatOptions.find(f => f.value === outputFormat)?.label}
                        <button onClick={() => setOutputFormat(null)} className="ml-1 hover:text-navy-900"><X className="w-3 h-3" /></button>
                      </span>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    {userRole === 'admin' && (
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
                              onClick={() => setOutputFormat(opt.value === 'text' ? null : opt.value)}
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
                    )}
                    <div className="flex-1 relative">
                      <Textarea
                        value={input}
                        onChange={e => {
                          setInput(e.target.value);
                          const ta = e.target;
                          ta.style.height = 'auto';
                          ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask PortIQ about surveys, network data, applications..."
                        rows={1}
                        className="resize-none min-h-[36px] max-h-[150px] pr-12 py-2 pl-3 text-sm rounded-xl border-slate-200 focus-visible:ring-gold-500/30 font-sans bg-white"
                        disabled={loading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-400 shadow-finance"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
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

export default AdminChat;
