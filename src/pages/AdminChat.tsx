import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, Brain, Plus, Trash2, Edit3, Check, X, MessageSquare, 
  Loader2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
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

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Load profile and conversations
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
    // Delete messages first, then conversation
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
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: editTitle.trim() } : c));
    setEditingId(null);
    setEditTitle('');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    let convId = activeConversationId;
    if (!convId) {
      // Auto-create conversation
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
    <SidebarLayout>
      <div className="h-[calc(100vh-5rem)] flex bg-white">
        {/* Conversations Sidebar */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-200 bg-gray-50 flex flex-col`}>
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Conversations</h3>
            <Button variant="ghost" size="sm" onClick={createNewChat} title="New Chat">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No conversations yet</div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors ${activeConversationId === conv.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                  onClick={() => selectConversation(conv.id)}
                >
                  <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  {editingId === conv.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-7 text-sm bg-white"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === 'Enter') renameConversation(conv.id); if (e.key === 'Escape') setEditingId(null); }}
                        autoFocus
                      />
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); renameConversation(conv.id); }}><Check className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); setEditingId(null); }}><X className="w-3 h-3" /></Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-700 truncate">{conv.title}</span>
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); setEditingId(conv.id); setEditTitle(conv.title); }}><Edit3 className="w-3 h-3 text-gray-400" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}><Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete this conversation and all its messages.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteConversation(conv.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
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

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center w-6 bg-gray-100 hover:bg-gray-200 transition-colors border-r border-gray-200"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
        </button>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !activeConversationId ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Portiq</h3>
                <p className="text-gray-500 max-w-md mx-auto">Start a new conversation or select an existing one from the sidebar. Your chats are private to your account.</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-[75%]`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {message.role === 'user' ? (
                        <>
                          <AvatarImage src={userProfile?.profile_picture_url} />
                          <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/robot.png" />
                          <AvatarFallback className="bg-purple-600 text-white"><Brain className="w-4 h-4" /></AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.role === 'assistant' ? (
                        <div className="text-sm prose prose-sm max-w-none whitespace-pre-wrap break-words">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8"><AvatarImage src="/robot.png" /><AvatarFallback className="bg-purple-600 text-white"><Brain className="w-4 h-4" /></AvatarFallback></Avatar>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="resize-none min-h-[44px] max-h-[200px] bg-white border-gray-300"
                rows={1}
              />
              <Button onClick={sendMessage} disabled={!input.trim() || loading} className="bg-blue-600 hover:bg-blue-700 h-11 px-4">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AdminChat;
