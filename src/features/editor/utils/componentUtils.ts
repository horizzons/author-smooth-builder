
import { nanoid } from 'nanoid';
import { Component } from '@/store/editorStore';

export const createTextComponent = (type: 'heading' | 'paragraph', text: string): Component => {
  if (type === 'heading') {
    return {
      id: nanoid(),
      type: 'heading',
      name: 'Heading',
      props: {
        text,
        level: 2,
        align: 'left',
      }
    };
  }
  
  return {
    id: nanoid(),
    type: 'paragraph',
    name: 'Paragraph',
    props: {
      text,
      align: 'left',
    }
  };
};

export const createImageComponent = (src: string, alt: string): Component => {
  return {
    id: nanoid(),
    type: 'image',
    name: 'Image',
    props: {
      src,
      alt,
      width: 400,
      height: 300,
    }
  };
};

export const createLayoutComponent = (
  type: 'section' | 'container' | 'grid' | 'columns'
): Component => {
  switch (type) {
    case 'section':
      return {
        id: nanoid(),
        type: 'section',
        name: 'Section',
        props: {
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          backgroundColor: '#ffffff',
        },
        children: []
      };
      
    case 'container':
      return {
        id: nanoid(),
        type: 'container',
        name: 'Container',
        props: {
          maxWidth: 1200,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
        children: []
      };
      
    case 'grid':
      return {
        id: nanoid(),
        type: 'grid',
        name: 'Grid',
        props: {
          columns: 2,
          gap: 20,
        },
        children: []
      };
      
    case 'columns':
      return {
        id: nanoid(),
        type: 'columns',
        name: 'Columns',
        props: {
          columns: [
            { width: '50%' },
            { width: '50%' }
          ],
          gap: 20,
        },
        children: []
      };
  }
};

export const renderComponent = (component: Component): JSX.Element | null => {
  // This is a stub - would be implemented with actual components
  return null;
};
