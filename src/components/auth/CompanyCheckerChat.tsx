import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, User, Send, Loader2, Building2, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  options?: { type: 'companies' | 'emails'; items: any[] };
  action?: 'proceed_signup' | 'show_password';
}

interface CompanyCheckerChatProps {
  onComplete: (result: { found: boolean; email?: string; password?: string }) => void;
  onSkip: () => void;
}

export default function CompanyCheckerChat({ onComplete, onSkip }: CompanyCheckerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Welcome! I'll help you check if your company already exists in our system. This helps consolidate all your survey data under one account.\n\nWhat is your company or fund name?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'search' | 'select_companies' | 'select_email' | 'done'>('search');
  const [foundCompanies, setFoundCompanies] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [foundEmails, setFoundEmails] = useState<{ email: string; company: string; year: number }[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>('');

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const searchCompanies = async (companyName: string) => {
    setIsLoading(true);
    addMessage({ role: 'user', content: companyName });

    try {
      const { data, error } = await supabase.functions.invoke('company-lookup', {
        body: { action: 'search', companyName }
      });

      if (error) throw error;

      if (data.companies && data.companies.length > 0) {
        setFoundCompanies(data.companies);
        setStep('select_companies');
        addMessage({
          role: 'assistant',
          content: `I found ${data.companies.length} matching company name(s) in our database. Please select all that belong to your organization (you can select multiple if they're variations of your company name):`,
          options: { type: 'companies', items: data.companies }
        });
      } else {
        addMessage({
          role: 'assistant',
          content: "I couldn't find any companies matching that name in our system. This means you're new to ESCP Network! 🎉\n\nPlease proceed to create a new account.",
          action: 'proceed_signup'
        });
        setStep('done');
      }
    } catch (error) {
      console.error('Search error:', error);
      addMessage({
        role: 'assistant',
        content: "Sorry, there was an error searching. Please try again or skip to regular signup."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEmailsForCompanies = async () => {
    if (selectedCompanies.length === 0) {
      addMessage({
        role: 'assistant',
        content: "Please select at least one company, or if none match, click 'None of these' to proceed with a new signup."
      });
      return;
    }

    setIsLoading(true);
    addMessage({ 
      role: 'user', 
      content: `Selected: ${selectedCompanies.join(', ')}` 
    });

    try {
      const { data, error } = await supabase.functions.invoke('company-lookup', {
        body: { action: 'getEmails', selectedCompanies }
      });

      if (error) throw error;

      if (data.emails && data.emails.length > 0) {
        setFoundEmails(data.emails);
        setStep('select_email');
        addMessage({
          role: 'assistant',
          content: `I found ${data.emails.length} email(s) associated with your company across different survey years. Please select the PRIMARY email you want to use for all your survey data:`,
          options: { type: 'emails', items: data.emails }
        });
      } else {
        addMessage({
          role: 'assistant',
          content: "Interesting - I found the company names but no associated emails. Please proceed with a new signup.",
          action: 'proceed_signup'
        });
        setStep('done');
      }
    } catch (error) {
      console.error('Get emails error:', error);
      addMessage({
        role: 'assistant',
        content: "Sorry, there was an error. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const consolidateData = async () => {
    if (!selectedEmail) {
      addMessage({
        role: 'assistant',
        content: "Please select a primary email address."
      });
      return;
    }

    setIsLoading(true);
    addMessage({ 
      role: 'user', 
      content: `Primary email: ${selectedEmail}` 
    });

    try {
      const { data, error } = await supabase.functions.invoke('company-lookup', {
        body: { action: 'consolidate', selectedCompanies, primaryEmail: selectedEmail }
      });

      if (error) throw error;

      setStep('done');
      
      // Log the password received from backend for debugging
      console.log('Password received from backend:', data.defaultPassword);
      
      // Temporary fix: If backend returns old password, use new one instead
      // TODO: Remove this after Edge Function is redeployed
      const passwordToUse = (data.defaultPassword === 'ESCPNetwork2024!' || !data.defaultPassword) 
        ? '@ESCPNetwork2025#' 
        : data.defaultPassword;
      
      addMessage({
        role: 'assistant',
        content: `✅ **Success!** I've consolidated ${data.totalUpdated} survey record(s) under the email **${selectedEmail}**.\n\n🔐 Your default password is: **${passwordToUse}**\n\nPlease sign in with these credentials. You can change your password after logging in.`,
        action: 'show_password'
      });

      onComplete({ 
        found: true, 
        email: selectedEmail, 
        password: passwordToUse 
      });
    } catch (error) {
      console.error('Consolidation error:', error);
      addMessage({
        role: 'assistant',
        content: "Sorry, there was an error consolidating your data. Please contact support or proceed with regular signup."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (step === 'search') {
      searchCompanies(input.trim());
    }
    setInput('');
  };

  const toggleCompanySelection = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-4 pb-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-800/40 text-white'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Company selection */}
                {message.options?.type === 'companies' && step === 'select_companies' && (
                  <div className="mt-3 space-y-2">
                    {message.options.items.map((company, i) => (
                      <label 
                        key={i} 
                        className="flex items-center gap-2 p-2 bg-blue-900/30 rounded cursor-pointer hover:bg-blue-900/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedCompanies.includes(company)}
                          onCheckedChange={() => toggleCompanySelection(company)}
                          className="border-blue-400 data-[state=checked]:bg-blue-600"
                        />
                        <Building2 className="w-4 h-4 text-blue-300" />
                        <span className="text-sm">{company}</span>
                      </label>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={getEmailsForCompanies}
                        disabled={isLoading || selectedCompanies.length === 0}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Selection'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          addMessage({ role: 'user', content: "None of these are my company" });
                          addMessage({ 
                            role: 'assistant', 
                            content: "No problem! Please proceed to create a new account.",
                            action: 'proceed_signup'
                          });
                          setStep('done');
                          onComplete({ found: false });
                        }}
                        className="bg-red-600/80 hover:bg-red-700 text-white border-red-500/50 hover:border-red-400"
                      >
                        None of these
                      </Button>
                    </div>
                  </div>
                )}

                {/* Email selection */}
                {message.options?.type === 'emails' && step === 'select_email' && (
                  <div className="mt-3 space-y-2">
                    {message.options.items.map((item, i) => (
                      <label 
                        key={i} 
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedEmail === item.email 
                            ? 'bg-green-600/30 border border-green-500' 
                            : 'bg-blue-900/30 hover:bg-blue-900/50'
                        }`}
                        onClick={() => setSelectedEmail(item.email)}
                      >
                        <input
                          type="radio"
                          name="email"
                          checked={selectedEmail === item.email}
                          onChange={() => setSelectedEmail(item.email)}
                          className="accent-green-500"
                        />
                        <Mail className="w-4 h-4 text-blue-300" />
                        <div className="flex-1">
                          <span className="text-sm block">{item.email}</span>
                          <span className="text-xs text-blue-300">{item.company} ({item.year})</span>
                        </div>
                      </label>
                    ))}
                    <Button 
                      size="sm" 
                      onClick={consolidateData}
                      disabled={isLoading || !selectedEmail}
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Consolidating...</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4 mr-2" /> Set as Primary & Consolidate</>
                      )}
                    </Button>
                  </div>
                )}

                {/* Action buttons */}
                {message.action === 'proceed_signup' && (
                  <Button 
                    size="sm" 
                    onClick={() => onComplete({ found: false })}
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" /> Proceed to Sign Up
                  </Button>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-blue-500/50 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-blue-800/40 rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {step === 'search' && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your company name..."
            className="bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 rounded-full"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      )}

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onSkip}
        className="mt-2 text-blue-200 hover:text-white hover:bg-blue-700/30"
      >
        Skip this step
      </Button>
    </div>
  );
}
