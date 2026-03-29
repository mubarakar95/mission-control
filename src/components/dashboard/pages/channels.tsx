'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Radio,
  MessageCircle,
  Hash,
  Send,
  Phone,
  QrCode,
  CheckCircle2,
  XCircle,
  Settings,
  RefreshCw,
  Link,
  Unlink,
  ExternalLink,
  Copy,
} from 'lucide-react';

interface Channel {
  id: string;
  type: 'telegram' | 'discord' | 'whatsapp' | 'signal' | 'slack';
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  botName?: string;
  serverName?: string;
  lastActivity?: Date;
}

const channels: Channel[] = [
  { id: '1', type: 'telegram', name: 'Main Bot', status: 'connected', botName: '@OpenClawBot', lastActivity: new Date() },
  { id: '2', type: 'slack', name: 'Workspace Slack', status: 'connected', serverName: 'Engineering Team', lastActivity: new Date(Date.now() - 300000) },
  { id: '3', type: 'discord', name: 'Community Server', status: 'disconnected', serverName: 'OpenClaw Community' },
  { id: '4', type: 'whatsapp', name: 'Personal WhatsApp', status: 'pending', lastActivity: new Date(Date.now() - 86400000) },
  { id: '5', type: 'signal', name: 'Signal Bot', status: 'error' },
];

const channelIcons: Record<string, React.ElementType> = {
  telegram: Send,
  discord: Hash,
  whatsapp: Phone,
  signal: MessageCircle,
  slack: Hash,
};

const channelColors: Record<string, string> = {
  telegram: 'bg-blue-500/10 text-blue-400',
  discord: 'bg-purple-500/10 text-purple-400',
  whatsapp: 'bg-green-500/10 text-green-400',
  signal: 'bg-cyan-500/10 text-cyan-400',
  slack: 'bg-orange-500/10 text-orange-400',
};

export function ChannelsPage() {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    connected: 'bg-emerald-500/20 text-emerald-400',
    disconnected: 'bg-zinc-500/20 text-zinc-400',
    error: 'bg-red-500/20 text-red-400',
    pending: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Channels</h2>
          <p className="text-zinc-500">Connect agents to messaging platforms</p>
        </div>
        <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Link className="w-4 h-4 mr-2" />
              Connect Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Connect New Channel</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { type: 'telegram', name: 'Telegram', icon: Send },
                { type: 'discord', name: 'Discord', icon: Hash },
                { type: 'whatsapp', name: 'WhatsApp', icon: Phone },
                { type: 'signal', name: 'Signal', icon: MessageCircle },
                { type: 'slack', name: 'Slack', icon: Hash },
              ].map((channel) => (
                <button
                  key={channel.type}
                  onClick={() => {
                    setSelectedChannelType(channel.type);
                    setIsConnectOpen(false);
                  }}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedChannelType === channel.type
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <channel.icon className={`w-6 h-6 mx-auto mb-2 ${channelColors[channel.type].split(' ')[1]}`} />
                  <span className="text-sm text-white">{channel.name}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.type];
          return (
            <CrashProofPanel key={channel.id} title={`${channel.type} Channel`}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${channelColors[channel.type]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{channel.name}</h3>
                        <p className="text-sm text-zinc-500 capitalize">{channel.type}</p>
                        {channel.botName && (
                          <p className="text-xs text-zinc-400">{channel.botName}</p>
                        )}
                        {channel.serverName && (
                          <p className="text-xs text-zinc-400">{channel.serverName}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={statusColors[channel.status]}>
                      {channel.status === 'connected' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {channel.status === 'error' && <XCircle className="w-3 h-3 mr-1" />}
                      {channel.status}
                    </Badge>
                  </div>

                  {channel.lastActivity && (
                    <p className="text-xs text-zinc-500 mt-3">
                      Last activity: {channel.lastActivity.toLocaleString()}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-800">
                    {channel.status === 'connected' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 bg-zinc-800 border-zinc-700">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700 text-red-400 hover:text-red-300">
                          <Unlink className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </>
                    ) : channel.status === 'pending' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 bg-zinc-800 border-zinc-700">
                          <QrCode className="w-4 h-4 mr-2" />
                          Show QR Code
                        </Button>
                        <Button variant="outline" size="sm" className="bg-zinc-800 border-zinc-700">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                        <Link className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CrashProofPanel>
          );
        })}
      </div>

      {/* QR Code Pairing UI */}
      <CrashProofPanel title="QR Code Pairing">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">QR Code Pairing</CardTitle>
            <CardDescription>Scan with your mobile device to connect WhatsApp or Signal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-zinc-800 mx-auto" />
                  <p className="text-xs text-zinc-600 mt-2">Scan to connect</p>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-2">How to connect WhatsApp</h4>
                <ol className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-white">1</span>
                    Open WhatsApp on your phone
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-white">2</span>
                    Go to Settings → Linked Devices
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-white">3</span>
                    Tap "Link a Device"
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-white">4</span>
                    Point your phone at this screen to capture the QR code
                  </li>
                </ol>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
                    Waiting for scan...
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh QR
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CrashProofPanel>

      {/* Connection Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { platform: 'Telegram', steps: ['Create bot via @BotFather', 'Copy API token', 'Paste in settings'] },
          { platform: 'Discord', steps: ['Create bot in Dev Portal', 'Generate OAuth URL', 'Add to server'] },
          { platform: 'Slack', steps: ['Create Slack App', 'Install to workspace', 'Copy Bot Token'] },
        ].map((guide) => (
          <Card key={guide.platform} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{guide.platform} Setup Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {guide.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-xs text-white flex-shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Button variant="link" size="sm" className="mt-3 p-0 text-emerald-400">
                <ExternalLink className="w-3 h-3 mr-1" />
                Full Documentation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ChannelsPage;
