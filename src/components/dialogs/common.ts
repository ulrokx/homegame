export interface GameDialogProps {
    gameId: string;
    open: boolean;
    closeDialog?: () => void;
}