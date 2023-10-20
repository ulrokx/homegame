import {
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { type RouterOutputs } from "../../utils/api";
import StatusIcon from "./StatusIcon";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

interface PlayerTableProps {
  players: NonNullable<RouterOutputs["game"]["getGame"]>["players"]; // TODO: don't do this
  ownerEmail: string;
}

const columns: Array<{
  key: string;
  label: string;
  minWidth: number;
}> = [
  { key: "accepted", label: "Accepted", minWidth: 50 },
  { key: "buyIn", label: "Buy In", minWidth: 100 },
  { key: "stack", label: "Stack", minWidth: 100 },
];

export default function PlayerTable({ players, ownerEmail }: PlayerTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 170 }}>Player</TableCell>
            {columns.map(({ key, label, minWidth }) => (
              <TableCell key={key} sx={{ minWidth }}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.playerEmail}>
              <TableCell className="flex flex-row justify-start">
                <Chip
                  variant="filled"
                  label={player.player.user?.name ?? player.playerEmail}
                  avatar={
                    <Avatar src={player.player.user?.image ?? undefined}>
                      {player.playerEmail[0]}
                    </Avatar>
                  }
                />
                {player.playerEmail === ownerEmail && (
                  <SupervisorAccountIcon className="ml-2" />
                )}
              </TableCell>
              <TableCell>
                <StatusIcon status={player.accepted} />
              </TableCell>
              <TableCell>{player.buyIn.toFixed(2)}</TableCell>
              <TableCell>{player.stack.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
