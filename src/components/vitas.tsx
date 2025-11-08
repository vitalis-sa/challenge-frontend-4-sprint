import { useEffect } from "react";

export const DialogflowChat = () => {
  useEffect(() => {
    // Adiciona o CSS se ainda não existe
    if (!document.querySelector('link[href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css";
      document.head.appendChild(link);
    }

    // Adiciona o script se ainda não existe
    let script = document.querySelector('script[src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"]');
    let scriptAlreadyPresent = !!script;
    if (!scriptAlreadyPresent) {
      script = document.createElement("script");
      (script as HTMLScriptElement).src = "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
      (script as HTMLScriptElement).async = true;
      document.body.appendChild(script);
    }

    // Função para criar o widget
    const createWidget = () => {
      // Evita múltiplos widgets
      if (document.querySelector("df-messenger")) return;

      const dfMessenger = document.createElement("df-messenger");
      dfMessenger.setAttribute("project-id", "vitalis-atendemais");
      dfMessenger.setAttribute("agent-id", "312caf1a-3f80-4bc3-a9c0-c8a9492750e2");
      dfMessenger.setAttribute("language-code", "pt-br");

      const chatBubble = document.createElement("df-messenger-chat-bubble");
      chatBubble.setAttribute("chat-title", "Vitas");
      dfMessenger.appendChild(chatBubble);

      dfMessenger.style.zIndex = "999";
      dfMessenger.style.position = "fixed";
      dfMessenger.style.bottom = "16px";
      dfMessenger.style.right = "16px";
      dfMessenger.style.setProperty("--df-messenger-font-color", "#000");
      dfMessenger.style.setProperty("--df-messenger-font-family", "Google Sans");
      dfMessenger.style.setProperty("--df-messenger-chat-background", "#f3f6fc");
      dfMessenger.style.setProperty("--df-messenger-message-user-background", "#d3e3fd");
      dfMessenger.style.setProperty("--df-messenger-message-bot-background", "#fff");

      document.body.appendChild(dfMessenger);
    };

    // Se o script já estava presente, widget já pode ser criado
    if (scriptAlreadyPresent) {
      createWidget();
    } else {
      // Espera o script carregar para criar o widget
      script.addEventListener("load", createWidget);
    }

    // Cleanup: remove apenas o widget, não o script nem o CSS
    return () => {
      const dfMessenger = document.querySelector("df-messenger");
      if (dfMessenger) {
        document.body.removeChild(dfMessenger);
      }
    };
  }, []);

  return null;
};