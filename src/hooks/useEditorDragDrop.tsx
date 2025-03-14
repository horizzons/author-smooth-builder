
import { useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { Component, useEditorStore } from '@/store/editorStore';

export const useEditorDragDrop = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { addComponent, setDragging } = useEditorStore();
  const dropTargetRef = useRef<HTMLDivElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
    setDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    
    // Create a new component based on the dropped type
    let newComponent: Component;
    
    switch (componentType) {
      case 'Heading':
        newComponent = {
          id: nanoid(),
          type: 'heading',
          name: 'Heading',
          props: {
            text: 'New Heading',
            level: 2,
            align: 'left',
          }
        };
        break;
        
      case 'Paragraph':
        newComponent = {
          id: nanoid(),
          type: 'paragraph',
          name: 'Paragraph',
          props: {
            text: 'This is a new paragraph. Edit this text to add your own content.',
            align: 'left',
          }
        };
        break;
        
      case 'Image':
        newComponent = {
          id: nanoid(),
          type: 'image',
          name: 'Image',
          props: {
            src: 'https://via.placeholder.com/400x300',
            alt: 'Image description',
            width: 400,
            height: 300,
          }
        };
        break;
        
      case 'Section':
        newComponent = {
          id: nanoid(),
          type: 'section',
          name: 'Section',
          props: {
            padding: { top: 20, right: 20, bottom: 20, left: 20 },
            backgroundColor: '#ffffff',
          },
          children: []
        };
        break;
        
      case 'Container':
        newComponent = {
          id: nanoid(),
          type: 'container',
          name: 'Container',
          props: {
            maxWidth: 1200,
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          children: []
        };
        break;
        
      default:
        newComponent = {
          id: nanoid(),
          type: componentType.toLowerCase(),
          name: componentType,
          props: {}
        };
    }
    
    // Add the component to the current page
    addComponent(newComponent);
    
    setIsDraggingOver(false);
    setDragging(false);
  };
  
  return {
    dropTargetRef,
    isDraggingOver,
    handleDragOver,
    handleDragLeave,
    handleDragStart,
    handleDrop
  };
};

export default useEditorDragDrop;
