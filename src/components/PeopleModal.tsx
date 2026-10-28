"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

interface ConnectedUser {
  id: string;
  name: string;
  avatar: string;
}

interface Props {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PeopleModal({ roomId, isOpen, onClose }: Props) {
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/rooms/${roomId}/users`)
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [roomId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full mx-4 max-h-[80dvh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.people.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={t.profile.close}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-500 text-center">
              {t.people.loading}
            </p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              {t.people.empty}
            </p>
          ) : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl flex-shrink-0">
                    {u.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {u.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        {t.people.online}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
