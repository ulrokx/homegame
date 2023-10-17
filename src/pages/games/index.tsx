import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import Link from "next/link";
import GameCard from "../../components/display/GameCard";

export default function Games() {
  const { data: sessionData } = useSession({ required: true });

  const { data: games } = api.game.getGames.useQuery();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-purple-400 to-purple-700 pt-8">
      <div className="mx-auto flex w-3/5 flex-col items-center justify-start">
        <header className="text-5xl font-semibold text-white">
          Heyo <span className="font-bold">{sessionData?.user.name}</span>, here
          are your games:
        </header>
        <Link
          href="/games/create"
          className="my-4 w-full rounded-md bg-green-400 p-6 text-2xl font-semibold text-white transition-all hover:scale-[101%] hover:bg-green-500"
        >
          Create game
        </Link>
        <main className="3 grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
          {games?.map((game) => {
            return <GameCard key={game.id} {...game} />;
          })}
        </main>
      </div>
    </div>
  );
}
