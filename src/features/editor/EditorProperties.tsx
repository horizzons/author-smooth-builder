
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Layers, Palette, Settings, Trash2 } from 'lucide-react';

const EditorProperties: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Properties</h3>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
      
      <Tabs defaultValue="style" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="style">
            <Palette className="h-4 w-4 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="layers">
            <Layers className="h-4 w-4 mr-1" />
            Layers
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="style" className="mt-0 space-y-4">
            <Accordion type="multiple" defaultValue={["typography", "spacing", "colors"]} className="w-full">
              <AccordionItem value="typography">
                <AccordionTrigger className="py-2">Typography</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="text">Text</Label>
                    <Textarea
                      id="text"
                      placeholder="Enter text here"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="spacing">
                <AccordionTrigger className="py-2">Spacing</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="padding-top">Padding Top</Label>
                      <Input id="padding-top" placeholder="0" type="number" min="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="padding-right">Padding Right</Label>
                      <Input id="padding-right" placeholder="0" type="number" min="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="padding-bottom">Padding Bottom</Label>
                      <Input id="padding-bottom" placeholder="0" type="number" min="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="padding-left">Padding Left</Label>
                      <Input id="padding-left" placeholder="0" type="number" min="0" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="colors">
                <AccordionTrigger className="py-2">Colors</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input id="bg-color" placeholder="#ffffff" />
                      <div className="w-10 h-10 rounded-md bg-white border" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex gap-2">
                      <Input id="text-color" placeholder="#000000" />
                      <div className="w-10 h-10 rounded-md bg-black border" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 space-y-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="element-id">Element ID</Label>
                <Input id="element-id" placeholder="unique-id" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="element-class">CSS Classes</Label>
                <Input id="element-class" placeholder="custom-class" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layers" className="mt-0">
            <div className="border rounded-md h-[calc(100vh-240px)] overflow-auto">
              <div className="p-2 border-b bg-muted/50">
                <p className="text-sm font-medium">Page Structure</p>
              </div>
              <div className="p-2">
                <p className="text-sm text-muted-foreground">No elements selected</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditorProperties;
