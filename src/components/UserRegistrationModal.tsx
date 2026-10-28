"use client";
import React, { useState } from "react";
import { AvatarSelector } from "./AvatarSelector";
import { isValidEmail, isValidName } from "@/utils/validation";
import { sanitizeName } from "@/utils/sanitize";
import { useI18n } from "@/context/LanguageContext";

interface Props {
  roomId: string;
  onRegister: (name: string, email: string, avatar: string) => void;
}

export function UserRegistrationModal({ roomId, onRegister }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    avatar?: string;
  }>({});
  const { t } = useI18n();

  const FEATURES = [
    { icon: "🚀", title: t.register.fNoSignup },
    { icon: "🔒", title: t.register.fPrivacy },
    { icon: "🖼️", title: t.register.fImages },
    { icon: "🔗", title: t.register.fLinks },
    { icon: "📱", title: t.register.fRooms },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!isValidName(name)) newErrors.name = t.validation.name;
    if (!isValidEmail(email)) newErrors.email = t.validation.email;
    if (!avatar) newErrors.avatar = t.validation.avatar;
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onRegister(sanitizeName(name), email.trim(), avatar);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full sm:mx-4 max-h-[90dvh] overflow-y-auto">
        {/* Welcome Section */}
        <div className="p-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center mb-2">
            <div className="text-3xl mb-1">💬</div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {t.register.welcome}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-1.5 p-1 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <span className="text-base flex-shrink-0">{f.icon}</span>
                <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 leading-tight">
                  {f.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {t.register.joinRoom} #{roomId}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {t.register.formHint}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.register.avatarLabel}
              </label>
              <AvatarSelector selected={avatar} onSelect={setAvatar} />
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t.register.nameLabel}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t.register.namePlaceholder}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t.register.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-whatsapp-green focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t.register.emailPlaceholder}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-sm bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-semibold rounded-lg transition-colors"
            >
              {t.register.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
