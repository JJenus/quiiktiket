import { create } from 'zustand';

interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  modals: Modal[];
  toasts: Toast[];
  loadingOverlay: boolean;
  darkMode: boolean;
  sidebar: {
    collapsed: boolean;
    mobileOpen: boolean;
  };
}

interface UIActions {
  showModal: (component: string, props?: Record<string, any>) => string;
  hideModal: (id: string) => void;
  hideAllModals: () => void;
  pushToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarMobile: (open: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set, get) => ({
  // State
  modals: [],
  toasts: [],
  loadingOverlay: false,
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebar: {
    collapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    mobileOpen: false,
  },

  // Actions
  showModal: (component: string, props = {}) => {
    const id = crypto.randomUUID();
    const modal: Modal = { id, component, props };
    
    set((state) => ({
      modals: [...state.modals, modal],
    }));

    return id;
  },

  hideModal: (id: string) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },

  hideAllModals: () => {
    set({ modals: [] });
  },

  pushToast: (toast) => {
    const id = crypto.randomUUID();
    const fullToast: Toast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, fullToast],
    }));

    // Auto-remove toast after duration (default 5 seconds)
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  setLoadingOverlay: (loading: boolean) => {
    set({ loadingOverlay: loading });
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode.toString());
      
      // Update document class for Tailwind dark mode
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return { darkMode: newDarkMode };
    });
  },

  toggleSidebar: () => {
    set((state) => {
      const collapsed = !state.sidebar.collapsed;
      localStorage.setItem('sidebarCollapsed', collapsed.toString());
      
      return {
        sidebar: {
          ...state.sidebar,
          collapsed,
        },
      };
    });
  },

  setSidebarMobile: (open: boolean) => {
    set((state) => ({
      sidebar: {
        ...state.sidebar,
        mobileOpen: open,
      },
    }));
  },
}));

// Initialize dark mode on app start
if (useUIStore.getState().darkMode) {
  document.documentElement.classList.add('dark');
}