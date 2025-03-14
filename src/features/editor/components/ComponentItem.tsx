
import React from 'react';
import { Button } from '@/components/ui/button';

interface ComponentItemProps {
  name: string;
  icon: React.ReactNode;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ name, icon }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentType', name);
  };

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-2 h-auto py-2 px-3 font-normal"
      draggable
      onDragStart={handleDragStart}
    >
      {icon}
      <span>{name}</span>
    </Button>
  );
};

export default ComponentItem;
