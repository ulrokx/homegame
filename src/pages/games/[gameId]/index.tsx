import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { formatDayDate, formatTime } from "../../../utils/formatDates";
import PlayerTable from "../../../components/display/PlayerTable";
import OwnerActions from "../../../components/inputs/OwnerActions";
import { useSession } from "next-auth/react";
import DatafulYesMaybeNo from "../../../components/inputs/DatafulYesMaybeNo";
import GameStatusText from "../../../components/display/GameStatusText";

export default function Game() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { data: userData } = useSession();

  const { data: gameData } = api.game.getGame.useQuery({ id: gameId ?? "" });

  if (!gameData) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-2 bg-gradient-to-b from-purple-400 to-purple-700 pt-8">
      <div className="flex w-3/4 flex-col gap-2 rounded-md bg-gray-50 p-4 shadow">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div>
            <h1 className="block text-5xl font-semibold">{gameData?.name}</h1>
            <h2 className="text-2xl font-medium">
              {formatDayDate(gameData?.date)} @ {formatTime(gameData?.date)}
            </h2>
            <h3 className="text-xl font-semibold">{gameData.location}</h3>
            <p>{gameData?.description}</p>
            <p>Owner: {gameData?.ownerEmail}</p>
            <p>
              Game Status: <GameStatusText status={gameData.status} />
            </p>
          </div>
          <DatafulYesMaybeNo gameId={gameId} />
        </div>
        <hr />
        <PlayerTable
          players={gameData.players}
          ownerEmail={gameData.ownerEmail}
        />
      </div>
      {gameData.ownerEmail === userData?.user.email && (
        <OwnerActions gameId={gameId} gameStatus={gameData.status} />
      )}
    </div>
  );
}
