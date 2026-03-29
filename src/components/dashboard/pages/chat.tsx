'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Send,
  Paperclip,
  Bot,
  User,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Code,
  MoreVertical,
  RotateCcw,
  Copy,
  Trash2,
} from 'lucide-react';

const availableModels = [
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
];

export function ChatPage() {
  const { agents, chatMessages, addChatMessage, isStreaming, setStreaming, selectedAgentId, selectAgent } = useMissionControlStore();
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

    // Add user message
    addChatMessage({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
      agentId: selectedAgent.id,
      model: selectedModel,
    });

    setInput('');
    setAttachments([]);
    setStreaming(true);

    // Simulate AI response with streaming
    setTimeout(() => {
      const responses = [
        "I understand your request. Let me analyze the current state and provide recommendations.",
        "Based on the data available, I can help you optimize the workflow. Here are my suggestions...",
        "I've processed your query. The results indicate that we should focus on the following areas...",
        "Let me break this down into actionable steps that we can implement immediately.",
      ];

      addChatMessage({
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        agentId: selectedAgent.id,
        model: selectedModel,
      });
      setStreaming(false);
    }, 1500);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-4">
      {/* Agent Selection Sidebar */}
      <CrashProofPanel title="Agent Selection" className="w-64 flex-shrink-0">
        <Card className="h-full bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Select Agent</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="space-y-1 p-3 pt-0">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => selectAgent(agent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedAgentId === agent.id
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'hover:bg-zinc-800'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${
                        agent.status === 'active' ? 'bg-emerald-500' :
                        agent.status === 'idle' ? 'bg-amber-500' :
                        'bg-zinc-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-zinc-500">{agent.model}</div>
                    </div>
                    {selectedAgentId === agent.id && (
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </CrashProofPanel>

      {/* Main Chat Area */}
      <CrashProofPanel title="Chat" className="flex-1">
        <Card className="h-full flex flex-col bg-zinc-900 border-zinc-800">
          {/* Chat Header */}
          <CardHeader className="border-b border-zinc-800 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {agents.find((a) => a.id === selectedAgentId)?.name || 'Select an agent'}
                  </CardTitle>
                  <p className="text-xs text-zinc-500">
                    {agents.find((a) => a.id === selectedAgentId)?.status || 'offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
                  <p className="text-sm text-zinc-500 max-w-md">
                    Select an agent from the sidebar and type your message to begin chatting.
                  </p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={
                        message.role === 'user'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500/20 text-white'
                          : 'bg-zinc-800 text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.model && (
                          <Badge variant="outline" className="text-xs bg-zinc-800">
                            {message.model}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isStreaming && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-zinc-800 p-4">
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {attachments.map((file, i) => (
                  <Badge key={i} variant="outline" className="bg-zinc-800">
                    <FileText className="w-3 h-3 mr-1" />
                    {file.name}
                    <button
                      onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                      className="ml-2 text-zinc-400 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                id="file-attach"
                className="hidden"
                onChange={handleFileAttach}
                multiple
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white"
                onClick={() => document.getElementById('file-attach')?.click()}
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <Button
                onClick={handleSend}
                disabled={isStreaming || (!input.trim() && attachments.length === 0)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </CrashProofPanel>
    </div>
  );
}

export default ChatPage;
