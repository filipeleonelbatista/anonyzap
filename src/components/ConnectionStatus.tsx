"use client";
import React from "react";
import type { ConnectionStatus as CS } from "@/types";
import { useI18n } from "@/context/LanguageContext";

interface Props {
  status: CS;
}

export function ConnectionStatus({ status }: Props) {
  const { t } = useI18n();
  const colors = {
    connected: "bg-green-500",
    reconnecting: "bg-yellow-500",
    disconnected: "bg-red-500",
  };
  const labels = {
    connected: t.status.connected,
    reconnecting: t.status.reconnecting,
    disconnected: t.status.disconnected,
  };
  return (
    <span
      className={`w-2 h-2 rounded-full ${colors[status.type]}`}
      title={labels[status.type]}
    />
  );
}
