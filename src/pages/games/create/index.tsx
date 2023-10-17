import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { z } from "zod";
import GameForm, {
  type GameFormFieldValues,
} from "../../../components/inputs/GameForm";
import { api } from "../../../utils/api";
import { type SubmitHandler } from "react-hook-form";

export const gameValidationSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  players: z.array(z.string()),
  location: z.string().min(3),
  date: z
    .preprocess(
      (date) => (moment.isMoment(date) ? moment(date).toDate() : date),
      z.date(),
    )
    .refine((date) => {
      return moment().isBefore(date);
    }),
});

export default function GamesCreate() {
  const router = useRouter();
  useSession({ required: true });

  const createGame = api.game.createGame.useMutation({
    onSuccess: () => {
      return router.push("/games");
    },
  });

  const onSubmit: SubmitHandler<GameFormFieldValues> = (data) => {
    createGame.mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-purple-400 to-purple-700 pt-8">
      <header className="mb-4 text-5xl text-white">Create New Game</header>
      <div className="w-1/2 rounded bg-white shadow">
        <GameForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
