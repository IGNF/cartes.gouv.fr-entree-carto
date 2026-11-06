export function useModals(): {
    open: (name: any) => void;
    close: (name: any) => void;
    isOpen: (name: any) => boolean;
};
