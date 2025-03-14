
import { create } from 'zustand';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type ComponentType = 'layout' | 'text' | 'media' | 'interactive';

export interface Component {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children?: Component[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: Component[];
}

interface EditorState {
  // Current state
  currentPageId: string | null;
  selectedComponentId: string | null;
  viewMode: ViewMode;
  isDragging: boolean;
  
  // Content
  pages: Page[];
  
  // History
  history: Page[][];
  historyIndex: number;
  
  // Actions
  setCurrentPage: (pageId: string) => void;
  setSelectedComponent: (componentId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setDragging: (isDragging: boolean) => void;
  
  // Component operations
  addComponent: (component: Component, parentId?: string, index?: number) => void;
  updateComponent: (componentId: string, props: Partial<Component>) => void;
  deleteComponent: (componentId: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  saveState: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Current state
  currentPageId: null,
  selectedComponentId: null,
  viewMode: 'desktop',
  isDragging: false,
  
  // Content
  pages: [
    {
      id: 'home',
      name: 'Home',
      slug: 'home',
      components: []
    }
  ],
  
  // History
  history: [],
  historyIndex: -1,
  
  // Actions
  setCurrentPage: (pageId) => {
    set({ currentPageId: pageId });
  },
  
  setSelectedComponent: (componentId) => {
    set({ selectedComponentId: componentId });
  },
  
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },
  
  setDragging: (isDragging) => {
    set({ isDragging });
  },
  
  // Component operations
  addComponent: (component, parentId, index) => {
    set((state) => {
      const { pages, currentPageId } = state;
      if (!currentPageId) return state;
      
      const newPages = [...pages];
      const pageIndex = newPages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return state;
      
      const page = newPages[pageIndex];
      
      // If no parent specified, add to root
      if (!parentId) {
        if (index !== undefined) {
          page.components.splice(index, 0, component);
        } else {
          page.components.push(component);
        }
      } else {
        // Add to specified parent
        const addToParent = (components: Component[]) => {
          for (let i = 0; i < components.length; i++) {
            if (components[i].id === parentId) {
              if (!components[i].children) components[i].children = [];
              if (index !== undefined) {
                components[i].children.splice(index, 0, component);
              } else {
                components[i].children.push(component);
              }
              return true;
            }
            if (components[i].children && addToParent(components[i].children)) {
              return true;
            }
          }
          return false;
        };
        
        addToParent(page.components);
      }
      
      return { pages: newPages };
    });
    
    get().saveState();
  },
  
  updateComponent: (componentId, props) => {
    set((state) => {
      const { pages, currentPageId } = state;
      if (!currentPageId) return state;
      
      const newPages = [...pages];
      const pageIndex = newPages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return state;
      
      const page = newPages[pageIndex];
      
      const updateInComponents = (components: Component[]) => {
        for (let i = 0; i < components.length; i++) {
          if (components[i].id === componentId) {
            components[i] = { ...components[i], ...props };
            return true;
          }
          if (components[i].children && updateInComponents(components[i].children)) {
            return true;
          }
        }
        return false;
      };
      
      updateInComponents(page.components);
      
      return { pages: newPages };
    });
    
    get().saveState();
  },
  
  deleteComponent: (componentId) => {
    set((state) => {
      const { pages, currentPageId } = state;
      if (!currentPageId) return state;
      
      const newPages = [...pages];
      const pageIndex = newPages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return state;
      
      const page = newPages[pageIndex];
      
      const deleteFromComponents = (components: Component[]) => {
        for (let i = 0; i < components.length; i++) {
          if (components[i].id === componentId) {
            components.splice(i, 1);
            return true;
          }
          if (components[i].children) {
            const deleted = deleteFromComponents(components[i].children);
            if (deleted) return true;
          }
        }
        return false;
      };
      
      deleteFromComponents(page.components);
      
      return { 
        pages: newPages,
        selectedComponentId: null 
      };
    });
    
    get().saveState();
  },
  
  // History operations
  undo: () => {
    set((state) => {
      const { history, historyIndex } = state;
      if (historyIndex <= 0) return state;
      
      const newIndex = historyIndex - 1;
      const newPages = JSON.parse(JSON.stringify(history[newIndex]));
      
      return {
        pages: newPages,
        historyIndex: newIndex
      };
    });
  },
  
  redo: () => {
    set((state) => {
      const { history, historyIndex } = state;
      if (historyIndex >= history.length - 1) return state;
      
      const newIndex = historyIndex + 1;
      const newPages = JSON.parse(JSON.stringify(history[newIndex]));
      
      return {
        pages: newPages,
        historyIndex: newIndex
      };
    });
  },
  
  saveState: () => {
    set((state) => {
      const { pages, history, historyIndex } = state;
      
      // Create a new history entry
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(pages)));
      
      // Limit history size (optional)
      if (newHistory.length > 30) {
        newHistory.shift();
      }
      
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }
}));
