import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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
        body: { messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;

      const resText = (data as any)?.reply ?? (data as any)?.response;
      if (resText) {
        const assistantMsg: Message = { role: 'assistant', content: resText };
        setMessages(prev => [...prev, assistantMsg]);
        await supabase.from('chat_messages').insert({
          conversation_id: convId,
          user_id: user.id,
          role: 'assistant',
          content: resText
        });
        await supabase.from('chat_conversations').update({ updated_at: new Date().toISOString() }).eq('id', convId);
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
    <div className="h-screen overflow-hidden">
      <SidebarLayout>
        <div
          className="h-screen bg-cover bg-center bg-fixed overflow-hidden"
          style={{ backgroundImage: 'url(/auth.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 h-full flex p-4 pt-20">
            {/* Conversations sidebar - polished panel */}
            <div
              className={`${sidebarOpen ? 'w-72' : 'w-0'
                } transition-all duration-300 overflow-hidden flex flex-col shrink-0`}
            >
              <Card className="h-full border-2 border-white/20 bg-white/25 backdrop-blur-md shadow-xl flex flex-col">
                <div className="p-3 border-b border-white/30 flex items-center justify-between flex-shrink-0">
                  <h3 className="text-sm font-semibold text-slate-800">Conversations</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={createNewChat}
                    title="New Chat"
                    className="text-slate-700 hover:bg-white/40 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {loadingConversations ? (
                    <div className="p-4 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-500" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-600">No conversations yet</div>
                  ) : (
                    conversations.map(conv => (
                      <div
                        key={conv.id}
                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeConversationId === conv.id
                            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-300/50'
                            : 'hover:bg-white/40 border border-transparent'
                          }`}
                        onClick={() => selectConversation(conv.id)}
                      >
                        <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        {editingId === conv.id ? (
                          <div className="flex-1 flex items-center gap-1">
                            <Input
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              className="h-7 text-sm bg-white border-slate-200"
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
                              className="h-6 w-6 p-0"
                              onClick={e => {
                                e.stopPropagation();
                                renameConversation(conv.id);
                              }}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
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
                            <span className="flex-1 text-sm text-slate-800 truncate">{conv.title}</span>
                            <div className="hidden group-hover:flex items-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={e => {
                                  e.stopPropagation();
                                  setEditingId(conv.id);
                                  setEditTitle(conv.title);
                                }}
                              >
                                <Edit3 className="w-3 h-3 text-slate-500" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-slate-500 hover:text-red-600" />
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
              </Card>
            </div>

            {/* Toggle sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-center w-8 bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/30 rounded-r-lg transition-colors shrink-0"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Main chat card - PortIQ-style */}
            <div className="flex-1 min-w-0 flex items-stretch ml-2">
              <Card className="flex-1 shadow-2xl border-2 border-blue-100 bg-white/30 backdrop-blur-sm flex flex-col relative min-h-0">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0 py-3 px-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Brain className="w-4 h-4 text-purple-600 shrink-0" />
                        Chat with Portiq
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Ask about surveys, applications, network data, and more. Your conversations are private.
                      </CardDescription>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <div className="text-center">
                        <Zap className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
                        <p className="text-[10px] font-medium text-blue-900 leading-tight">Multi-Table</p>
                        <p className="text-[10px] text-blue-700 leading-tight">Access</p>
                      </div>
                      <div className="text-center">
                        <Shield className="w-3 h-3 text-purple-600 mx-auto mb-0.5" />
                        <p className="text-[10px] font-medium text-purple-900 leading-tight">Secure</p>
                        <p className="text-[10px] text-purple-700 leading-tight">Admin</p>
                      </div>
                      <div className="text-center">
                        <BarChart3 className="w-3 h-3 text-pink-600 mx-auto mb-0.5" />
                        <p className="text-[10px] font-medium text-pink-900 leading-tight">Smart</p>
                        <p className="text-[10px] text-pink-700 leading-tight">Insights</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <div className="flex-1 overflow-y-auto min-h-0 p-6 pb-24">
                  <div className="space-y-4">
                    {messages.length === 0 && !activeConversationId ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-10 h-10 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Portiq</h3>
                          <p className="text-gray-600 max-w-md mx-auto">
                            Start a conversation by typing a question below, or open an existing chat from the sidebar.
                          </p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                              } items-start gap-3 max-w-[80%] w-full`}
                          >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              {message.role === 'user' ? (
                                <>
                                  <AvatarImage src={userProfile?.profile_picture_url} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                                    {userProfile?.company_name?.charAt(0).toUpperCase() ||
                                      userProfile?.full_name?.charAt(0).toUpperCase() ||
                                      user?.email?.charAt(0).toUpperCase() ||
                                      'U'}
                                  </AvatarFallback>
                                </>
                              ) : (
                                <>
                                  <AvatarImage src="/robot.png" />
                                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    <Brain className="w-4 h-4" />
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                            <div className="flex flex-col">
                              <div
                                className={`text-xs font-medium mb-1 ${message.role === 'user' ? 'text-right' : 'text-left'
                                  }`}
                              >
                                {message.role === 'user'
                                  ? userProfile?.company_name || userProfile?.full_name || user?.email?.split('@')[0] || 'You'
                                  : 'Portiq'}
                              </div>
                              <div
                                className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg max-w-[600px]'
                                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 shadow-lg border border-blue-200/50 backdrop-blur-sm max-w-[700px]'
                                  }`}
                              >
                                {message.role === 'assistant' ? (
                                  <div className="text-sm prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-gray-900 prose-strong:font-semibold whitespace-pre-wrap break-words">
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
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src="/robot.png" />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              <Brain className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="text-xs font-medium mb-1 text-left">Portiq</div>
                            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl px-4 py-3 shadow-lg border border-blue-200/50 backdrop-blur-sm">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div
                                    className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce"
                                    style={{ animationDelay: '0ms' }}
                                  />
                                  <div
                                    className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                                    style={{ animationDelay: '150ms' }}
                                  />
                                  <div
                                    className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-bounce"
                                    style={{ animationDelay: '300ms' }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">Portiq is thinking...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Floating input */}
                <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:w-[min(600px,100%)] z-10">
                  <div className="relative bg-white rounded-2xl border-2 border-slate-200 shadow-lg min-h-[44px] max-h-[200px] focus-within:border-blue-400 focus-within:shadow-xl transition-all">
                    <Textarea
                      value={input}
                      onChange={e => {
                        setInput(e.target.value);
                        const ta = e.target;
                        ta.style.height = 'auto';
                        ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
                      }}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask Portiq about surveys, network data, applications, and more..."
                      rows={1}
                      className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent pr-12 py-3 pl-4 min-h-[40px] max-h-[184px] overflow-y-auto"
                      disabled={loading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-8 h-8 p-0 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
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

export default AdminChat;
