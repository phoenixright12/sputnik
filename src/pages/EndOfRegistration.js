import React, { useState, useCallback, useEffect } from "react";
import {
  FileInput,
  Headline,
  Section,
  List,
  Button,
} from "@telegram-apps/telegram-ui";
import "../assets/styles/EndOfRegistration.css";
// import "../assets/styles/GeneralStyle.css";
import config from "../general/config.js";
import useTelegram from "../hooks/useTelegram.js";
import { use } from "react";

const EndOfRegistration = ({ onSendData }) => {
  const access_token = localStorage.getItem("access_token");
  const [mainButtonText, setMainButtonText] = useState("Пропустить");
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { tg } = useTelegram();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      console.error("Файл превышает максимальный размер 10 МБ.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);

    img.onload = () => {
      if (img.width !== 720 || img.height !== 1280) {
        console.error("Разрешение изображения превышает 720x1280.");
      } else {
        setFile(selectedFile);
        console.log("Выбранный файл:", selectedFile);
      }
    };
  };

  const handleSave = useCallback(() => {
    const data = {
      pictures: file,
    };
    return data;
  }, [file]);

  // const UploadProfilePicture = async () => {
  //   if (!file) {
  //     console.error("Файл не выбран.");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     let access_token = localStorage.getItem("access_token");
  //     const response = await fetch(
  //       `${config.serverUrl}api/users.uploadProfilePicture`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //         },
  //       }
  //     );
  //     if (!response.ok) throw new Error("Сервер недоступен");
  //     const result = await response.json();
  //     console.log("Результат загрузки:", result);
  //     return result;
  //   } catch (error) {
  //     console.error("Ошибка загрузки файла:", error);
  //     setError("Ошибка: Сервер недоступен");
  //     throw error;
  //   }
  // };

  const handleSubmit = useCallback(() => {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.disable(); // Отключаем кнопку, чтобы предотвратить повторные клики

    try {
      if (!file) {
        console.log("Файл не выбран, пропускаем шаг.");
        mainButton.enable();
        return;
      }

      // Создаем FormData и добавляем файл
      const formData = new FormData();
      formData.append("file", file);

      console.log("Отправляемый файл:", file);

      // Отправляем данные на сервер
      fetch(`${config.serverUrl}api/users.uploadProfilePicture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`, // Без Content-Type, FormData сам устанавливает
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
          }
          return response.json();
        })
        .then((result) => {
          console.log("Данные успешно отправлены:", result);
          if (onSendData) {
            onSendData(result); // Передача ответа сервера
          }
        })
        .catch((error) => {
          console.error("Ошибка при отправке данных:", error);
        })
        .finally(() => {
          mainButton.enable(); // Включаем кнопку в любом случае
        });
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      mainButton.enable(); // Включаем кнопку в случае ошибки
    }
  }, [file, onSendData, access_token]);

  //кнопочку если данные не введены
  const checkData = useCallback(() => {
    if (!file) {
      setMainButtonText("Пропустить");
    } else {
      setMainButtonText("Далее");
    }
  }, [file]);

  useEffect(() => {
    tg.MainButton.setParams({ text: mainButtonText });
  }, [mainButtonText, tg]);

  // Проверяем данные при изменении полей
  useEffect(() => {
    checkData();
  }, [checkData]);
  //

  useEffect(() => {
    const mainButton = window.Telegram.WebApp.MainButton;

    mainButton.onClick(handleSubmit);
    mainButton.show();

    return () => {
      mainButton.offClick(handleSubmit); // Убираем обработчик при размонтировании
      mainButton.hide(); // Прячем кнопку
    };

    // return () => {
    //   mainButton.offClick(handleSubmit);
    // };
  }, [handleSubmit]);

  return (
    <List className="list">
      <Headline level="1" weight="1">
        Фотография анкеты
      </Headline>
      <Section>
        <FileInput
          style={{ padding: "0 !important" }}
          label="Прикрепить фото"
          multiple={false}
          onChange={handleFileChange}
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Profile"
            width={96}
            height={96}
          />
        )}
      </Section>
      <Section
        footer={
          <div className="EndOfReg__footer">
            Нажимая на кнопку ниже я принимаю{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="EndOfReg__link"
            >
              условия использования
            </a>{" "}
            и{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="EndOfReg__link"
            >
              политику конфиденциальности
            </a>
          </div>
        }
      />
    </List>
  );
};

export default EndOfRegistration;
