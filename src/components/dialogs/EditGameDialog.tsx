import { Dialog, DialogTitle, IconButton } from "@mui/material";
import moment from "moment";
import { type SubmitHandler } from "react-hook-form";
import { RiseLoader } from "react-spinners";
import { api } from "../../utils/api";
import GameForm, { type GameFormFieldValues } from "../inputs/GameForm";
import CloseIcon from "@mui/icons-material/Close";
import { type GameDialogProps } from "./common";

export default function EditGameDialog({
  gameId,
  open,
  closeDialog,
}: GameDialogProps) {
  const updateGame = api.game.updateGame.useMutation();
  const { data: gameData, isLoading } = api.game.getGame.useQuery({
    id: gameId,
  });

  const handleSubmit: SubmitHandler<GameFormFieldValues> = async (data) => {
    await updateGame.mutateAsync({ gameId, game: data });
    closeDialog && closeDialog();
  };

  return (
    <Dialog open={open}>
      <IconButton
        onClick={closeDialog}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>Edit Game</DialogTitle>
      {isLoading || !gameData ? (
        <RiseLoader />
      ) : (
        <GameForm
          buttonText={"Update"}
          onSubmit={handleSubmit}
          defaultValues={{
            ...gameData,
            date: moment(gameData.date),
            players: gameData.players.map((player) => player.playerEmail),
          }}
        />
      )}
    </Dialog>
  );
}
