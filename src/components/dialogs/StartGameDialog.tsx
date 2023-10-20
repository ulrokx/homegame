import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { type GameDialogProps } from "./common";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import PokerPlayersSelect from "../inputs/PokerPlayersSelect";
import { api } from "../../utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const startGameValidationSchema = z.object({
  confirm: z.boolean().refine((value) => value === true, {
    message: "Must confirm",
  }),
  readyToPlay: z.array(z.string()),
});

interface StartGameDialogFieldValues {
  confirm: boolean;
  readyToPlay: string[];
}

export default function StartGameDialog({
  open,
  closeDialog,
  gameId,
}: GameDialogProps) {
  const { control, handleSubmit } = useForm<StartGameDialogFieldValues>({
    resolver: zodResolver(startGameValidationSchema),
    defaultValues: {
      confirm: false,
      readyToPlay: [],
    },
  });

  const startGame = api.game.startGame.useMutation();

  const onSubmit: SubmitHandler<StartGameDialogFieldValues> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    await startGame.mutateAsync({ gameId, ...data });
  };

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Start Game</DialogTitle>
      <DialogContent>
        <form
          className="flex flex-col gap-2"
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <p>
            Are you sure you want to start this game? Once started, the game
            cannot be stopped. Add any players that are ready to play but have
            not accepted the game or said maybe.
          </p>
          <Controller
            control={control}
            name="confirm"
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox />}
                label="I understand"
              />
            )}
          />
          <PokerPlayersSelect
            control={control}
            label="Last minute players"
            name="readyToPlay"
            multiple
          />
          <Button type="submit" color="success">
            Start Game
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
