import { IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { type AcceptedStatus } from "@prisma/client";
import { type MouseEventHandler } from "react";

interface YesMaybeNoProps {
  onResponse: (response: "YES" | "MAYBE" | "NO") => void;
  status?: AcceptedStatus;
}

export default function YesMaybeNo({ onResponse, status }: YesMaybeNoProps) {
  const createOnClick =
    (response: "YES" | "MAYBE" | "NO"): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.nativeEvent.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      onResponse(response);
      return false;
    };
  return (
    <div className="space-between flex w-min h-min flex-row rounded-lg bg-gray-200 p-2">
      <IconButton onClick={createOnClick("YES")}>
        <ThumbUpIcon color={status === "YES" ? "success" : undefined} />
      </IconButton>
      <IconButton onClick={createOnClick("MAYBE")}>
        <AccessTimeIcon color={status === "MAYBE" ? "warning" : undefined} />
      </IconButton>
      <IconButton onClick={createOnClick("NO")}>
        <ThumbDownIcon color={status === "NO" ? "error" : undefined} />
      </IconButton>
    </div>
  );
}
