import React, { useState } from "react";
import { Session } from "@/types/session.type";
import useDialogState from "@/hooks/use-dialog-state";

type SessionsDialogType = "add" | "edit" | "delete";

interface SessionsContextType {
  open: SessionsDialogType | null;
  setOpen: (str: SessionsDialogType | null) => void;
  currentRow: Session | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Session | null>>;
}

const SessionsContext = React.createContext<SessionsContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function SessionsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<SessionsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Session | null>(null);

  return (
    <SessionsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SessionsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSessions = () => {
  const sessionsContext = React.useContext(SessionsContext);

  if (!sessionsContext) {
    throw new Error("useSessions has to be used within <SessionsContext>");
  }

  return sessionsContext;
};
