import { Tooltip } from "@mui/material";
import { AcceptedStatus } from "@prisma/client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

interface StatusIconProps {
  status: AcceptedStatus;
}

export default function StatusIcon({ status }: StatusIconProps) {
  const tooltip =
    status === AcceptedStatus.YES
      ? "Yes"
      : status === AcceptedStatus.MAYBE
      ? "Maybe"
      : AcceptedStatus.PENDING
      ? "Pending"
      : "No";
  return (
    <Tooltip title={tooltip}>
      {status === AcceptedStatus.YES ? (
        <ThumbUpIcon color="success" />
      ) : status === AcceptedStatus.MAYBE ? (
        <AccessTimeIcon color="warning" />
      ) : status === AcceptedStatus.PENDING ? (
        <HourglassBottomIcon color="info" />
      ) : (
        <ThumbDownIcon color="error" />
      )}
    </Tooltip>
  );
}
