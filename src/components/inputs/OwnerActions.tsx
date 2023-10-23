import { Button, type Dialog } from "@mui/material";
import { useState } from "react";
import EditGameDialog from "../dialogs/EditGameDialog";
import InvitePlayerDialog from "../dialogs/InvitePlayerDialog";
import DeleteGameDialog from "../dialogs/DeleteGameDialog";
import StartGameDialog from "../dialogs/StartGameDialog";
import { GameStatus } from "@prisma/client";

interface OwnerActions {
  gameId: string;
}

type Dialog = "edit" | "invite" | "delete" | "start" | null;

interface OwnerActionsProps {
  gameId: string;
  gameStatus: GameStatus;
}

export default function OwnerActions({
  gameId,
  gameStatus,
}: OwnerActionsProps) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const createHandleOnClick = (dialog: Dialog) => () => setDialog(dialog);
  const handleCloseDialog = () => setDialog(null);
  if (gameStatus !== GameStatus.PENDING) return null;
  return (
    <div className="flex rounded bg-blue-100 p-4 shadow">
      {gameStatus === GameStatus.PENDING && (
        <>
          <Button onClick={createHandleOnClick("edit")}>Edit Game</Button>
          <Button onClick={createHandleOnClick("invite")}>Invite Player</Button>
          <Button onClick={createHandleOnClick("delete")}>Delete Game</Button>
          <Button onClick={createHandleOnClick("start")} color="success">
            Start Game
          </Button>
        </>
      )}
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
      <StartGameDialog
        gameId={gameId}
        open={dialog === "start"}
        closeDialog={handleCloseDialog}
      />
    </div>
  );
}
