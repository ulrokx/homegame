import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  DialogTitle,
  type DialogProps,
  DialogActions,
} from "@mui/material";
import { type SubmitHandler, useForm } from "react-hook-form";
import PokerPlayersSelect from "../inputs/PokerPlayersSelect";
import { z } from "zod";
import { api } from "../../utils/api";
import CloseIcon from "@mui/icons-material/Close";
import { useId } from "react";

interface InvitePlayerDialogProps {
  gameId: string;
  open: boolean;
  closeDialog?: () => void;
}

interface InvitePlayerFieldValues {
  email: string;
}

export const invitePlayerValidationSchema = z.object({
  gameId: z.string(),
  email: z.string().email(),
});

export default function InvitePlayerDialog({
  gameId,
  open,
  closeDialog,
}: InvitePlayerDialogProps) {
  const formId = useId();
  const { control, handleSubmit, reset } = useForm<InvitePlayerFieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const invitePlayer = api.game.invitePlayer.useMutation();

  const onSubmit: SubmitHandler<InvitePlayerFieldValues> = async ({
    email,
  }) => {
    console.log("yo");
    await invitePlayer.mutateAsync({ gameId, email });
    closeDialog && closeDialog();
    reset();
  };

  const handleClose: DialogProps["onClose"] = (reason) => {
    if (reason === "backdropClick") {
      return;
    }
    closeDialog && closeDialog();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
      <DialogTitle>Invite Player</DialogTitle>
      <DialogContent>
        <form
          className="flex flex-col"
          id={formId}
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <PokerPlayersSelect control={control} label="Email" name="email" />
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form={formId}>
          Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
}
