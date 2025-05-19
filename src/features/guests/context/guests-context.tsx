import React, { useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import useDialogState from "@/hooks/use-dialog-state";
import { Guest } from "../data/schema";

type GuestsDialogType = "invite" | "add" | "edit" | "delete";

interface GuestsContextType {
  open: GuestsDialogType | null;
  setOpen: (str: GuestsDialogType | null) => void;
  currentRow: Guest | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Guest | null>>;
  guests: Guest[];
}

const GuestsContext = React.createContext<GuestsContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function GuestsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<GuestsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Guest | null>(null);

  const guests = useLoaderData({ from: "/_authenticated/guests/" });

  return (
    <GuestsContext value={{ open, setOpen, currentRow, setCurrentRow, guests }}>
      {children}
    </GuestsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGuests = () => {
  const guestsContext = React.useContext(GuestsContext);

  if (!guestsContext) {
    throw new Error("useGuests has to be used within <GuestsContext>");
  }

  return guestsContext;
};
