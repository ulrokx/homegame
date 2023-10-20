import { GameStatus } from "@prisma/client";

interface GameStatusTextProps {
  status: GameStatus;
}

export default function GameStatusText({ status }: GameStatusTextProps) {
  const textColor =
    status === GameStatus.PENDING
      ? "bg-yellow-400"
      : status === GameStatus.IN_PROGRESS
      ? "bg-green-400"
      : "bg-red-400"
  const text =
    status === GameStatus.PENDING
      ? "Not Started"
      : status === GameStatus.IN_PROGRESS
      ? "In Progress"
      : "Complete";
  return <span className={`${textColor} p-1 rounded font-bold`}>{text}</span>;
}
