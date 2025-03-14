
import React, { useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Undo, Redo, Eye, Settings, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from './EditorCanvas';
import EditorProperties from './EditorProperties';

const EditorLayout: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('EditorLayout mounted at path:', location.pathname);
  }, [location]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Editor Header */}
      <header className="h-14 border-b flex items-center px-4 justify-between bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <span className="font-medium">Untitled Site</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Undo className="h-4 w-4" />
            Undo
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Redo className="h-4 w-4" />
            Redo
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button variant="default" size="sm" className="gap-1.5">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </header>

      {/* Editor Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar - Component Library */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-r">
          <EditorSidebar />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Center - Canvas */}
        <ResizablePanel defaultSize={60} className="bg-muted/30">
          <EditorCanvas />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Right Sidebar - Properties Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="border-l">
          <EditorProperties />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EditorLayout;
