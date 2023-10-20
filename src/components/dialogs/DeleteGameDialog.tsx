import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { type GameDialogProps } from "./common";
import { api } from "../../utils/api";
import { useRouter } from "next/router";

export default function DeleteGameDialog({gameId, open, closeDialog}: GameDialogProps) {
    const {mutateAsync, isLoading} = api.game.deleteGame.useMutation()
    const router = useRouter()

    const handleDelete = async () => {
        await mutateAsync({gameId})
        closeDialog && closeDialog()
        await router.replace("/games") 
    }
    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>Delete Game</DialogTitle>
            <DialogContent>
                Are you sure you want to delete this game?
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button color="error" onClick={() => void handleDelete()} disabled={isLoading}>Delete</Button>
            </DialogActions>

        </Dialog>
    )

}