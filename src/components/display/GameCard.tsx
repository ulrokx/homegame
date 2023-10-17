import {
  formatDayDate,
  formatRelative,
  formatTime,
} from "../../utils/formatDates";
import Link from "next/link";
import DatafulYesMaybeNo from "../inputs/DatafulYesMaybeNo";

interface GameCardProps {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function GameCard({
  id,
  name,
  description,
  date,
  location,
}: GameCardProps) {
  return (
    <Link
      href={`/games/${id}`}
      className="min-w-sm rounded-lg bg-gray-50 p-4 shadow hover:bg-gray-100"
    >
      <p className="text-gray-700">{formatRelative(date)}</p>
      <h1 className="text-2xl font-semibold">{name}</h1>
      <p>{description}</p>
      <p className="mt-6 italic">
        {formatDayDate(date)} at {formatTime(date)}
      </p>
      <p className="font-semibold">{location}</p>
      <DatafulYesMaybeNo gameId={id} />
    </Link>
  );
}
