'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Terminal as TerminalIcon,
  Plus,
  X,
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
} from 'lucide-react';

interface TerminalTab {
  id: string;
  name: string;
  history: { type: 'input' | 'output'; content: string; timestamp: Date }[];
}

const ansiColors: Record<string, string> = {
  '30': 'text-zinc-800',
  '31': 'text-red-500',
  '32': 'text-emerald-500',
  '33': 'text-amber-500',
  '34': 'text-blue-500',
  '35': 'text-purple-500',
  '36': 'text-cyan-500',
  '37': 'text-white',
  '90': 'text-zinc-500',
  '91': 'text-red-400',
  '92': 'text-emerald-400',
  '93': 'text-amber-400',
  '94': 'text-blue-400',
  '95': 'text-purple-400',
  '96': 'text-cyan-400',
  '97': 'text-white',
};

function parseAnsi(text: string): React.ReactNode {
  // Simple ANSI color parsing
  const ansiRegex = /\x1b\[(\d+)m/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let currentColor = '';
  let key = 0;

  text.replace(ansiRegex, (match, code, offset) => {
    if (offset > lastIndex) {
      parts.push(
        <span key={key++} className={currentColor || 'text-zinc-300'}>
          {text.slice(lastIndex, offset)}
        </span>
      );
    }
    currentColor = ansiColors[code] || '';
    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(
      <span key={key++} className={currentColor || 'text-zinc-300'}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : <span className="text-zinc-300">{text}</span>;
}

export function TerminalPage() {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    { id: 'tab-1', name: 'Terminal 1', history: [
      { type: 'output', content: '\x1b[32mWelcome to OpenClaw Terminal\x1b[0m', timestamp: new Date() },
      { type: 'output', content: '\x1b[90mType "help" for available commands\x1b[0m', timestamp: new Date() },
    ] },
  ]);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tabs, activeTab]);

  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    setTabs([
      ...tabs,
      { id: newId, name: `Terminal ${tabs.length + 1}`, history: [
        { type: 'output', content: '\x1b[32mWelcome to OpenClaw Terminal\x1b[0m', timestamp: new Date() },
      ] },
    ]);
    setActiveTab(newId);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const executeCommand = (command: string) => {
    const currentTerminal = tabs.find((t) => t.id === activeTab);
    if (!currentTerminal) return;

    // Add input to history
    const inputEntry = { type: 'input' as const, content: `$ ${command}`, timestamp: new Date() };
    
    // Simulate command execution
    let output = '';
    if (command === 'help') {
      output = `\x1b[33mAvailable commands:\x1b[0m
  help          Show this help message
  status        Show system status
  agents        List active agents
  clear         Clear terminal
  ls            List files
  pwd           Print working directory`;
    } else if (command === 'status') {
      output = `\x1b[32mSystem Status: Healthy\x1b[0m
  CPU: 45%    Memory: 62%    Disk: 38%
  Gateway: Online    Agents: 2/3 active`;
    } else if (command === 'agents') {
      output = `\x1b[34mActive Agents:\x1b[0m
  • Primary Agent (active)
  • Research Assistant (idle)
  • Code Generator (active)`;
    } else if (command === 'clear') {
      setTabs(tabs.map((t) =>
        t.id === activeTab ? { ...t, history: [] } : t
      ));
      return;
    } else if (command === 'ls') {
      output = '\x1b[34mDocuments/\x1b[0m  \x1b[34mDownloads/\x1b[0m  \x1b[32mconfig.json\x1b[0m  \x1b[32mREADME.md\x1b[0m';
    } else if (command === 'pwd') {
      output = '/home/openclaw/workspace';
    } else if (command) {
      output = `\x1b[31mCommand not found: ${command}\x1b[0m`;
    }

    const outputEntry = { type: 'output' as const, content: output, timestamp: new Date() };

    setTabs(tabs.map((t) =>
      t.id === activeTab
        ? { ...t, history: [...t.history, inputEntry, outputEntry] }
        : t
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input.trim());
      setInput('');
    }
  };

  const currentTerminal = tabs.find((t) => t.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Terminal</h2>
          <p className="text-zinc-500">Multi-tabbed web terminal with color support</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700" onClick={addTab}>
            <Plus className="w-4 h-4 mr-2" />
            New Tab
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-zinc-800 border-zinc-700"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Terminal */}
      <CrashProofPanel title="Terminal">
        <Card className={`bg-zinc-950 border-zinc-800 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
          {/* Tab Bar */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-900">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="bg-transparent h-auto p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-zinc-800 rounded-none border-r border-zinc-800 px-4 py-2 group"
                  >
                    <TerminalIcon className="w-3 h-3 mr-2" />
                    {tab.name}
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="ml-2 text-zinc-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Terminal Content */}
          <CardContent className="p-0">
            <ScrollArea className={`h-[500px] ${isFullscreen ? 'h-[calc(100vh-10rem)]' : ''}`} ref={scrollRef}>
              <div className="p-4 font-mono text-sm">
                {currentTerminal?.history.map((entry, i) => (
                  <div
                    key={i}
                    className={`whitespace-pre-wrap ${
                      entry.type === 'input' ? 'text-emerald-400' : ''
                    }`}
                  >
                    {parseAnsi(entry.content)}
                  </div>
                ))}
                <div className="flex items-center text-emerald-400">
                  <span>$ </span>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-white font-mono px-1"
                    autoFocus
                  />
                </div>
              </div>
            </ScrollArea>
          </CardContent>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-900 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
                Connected
              </Badge>
              <span>bash</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </CrashProofPanel>

      {/* Quick Commands */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['status', 'agents', 'ls', 'pwd', 'help'].map((cmd) => (
              <Button
                key={cmd}
                variant="outline"
                size="sm"
                className="bg-zinc-800 border-zinc-700 font-mono text-xs"
                onClick={() => {
                  executeCommand(cmd);
                  inputRef.current?.focus();
                }}
              >
                {cmd}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TerminalPage;
