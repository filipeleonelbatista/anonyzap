"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AvatarSelector } from "./AvatarSelector";
import { isValidName } from "@/utils/validation";
import { sanitizeName } from "@/utils/sanitize";
import { useI18n } from "@/context/LanguageContext";
import type { User } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (name: string, avatar: string) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSave }: Props) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [errors, setErrors] = useState<{ name?: string; avatar?: string }>({});
  const { t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;
    setName(user.name);
    setAvatar(user.avatar);
    setErrors({});
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!isValidName(name)) {
      next.name = t.validation.name;
    }
    if (!avatar) {
      next.avatar = t.validation.avatar;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(sanitizeName(name), avatar);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2
            id="edit-profile-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            {t.profile.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            aria-label={t.profile.close}
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t.profile.emailLabel} <span className="font-medium text-gray-700 dark:text-gray-300">{user.email}</span>{" "}
            {t.profile.emailImmutable}
          </p>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
              {t.profile.avatarLabel}
            </label>
            <AvatarSelector selected={avatar} onSelect={setAvatar} />
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-profile-name"
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {t.profile.nameLabel}
            </label>
            <input
              id="edit-profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-whatsapp-green dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder={t.profile.namePlaceholder}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {t.profile.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-whatsapp-green py-2.5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-green-dark"
            >
              {t.profile.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
