import { useEffect } from "react";

const tg = window.Telegram?.WebApp;

export default function useTelegram() {
  useEffect(() => {
    if (!tg) {
      console.error("Telegram WebApp недоступен");
      return;
    }
    tg.ready(); // Ждём, пока WebApp полностью загрузится

    if (tg.MainButton) {
      tg.MainButton.text = "Создать профиль";
      // tg.MainButton.color = "#ffff";
      tg.MainButton.show();

      // tg.MainButton.onClick(() => {
      //   console.log("Main button clicked");
      // });

      // Убираем обработчик при размонтировании
      return () => {
        tg.MainButton.offClick();
      };
    }
  }, [tg.MainButton]);

  return { tg, MainButton: tg.MainButton };
}
