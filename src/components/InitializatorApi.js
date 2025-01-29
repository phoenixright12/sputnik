import { useEffect, useState } from "react";
import config from "../general/config";

export default function InitializatorApi({}) {
  console.log("Hello World");
  const [error, setError] = useState(null);

  const pingServer = async () => {
    try {
      const response = await fetch(`${config.serverUrl}api/server.ping`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Сервер недоступен");
    } catch (error) {
      setError("Ошибка: Сервер недоступен");
    }
  };

  const getTokens = async () => {
    try {
      const initData = window.Telegram.WebApp.initData;
      const urlParams = new URLSearchParams(initData);
      const response = await fetch(
        `${config.serverUrl}api/auth.telegram?${urlParams.toString()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    } catch (error) {
      setError(`Ошибка: Не удалось получить токены`);
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) throw new Error("Отсутствует access_token");

      const response = await fetch(`${config.serverUrl}api/users.getMe`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      // handleUserState(data.state);
    } catch (error) {
      setError(
        `Ошибка: Не удалось получить информацию о пользователе: ${error}`
      );
      console.error(error);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      await pingServer();
      await getTokens();
      await getUserInfo();
    };
    initApp();
  }, []);
}
