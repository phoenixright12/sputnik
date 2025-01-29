import useTelegram from "../hooks/useTelegram";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useRegistrationData } from "../hooks/MainRegistrationData";
import config from "../general/config";

export default function TgNavButton({}) {
  const access_token = localStorage.getItem("access_token");
  const { tg } = useTelegram();
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationData } = useRegistrationData();
  const handleFinalSubmit = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    };

    try {
      const response = await fetch(
        `${config.serverUrl}api/users.editProfile`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Сеть ответила с ошибкой");
      }
      const result = await response.json();
      console.log("Данные успешно отправлены:", result);
    } catch (error) {
      console.error("Ошибка отправки данных:", error);
    }
  };

  useEffect(() => {
    // if (!tg.MainButton) {
    //   console.error("MainButton не доступен");
    //   return;
    // }

    const handleMainButtonClick = () => {
      switch (location.pathname) {
        case "/":
          tg.MainButton.show();
          tg.MainButton.text = "Создать профиль";
          tg.BackButton.show(); // Показываем BackButton
          navigate("/general-info");
          break;
        case "/general-info":
          navigate("/education");
          break;
        case "/education":
          navigate("/external-features");
          break;
        case "/external-features":
          navigate("/end-of-registration");
          break;
        case "/end-of-registration":
          handleFinalSubmit();
          navigate("/settings");
          tg.MainButton.hide();
          console.log("BackButton clicked");
          // tg.BackButton.hide(); // Скрываем BackButton
          break;
        case "/person-life":
          tg.MainButton.hide();
          break;
        case "/habitation":
          tg.MainButton.hide();
          break;
        case "/family":
          break;
        case "/preferences":
          break;

        default:
          // tg.MainButton.hide();
          console.warn("Неизвестный маршрут");
          break;
      }
    };
    // Очищаем обработчик при размонтировании компонента
    tg.MainButton.onClick(handleMainButtonClick);

    // Очищаем обработчик при размонтировании
    return () => {
      tg.MainButton.offClick(handleMainButtonClick);
    };
  }, [tg, location.pathname, navigate]);

  return null; // Компонент ничего не рендерит
}
