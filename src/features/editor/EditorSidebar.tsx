
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Layout, Type, Image, FileText, List, Grid, Shapes } from 'lucide-react';
import ComponentItem from './components/ComponentItem';

const EditorSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const layoutComponents = [
    { name: 'Section', icon: <Layout className="h-5 w-5" /> },
    { name: 'Container', icon: <Grid className="h-5 w-5" /> },
    { name: 'Grid', icon: <Grid className="h-5 w-5" /> },
    { name: 'Columns', icon: <Layout className="h-5 w-5" /> },
  ];
  
  const textComponents = [
    { name: 'Heading', icon: <Type className="h-5 w-5" /> },
    { name: 'Paragraph', icon: <FileText className="h-5 w-5" /> },
    { name: 'List', icon: <List className="h-5 w-5" /> },
    { name: 'Quote', icon: <FileText className="h-5 w-5" /> },
  ];
  
  const mediaComponents = [
    { name: 'Image', icon: <Image className="h-5 w-5" /> },
    { name: 'Gallery', icon: <Grid className="h-5 w-5" /> },
    { name: 'Video', icon: <Image className="h-5 w-5" /> },
    { name: 'Icon', icon: <Shapes className="h-5 w-5" /> },
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue="layout" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="layout" className="space-y-1 mt-0">
            {layoutComponents.map((component) => (
              <ComponentItem 
                key={component.name}
                name={component.name}
                icon={component.icon}
              />
            ))}
          </TabsContent>
          <TabsContent value="text" className="space-y-1 mt-0">
            {textComponents.map((component) => (
              <ComponentItem 
                key={component.name}
                name={component.name}
                icon={component.icon}
              />
            ))}
          </TabsContent>
          <TabsContent value="media" className="space-y-1 mt-0">
            {mediaComponents.map((component) => (
              <ComponentItem 
                key={component.name}
                name={component.name}
                icon={component.icon}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditorSidebar;
