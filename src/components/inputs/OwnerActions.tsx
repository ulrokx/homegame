import { Button, type Dialog } from "@mui/material";
import { useState } from "react";
import EditGameDialog from "../dialogs/EditGameDialog";
import InvitePlayerDialog from "../dialogs/InvitePlayerDialog";
import DeleteGameDialog from "../dialogs/DeleteGameDialog";

interface OwnerActions {
  gameId: string;
}

type Dialog = "edit" | "invite" | "delete" | "start" | null;

interface OwnerActionsProps {
  gameId: string;
}

export default function OwnerActions({ gameId }: OwnerActionsProps) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const createHandleOnClick = (dialog: Dialog) => () => setDialog(dialog);
  const handleCloseDialog = () => setDialog(null);
  return (
    <div className="flex rounded bg-blue-100 p-4 shadow">
      <Button onClick={createHandleOnClick("edit")}>Edit Game</Button>
      <Button onClick={createHandleOnClick("invite")}>Invite Player</Button>
      <Button onClick={createHandleOnClick("delete")}>Delete Game</Button>
      <Button color="success">Start Game</Button>
      <EditGameDialog
        gameId={gameId}
        open={dialog === "edit"}
        closeDialog={handleCloseDialog}
      />
      <InvitePlayerDialog
        gameId={gameId}
        open={dialog === "invite"}
        closeDialog={handleCloseDialog}
      />
      <DeleteGameDialog
        gameId={gameId}
        open={dialog === "delete"}
        closeDialog={handleCloseDialog}
      />
    </div>
  );
}
