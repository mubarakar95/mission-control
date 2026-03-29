'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CrashProofPanel } from '@/components/dashboard/error-boundary';
import {
  FolderOpen,
  File,
  FileText,
  Image as ImageIcon,
  Code,
  Folder,
  ChevronRight,
  ChevronDown,
  Search,
  Upload,
  Download,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  Plus,
  Grid,
  List,
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  modifiedAt: Date;
  children?: FileNode[];
  content?: string;
}

const fileSystem: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'directory',
    modifiedAt: new Date(),
    children: [
      {
        id: '1-1',
        name: 'agents',
        type: 'directory',
        modifiedAt: new Date(),
        children: [
          { id: '1-1-1', name: 'primary.ts', type: 'file', size: 4521, modifiedAt: new Date(), content: '// Primary agent configuration' },
          { id: '1-1-2', name: 'research.ts', type: 'file', size: 2341, modifiedAt: new Date() },
          { id: '1-1-3', name: 'code-gen.ts', type: 'file', size: 3892, modifiedAt: new Date() },
        ],
      },
      {
        id: '1-2',
        name: 'memory',
        type: 'directory',
        modifiedAt: new Date(),
        children: [
          { id: '1-2-1', name: 'vector-store.ts', type: 'file', size: 5623, modifiedAt: new Date() },
          { id: '1-2-2', name: 'embeddings.ts', type: 'file', size: 3211, modifiedAt: new Date() },
        ],
      },
      { id: '1-3', name: 'index.ts', type: 'file', size: 1234, modifiedAt: new Date() },
      { id: '1-4', name: 'config.ts', type: 'file', size: 892, modifiedAt: new Date() },
    ],
  },
  {
    id: '2',
    name: 'docs',
    type: 'directory',
    modifiedAt: new Date(),
    children: [
      { id: '2-1', name: 'README.md', type: 'file', size: 5421, modifiedAt: new Date() },
      { id: '2-2', name: 'API.md', type: 'file', size: 8932, modifiedAt: new Date() },
      { id: '2-3', name: 'SETUP.md', type: 'file', size: 2341, modifiedAt: new Date() },
    ],
  },
  {
    id: '3',
    name: 'config',
    type: 'directory',
    modifiedAt: new Date(),
    children: [
      { id: '3-1', name: 'settings.json', type: 'file', size: 1234, modifiedAt: new Date() },
      { id: '3-2', name: 'agents.yaml', type: 'file', size: 2456, modifiedAt: new Date() },
    ],
  },
  { id: '4', name: 'package.json', type: 'file', size: 1234, modifiedAt: new Date() },
  { id: '5', name: 'tsconfig.json', type: 'file', size: 567, modifiedAt: new Date() },
];

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return Code;
    case 'md':
      return FileText;
    case 'json':
    case 'yaml':
    case 'yml':
      return FileText;
    case 'png':
    case 'jpg':
    case 'gif':
      return ImageIcon;
    default:
      return File;
  }
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  expandedFolders: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (node: FileNode) => void;
  selectedFile: FileNode | null;
}

function FileTreeItem({ node, depth, expandedFolders, onToggle, onSelect, selectedFile }: FileTreeItemProps) {
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFile?.id === node.id;

  const renderIcon = () => {
    if (node.type === 'directory') {
      return <Folder className="w-4 h-4 text-amber-500" />;
    }
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <Code className="w-4 h-4 text-zinc-400" />;
      case 'md':
        return <FileText className="w-4 h-4 text-zinc-400" />;
      case 'json':
      case 'yaml':
      case 'yml':
        return <FileText className="w-4 h-4 text-zinc-400" />;
      case 'png':
      case 'jpg':
      case 'gif':
        return <ImageIcon className="w-4 h-4 text-zinc-400" />;
      default:
        return <File className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <>
      <button
        onClick={() => node.type === 'directory' ? onToggle(node.id) : onSelect(node)}
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-zinc-800 transition-colors ${
          isSelected ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === 'directory' && (
          <span className="text-zinc-500">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {node.type === 'file' && <span className="w-4" />}
        {renderIcon()}
        <span className="truncate text-sm">{node.name}</span>
      </button>
      {node.type === 'directory' && isExpanded && node.children?.map((child) => (
        <FileTreeItem
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedFolders={expandedFolders}
          onToggle={onToggle}
          onSelect={onSelect}
          selectedFile={selectedFile}
        />
      ))}
    </>
  );
}

export function ExplorerPage() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '1-1']));
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allFiles = useMemo(() => {
    const flatten = (nodes: FileNode[]): FileNode[] =>
      nodes.flatMap((n) => [n, ...(n.children ? flatten(n.children) : [])]);
    return flatten(fileSystem);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allFiles.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allFiles]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Explorer</h2>
          <p className="text-zinc-500">Browse workspace files with semantic search</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-800 border-zinc-700"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
            <kbd className="ml-2 px-1.5 py-0.5 text-xs rounded bg-zinc-700">⌘K</kbd>
          </Button>
          <Button variant="outline" size="icon" className="bg-zinc-800 border-zinc-700" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
            {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* File Tree */}
        <CrashProofPanel title="File Tree" className="lg:col-span-1">
          <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Files</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="py-2">
                  {fileSystem.map((node) => (
                    <FileTreeItem
                      key={node.id}
                      node={node}
                      depth={0}
                      expandedFolders={expandedFolders}
                      onToggle={toggleFolder}
                      onSelect={setSelectedFile}
                      selectedFile={selectedFile}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </CrashProofPanel>

        {/* File Preview */}
        <CrashProofPanel title="File Preview" className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex flex-col">
            {selectedFile ? (
              <>
                <CardHeader className="pb-3 border-b border-zinc-800 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {React.createElement(getFileIcon(selectedFile.name), { className: 'w-5 h-5 text-zinc-400' })}
                      <CardTitle className="text-sm">{selectedFile.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {selectedFile.size && (
                    <CardDescription>
                      {formatSize(selectedFile.size)} • Modified {selectedFile.modifiedAt.toLocaleDateString()}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-4">
                  <pre className="text-sm text-zinc-300 font-mono">
                    <code>{selectedFile.content || `// Content of ${selectedFile.name}\n\n// This is a placeholder for the file content.\n// In a real implementation, this would show the actual file content.`}</code>
                  </pre>
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <FolderOpen className="w-12 h-12 text-zinc-600 mb-4" />
                <h3 className="text-lg font-medium text-zinc-400">No file selected</h3>
                <p className="text-sm text-zinc-500 mt-1">Select a file from the tree to preview</p>
              </div>
            )}
          </Card>
        </CrashProofPanel>
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle>Semantic Search</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search files and content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700"
                autoFocus
              />
            </div>
            <ScrollArea className="h-64 mt-4">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => {
                        setSelectedFile(file);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                    >
                      {React.createElement(getFileIcon(file.name), { className: 'w-4 h-4 text-zinc-400' })}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{file.name}</div>
                        {file.content && (
                          <div className="text-xs text-zinc-500 truncate">{file.content}</div>
                        )}
                      </div>
                      {file.size && (
                        <span className="text-xs text-zinc-500">{formatSize(file.size)}</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-zinc-500">
                  No results found
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  Start typing to search
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExplorerPage;
