'use client';

import React, { useState } from 'react';
import { useMissionControlStore } from '@/lib/stores/mission-control';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import { PriorityBadge, Tag, StatusBadge } from '@/components/ui/design-system';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  GripVertical,
  Calendar,
  User,
  MoreVertical,
} from 'lucide-react';
import { Task } from '@/lib/types';

const columns: { id: Task['status']; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

interface SortableTaskProps {
  task: Task;
}

function SortableTask({ task }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all duration-200',
        isDragging ? 'opacity-50 shadow-xl scale-[1.02]' : 'shadow-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-card-foreground">{task.title}</h4>
            <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{task.description}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <PriorityBadge priority={task.priority} size="sm" />
            {task.tags.slice(0, 2).map((tag) => (
              <Tag key={tag} size="sm">{tag}</Tag>
            ))}
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';

export function TasksPage() {
  const { tasks, moveTask, addTask, agents } = useMissionControlStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assigneeId: '',
    tags: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTask = tasks.find((t) => t.id === active.id);
      const overTask = tasks.find((t) => t.id === over.id);

      if (activeTask && overTask && activeTask.status !== overTask.status) {
        moveTask(activeTask.id, overTask.status);
      }
    }
  };

  const handleCreateTask = () => {
    addTask({
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: 'backlog',
      priority: newTask.priority,
      assigneeId: newTask.assigneeId || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newTask.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setIsCreateOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', assigneeId: '', tags: '' });
  };

  const getTasksByStatus = (status: Task['status']) =>
    tasks.filter((t) => t.status === status);

  const columnStatusMap: Record<Task['status'], 'active' | 'running' | 'pending' | 'inactive'> = {
    backlog: 'inactive',
    in_progress: 'running',
    review: 'pending',
    done: 'active',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Management</h2>
          <p className="text-muted-foreground">Drag and drop tasks between columns</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground">Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                  className="mt-1.5 bg-muted border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                  className="mt-1.5 bg-muted border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Priority</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(v) => setNewTask({ ...newTask, priority: v as Task['priority'] })}
                  >
                    <SelectTrigger className="mt-1.5 bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Assignee</label>
                  <Select
                    value={newTask.assigneeId}
                    onValueChange={(v) => setNewTask({ ...newTask, assigneeId: v })}
                  >
                    <SelectTrigger className="mt-1.5 bg-muted border-border">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tags (comma separated)</label>
                <Input
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  placeholder="feature, bug, enhancement..."
                  className="mt-1.5 bg-muted border-border"
                />
              </div>
              <Button
                onClick={handleCreateTask}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!newTask.title.trim()}
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <CrashProofPanel title="Kanban Board">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <Card key={column.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
                      <StatusBadge status={columnStatusMap[column.id]} size="sm" showDot>
                        {column.title}
                      </StatusBadge>
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {getTasksByStatus(column.id).length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={getTasksByStatus(column.id).map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {getTasksByStatus(column.id).map((task) => (
                        <SortableTask key={task.id} task={task} />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            ))}
          </div>
        </DndContext>
      </CrashProofPanel>
    </div>
  );
}

export default TasksPage;
