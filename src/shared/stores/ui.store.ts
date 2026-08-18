// PATH: src/stores/ui.store.ts
// Global UI state store — cross-feature layout state only.
// Rule: NO persist (UI state resets on page load), devtools enabled in dev.
// Rule: CANNOT import from features, routes, layouts, or components.

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { Nullable } from '@/shared/types/common.types'

// ─── State types ──────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark' | 'system'

interface UiState {
    /** Whether the sidebar is collapsed or expanded */
    sidebarOpen: boolean

    /** Current application theme */
    theme: Theme

    /**
     * ID of the currently open modal.
     * null means no modal is open.
     * Use a unique string ID per modal type (e.g. 'confirm-delete', 'edit-profile')
     */
    activeModal: Nullable<string>
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface UiActions {
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setTheme: (theme: Theme) => void
    openModal: (modalId: string) => void
    closeModal: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUiStore = create<UiState & UiActions>()(
    // devtools: exposes store to Redux DevTools browser extension
    // NO persist: UI state should reset on page reload
    devtools(
        (set) => ({
            // Initial state
            sidebarOpen: true,
            theme: 'system',
            activeModal: null,

            // Actions
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'ui/toggleSidebar'),
            setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),
            setTheme: (theme) => set({ theme }, false, 'ui/setTheme'),
            openModal: (modalId) => set({ activeModal: modalId }, false, 'ui/openModal'),
            closeModal: () => set({ activeModal: null }, false, 'ui/closeModal'),
        }),
        { name: 'ui-store' },
    ),
)
