import useTelegram from "../hooks/useTelegram";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ModalWindow from "./Modal";

export default function TgBackButton({}) {
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!tg.BackButton) {
      console.error("BackButton не доступен");
      return;
    }

    const handleBackButtonClick = () => {
      switch (location.pathname) {
        case "/general-info":
          navigate("/");
          tg.BackButton.hide(); // Скрываем BackButton
          break;
        case "/education":
          navigate("/general-info");
          break;
        case "/external-features":
          navigate("/education");
          break;
        case "/end-of-registration":
          navigate("/external-features");
          break;
        case "/settings":
          if (isModalOpen) {
            closeModal(); // Закрываем модалку перед скрытием кнопки
          } else {
            tg.BackButton.hide();
          }
          break;
        case "/person-life":
          navigate("/settings");
          break;
        case "/habitation":
          navigate("/settings");
          break;
        case "/family":
          navigate("/settings");
          break;
        case "/preferences":
          navigate("/settings");
          break;

        default:
          console.log("BackButton скрыта на дефолте");
          console.warn("Неизвестный маршрут");
          break;
      }
    };

    // Очищаем обработчик при размонтировании компонента
    tg.BackButton.onClick(handleBackButtonClick);

    // Очищаем обработчик при размонтировании
    return () => {
      tg.BackButton.offClick(handleBackButtonClick);
    };
  }, [tg, location.pathname, navigate]);

  return null; // Компонент ничего не рендерит
}
