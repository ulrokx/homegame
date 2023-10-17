import {
  type FieldValues,
  Controller,
  type Control,
  type ControllerRenderProps,
  type Path,
} from "react-hook-form";
import { forwardRef, useMemo } from "react";
import { Autocomplete, Avatar, Chip, Skeleton, TextField } from "@mui/material";
import { api } from "../../utils/api";

interface Player {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface PokerPlayersSelectProps<T extends FieldValues>
  extends PlayerSelectProps {
  control: Control<T>;
  name: Path<T>;
}

interface PlayerSelectProps {
  label: string;
  multiple?: boolean;
}

interface PokerTableSelectProps
  extends ControllerRenderProps<FieldValues, string>,
    PlayerSelectProps {
  players: Player[];
}

export default function PokerPlayersSelect<T extends FieldValues>({
  name,
  control,
  ...props
}: PokerPlayersSelectProps<T>) {
  const { data: playerData, isLoading } = api.user.getUsers.useQuery();
  if (!playerData || isLoading) return <Skeleton variant="rectangular" />;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <PokerTableSelect players={playerData} {...props} {...field} />
      )}
    />
  );
}

const PlayerSelect = forwardRef<HTMLInputElement, PokerTableSelectProps>(
  ({ players, onChange, label, ...field }, ref) => {
    const emailToPlayer = useMemo(() => {
      return players.reduce<Record<string, Player>>((acc, player) => {
        acc[player.email] = player;
        return acc;
      }, {});
    }, [players]);
    return (
      <Autocomplete
        onChange={(_, value) => onChange(value)}
        {...field}
        filterSelectedOptions
        freeSolo
        fullWidth
        ref={ref}
        options={players.map((player) => player.email)}
        renderInput={(params) => <TextField label={label} {...params} />}
        renderTags={(value) => {
          return value.map((email: string) => {
            const player = emailToPlayer[email];
            if (player)
              return (
                <Chip
                  key={player.id}
                  avatar={
                    <Avatar
                      alt={player.email}
                      src={player.image}
                      imgProps={{ referrerPolicy: "no-referrer" }}
                    />
                  }
                  label={player.name}
                  variant="outlined"
                />
              );
            return (
              <Chip
                key={email}
                avatar={<Avatar>{email[0]}</Avatar>}
                label={email}
              />
            );
          });
        }}
      />
    );
  },
);

PlayerSelect.displayName = "PlayerSelect";

const PokerTableSelect = forwardRef<HTMLInputElement, PokerTableSelectProps>(
  ({ ...field }, ref) => (
    // write some cool poker table visualization here
    <PlayerSelect {...field} ref={ref} />
  ),
);

PokerTableSelect.displayName = "PokerTableSelect";
