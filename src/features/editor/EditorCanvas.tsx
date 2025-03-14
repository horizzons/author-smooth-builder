
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import useEditorDragDrop from '@/hooks/useEditorDragDrop';

const EditorCanvas: React.FC = () => {
  const { viewMode, setViewMode, pages, currentPageId, setCurrentPage } = useEditorStore();
  const { 
    dropTargetRef, 
    isDraggingOver, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop 
  } = useEditorDragDrop();
  
  // Initialize with first page if none selected
  React.useEffect(() => {
    if (!currentPageId && pages.length > 0) {
      setCurrentPage(pages[0].id);
    }
  }, [currentPageId, pages, setCurrentPage]);
  
  // Get current page
  const currentPage = pages.find(page => page.id === currentPageId);
  
  return (
    <div className="h-full flex flex-col">
      {/* Canvas Controls */}
      <div className="border-b p-2 bg-background flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('desktop')}
          >
            <Laptop className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('tablet')}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'} 
            size="icon"
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={currentPageId || undefined} 
            onValueChange={(value) => setCurrentPage(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Canvas Workspace */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div 
          className={`bg-white rounded-lg shadow-sm border overflow-auto transition-all duration-300 h-[calc(100vh-180px)]
            ${viewMode === 'desktop' ? 'w-full max-w-6xl' : 
              viewMode === 'tablet' ? 'w-[768px]' : 
              'w-[375px]'
            }`}
        >
          <div 
            ref={dropTargetRef}
            className={`p-4 min-h-full ${isDraggingOver ? 'bg-primary/5' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {currentPage && currentPage.components.length > 0 ? (
              <div>
                {/* Render components here */}
                <pre className="text-xs overflow-auto">{JSON.stringify(currentPage.components, null, 2)}</pre>
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/20 rounded-lg h-full flex items-center justify-center text-muted-foreground">
                Drag and drop components here to build your page
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
