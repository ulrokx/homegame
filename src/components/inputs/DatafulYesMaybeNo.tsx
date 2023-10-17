import { api } from "../../utils/api";
import YesMaybeNo from "./YesMaybeNo";

interface DatafulYesMaybeNoProps {
  gameId: string;
}

export default function DatafulYesMaybeNo({ gameId }: DatafulYesMaybeNoProps) {
  const { data: acceptedStatusData, refetch } =
    api.game.getAcceptedStatus.useQuery(
      { gameId },
      { queryKey: ["game.getAcceptedStatus", { gameId }] },
    );

  const updateAcceptedStatus = api.game.updateAcceptedStatus.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });
  const handleResponse = async (response: "YES" | "MAYBE" | "NO") => {
    await updateAcceptedStatus.mutateAsync({ gameId, status: response });
  };

  return (
    <YesMaybeNo
      status={acceptedStatusData}
      onResponse={(response) => void handleResponse(response)}
    />
  );
}
