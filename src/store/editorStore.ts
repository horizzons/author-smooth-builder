
import { create } from 'zustand';
import { nanoid } from 'nanoid';

// Types for Editor Store
export type ComponentType = 'heading' | 'paragraph' | 'image' | 'section' | 'container';
export type ViewMode = 'desktop' | 'tablet' | 'mobile';

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
  path: string;
  components: Component[];
}

interface EditorStore {
  pages: Page[];
  currentPageId: string | null;
  viewMode: ViewMode;
  isDragging: boolean;
  initialized: boolean;
  
  // Actions
  addPage: (page: Omit<Page, 'id'>) => void;
  setCurrentPage: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, props: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  setDragging: (isDragging: boolean) => void;
  initialize: () => void;
}

// Create default homepage
const defaultHomePage: Page = {
  id: nanoid(),
  name: 'Home',
  path: '/',
  components: []
};

// Create the store with default values
export const useEditorStore = create<EditorStore>((set) => ({
  pages: [defaultHomePage],
  currentPageId: defaultHomePage.id,
  viewMode: 'desktop',
  isDragging: false,
  initialized: false,
  
  initialize: () => {
    console.log('Initializing editor store');
    set({ initialized: true });
  },
  
  addPage: (page) => set((state) => ({ 
    pages: [...state.pages, { ...page, id: nanoid() }] 
  })),
  
  setCurrentPage: (id) => set({ currentPageId: id }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  addComponent: (component) => set((state) => {
    // Find current page
    const pageIndex = state.pages.findIndex(p => p.id === state.currentPageId);
    if (pageIndex === -1) return state;
    
    // Create a new array of pages with the updated page
    const updatedPages = [...state.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      components: [...updatedPages[pageIndex].components, component]
    };
    
    return { pages: updatedPages };
  }),
  
  updateComponent: (id, props) => set((state) => {
    // Find current page
    const pageIndex = state.pages.findIndex(p => p.id === state.currentPageId);
    if (pageIndex === -1) return state;
    
    // Create a copy of the components array
    const updatedComponents = [...state.pages[pageIndex].components];
    
    // Find the component and update it
    const componentIndex = updatedComponents.findIndex(c => c.id === id);
    if (componentIndex === -1) return state;
    
    updatedComponents[componentIndex] = {
      ...updatedComponents[componentIndex],
      ...props
    };
    
    // Create a new array of pages with the updated page
    const updatedPages = [...state.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      components: updatedComponents
    };
    
    return { pages: updatedPages };
  }),
  
  removeComponent: (id) => set((state) => {
    // Find current page
    const pageIndex = state.pages.findIndex(p => p.id === state.currentPageId);
    if (pageIndex === -1) return state;
    
    // Filter out the component
    const updatedComponents = state.pages[pageIndex].components.filter(c => c.id !== id);
    
    // Create a new array of pages with the updated page
    const updatedPages = [...state.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      components: updatedComponents
    };
    
    return { pages: updatedPages };
  }),
  
  setDragging: (isDragging) => set({ isDragging })
}));

export default useEditorStore;
