import { TextField, Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import PokerPlayersSelect from "./PokerPlayersSelect";
import { gameValidationSchema } from "../../pages/games/create";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";

export interface GameFormFieldValues {
  name: string;
  description: string;
  date: moment.Moment;
  location: string;
  players: string[];
}

interface GameFormProps {
  onSubmit: SubmitHandler<GameFormFieldValues>;
  defaultValues?: GameFormFieldValues;
  buttonText?: string;
}

export default function GameForm({
  onSubmit,
  defaultValues,
  buttonText,
}: GameFormProps) {
  const { control, handleSubmit } = useForm<GameFormFieldValues>({
    resolver: zodResolver(gameValidationSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      date: moment().add(1, "day"),
      location: "",
      players: [],
    },
  });
  return (
    <form
      onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
      className="rounded-m flex w-full flex-col gap-2 p-4 shadow-md"
      autoComplete="off"
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <TextField
            error={!!error}
            helperText={error?.message}
            label="Name"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <TextField
            error={!!error}
            helperText={error?.message}
            multiline
            minRows={3}
            label="Description"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="location"
        render={({ field, fieldState: { error } }) => (
          <TextField
            error={!!error}
            helperText={error?.message}
            label="Location"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            disablePast
            label="Date and Time"
            {...field}
            slotProps={{
              textField: {
                helperText: error ? error.message : undefined,
              },
            }}
          />
        )}
      />
      <PokerPlayersSelect
        multiple
        name="players"
        control={control}
        label="Players"
      />
      <Button type="submit">{buttonText ?? "Submit"}</Button>
    </form>
  );
}
