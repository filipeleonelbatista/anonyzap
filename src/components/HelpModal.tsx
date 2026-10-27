"use client";
import React, { useEffect, useCallback } from "react";
import { ThumbsUp, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FAQ = [
  {
    q: "O que é o AnonyZap?",
    a: "É um chat em tempo real que funciona direto do navegador. Cada URL é uma sala de chat diferente — compartilhe o link com quem quiser conversar.",
  },
  {
    q: "Preciso criar conta?",
    a: "Não! Basta escolher um nome, email e avatar. Seus dados ficam salvos apenas no seu navegador (localStorage).",
  },
  {
    q: "Por quanto tempo as mensagens ficam salvas?",
    a: "As mensagens expiram automaticamente após 24 horas. Nada é armazenado permanentemente.",
  },
  {
    q: "Posso enviar imagens?",
    a: "Sim! Use o botão de imagem ao lado do campo de mensagem. As imagens também expiram em 24 horas.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Seu nome, email e avatar ficam apenas no seu navegador. Não temos acesso a esses dados. As salas não são listadas publicamente.",
  },
  {
    q: "Como convido alguém?",
    a: "Copie a URL da sala (o link da página) e envie para quem quiser. Cada URL é uma sala única.",
  },
];

export function HelpModal({ isOpen, onClose }: Props) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full my-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💬</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Sobre o AnonyZap
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chat em tempo real, anônimo e temporário
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Features Summary */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
            <span className="text-2xl">🚀</span>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              Sem cadastro
            </p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-center">
            <span className="text-2xl">🔒</span>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              Privado
            </p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
            <span className="text-2xl">🖼️</span>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              Imagens
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
            <span className="text-2xl">⏳</span>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              24h de duração
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-3 mb-6">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                {item.q}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-whatsapp-green hover:bg-whatsapp-green-dark text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
        >
          <span>Entendi!</span>
          <ThumbsUp className="w-5 h-5 shrink-0" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
