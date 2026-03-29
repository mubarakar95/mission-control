'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  Plus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Settings,
  Trash2,
  Edit,
  TestTube,
} from 'lucide-react';
import { CronJob } from '@/lib/types';

export function CronPage() {
  const { cronJobs, updateCronStatus } = useMissionControlStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CronJob | null>(null);
  const [newJob, setNewJob] = useState({
    name: '',
    schedule: '',
    command: '',
  });

  const handleToggleStatus = (jobId: string, currentStatus: CronJob['status']) => {
    updateCronStatus(jobId, currentStatus === 'running' ? 'paused' : 'running');
  };

  const handleTestJob = (job: CronJob) => {
    console.log('Testing job:', job.name);
  };

  const statusColors: Record<CronJob['status'], string> = {
    running: 'bg-emerald-500/20 text-emerald-400',
    paused: 'bg-amber-500/20 text-amber-400',
    error: 'bg-red-500/20 text-red-400',
  };

  const statusIcons: Record<CronJob['status'], React.ElementType> = {
    running: CheckCircle2,
    paused: Pause,
    error: XCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Cron & Scheduling</h2>
          <p className="text-zinc-500">Manage recurring tasks and scheduled jobs</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              New Cron Job
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Create New Cron Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-zinc-400">Job Name</label>
                <Input
                  value={newJob.name}
                  onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                  placeholder="Daily backup..."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Schedule (Cron Expression)</label>
                <Input
                  value={newJob.schedule}
                  onChange={(e) => setNewJob({ ...newJob, schedule: e.target.value })}
                  placeholder="0 8 * * *"
                  className="bg-zinc-800 border-zinc-700 font-mono"
                />
                <p className="text-xs text-zinc-500 mt-1">Minute Hour Day Month Weekday</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Command</label>
                <Input
                  value={newJob.command}
                  onChange={(e) => setNewJob({ ...newJob, command: e.target.value })}
                  placeholder="backup-db --compress"
                  className="bg-zinc-800 border-zinc-700 font-mono"
                />
              </div>
              <Button
                onClick={() => setIsCreateOpen(false)}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                Create Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cron Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cronJobs.map((job) => {
          const StatusIcon = statusIcons[job.status];
          return (
            <CrashProofPanel key={job.id} title={`Cron Job: ${job.name}`}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-500" />
                      {job.name}
                    </CardTitle>
                    <Badge className={statusColors[job.status]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Schedule:</span>
                      <div className="font-mono text-white">{job.schedule}</div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Command:</span>
                      <div className="font-mono text-white truncate">{job.command}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-500">Last Run:</span>
                      <div className="text-white">
                        {job.lastRun ? new Date(job.lastRun).toLocaleString() : 'Never'}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Next Run:</span>
                      <div className="text-white">
                        {job.nextRun ? new Date(job.nextRun).toLocaleString() : '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(job.id, job.status)}
                      className="flex-1"
                    >
                      {job.status === 'running' ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestJob(job)}
                      className="flex-1"
                    >
                      <TestTube className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CrashProofPanel>
          );
        })}
      </div>

      {/* Run History */}
      <CrashProofPanel title="Run History">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-500" />
              Run History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {[
                  { job: 'Daily Report Generation', time: '08:00:15', status: 'success', duration: '2.3s' },
                  { job: 'Memory Cleanup', time: '00:00:45', status: 'success', duration: '15.7s' },
                  { job: 'Backup Database', time: '02:00:00', status: 'failed', duration: '-', error: 'Connection timeout' },
                  { job: 'Daily Report Generation', time: '08:00:12', status: 'success', duration: '2.1s' },
                  { job: 'Daily Report Generation', time: '08:00:18', status: 'success', duration: '2.5s' },
                  { job: 'Memory Cleanup', time: '00:00:32', status: 'success', duration: '12.3s' },
                ].map((run, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      {run.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{run.job}</div>
                        <div className="text-xs text-zinc-500">{run.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">{run.duration}</div>
                      {run.error && (
                        <div className="text-xs text-red-400">{run.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </CrashProofPanel>
    </div>
  );
}

export default CronPage;
