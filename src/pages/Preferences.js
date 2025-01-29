import React, { useState, useCallback, useEffect } from "react";
import {
  Radio,
  Cell,
  Caption,
  Select,
  Headline,
  Textarea,
  Accordion,
  Subheadline,
  List,
  Section,
  Multiselect,
  Input,
} from "@telegram-apps/telegram-ui";
import "../assets/styles/MainStyles.css";
import useTelegram from "../hooks/useTelegram";
import config from "../general/config";
// import "../assets/styles/Preferences.css";

const Preferences = ({ onSendData }) => {
  const access_token = localStorage.getItem("access_token");
  const { tg } = useTelegram();
  const [religion, setReligion] = useState(null);
  const [familyStructure, setFamilyStructure] = useState(null);
  const [otherInfo, setOtherInfo] = useState(null);
  const [mainButtonText, setMainButtonText] = useState("Пропустить");

  // чтоб от введеных данных кнопка менялась
  const checkData = useCallback(() => {
    if (!religion || !familyStructure || !otherInfo) {
      setMainButtonText("Пропустить");
    } else {
      setMainButtonText("Сохранить");
    }
  }, [otherInfo, religion, familyStructure]);

  useEffect(() => {
    tg.MainButton.setParams({ text: mainButtonText });
  }, [mainButtonText, tg]);

  // Проверяем данные при изменении полей
  useEffect(() => {
    checkData();
  }, [checkData]);

  const religionMap = {
    Ислам: "islam",
    Крестьянство: "christianity",
    Индуизм: "hinduism",
    Буддизм: "buddhism",
    Иудаизм: "judaism",
    Отсутствует: "none",
  };

  const familyMap = {
    "Патриархальная семья": "patriarchal_family",
    "Матриархальная семья": "matriarchal_family",
    "Эгалитарная семья": "egalitarian_family",
    Отсутствует: "none",
  };

  //отслеживалка введеных данных
  const onChangeReligion = (e) => {
    setReligion(e.target.value);
    console.log("Религия:", e.target.value);
  };
  const onChangeFamilyStructure = (e) => {
    setFamilyStructure(e.target.value);
    console.log("Cемейный строй:", e.target.value);
  };
  const onChangeOtherInfo = (e) => {
    setOtherInfo(e.target.value);
    console.log("Прочая информация:", e.target.value);
  };

  const handleSave = useCallback(() => {
    const data = {
      prefers: {
        religion: religionMap[religion] || null,
        family_build_status: familyMap[familyStructure] || null,
        other_info: otherInfo,
      },
    };
    return data;
  }, [religion, familyStructure, otherInfo]);

  // Пример функции handleSubmit
  const handleSubmit = useCallback(() => {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.disable(); // Отключаем кнопку, чтобы предотвратить повторные клики

    try {
      const data = handleSave();
      console.log("Отправляемые данные:", data);

      if (religion !== null || familyStructure !== null || otherInfo !== null) {
        fetch(`${config.serverUrl}api/users.editProfile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Ошибка: ${response.statusText}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log("Данные успешно отправлены:", result);
            if (data && onSendData) {
              onSendData(result); // Можно передать ответ сервера в onSendData
            }
          })
          .catch((error) => {
            console.error("Ошибка при отправке данных:", error);
          });
      } else {
        console.log("Данные не заполнены, пропускаем шаг.");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    } finally {
      mainButton.enable(); // Включаем кнопку в любом случае
    }
  }, [handleSave, onSendData]);

  useEffect(() => {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.onClick(handleSubmit);
    // mainButton.show(); // Показываем кнопку

    return () => {
      mainButton.offClick(handleSubmit); // Убираем обработчик при размонтировании
      // mainButton.hide(); // Прячем кнопку
    };
  }, [handleSubmit]);

  return (
    <List className="List">
      <Section header="Предпочтения">
        <Select
          className="Select"
          placeholder="Религия"
          value={religion}
          onChange={onChangeReligion}
        >
          <option value="" hidden>
            Религия
          </option>

          <option>Ислам</option>
          <option>Крестьянство</option>
          <option>Индуизм</option>
          <option>Буддизм</option>
          <option>Иудаизм</option>
          <option>Отсутствует</option>
        </Select>

        <Select
          className="Select"
          placeholder="Предпочтительный семейный строй"
          value={familyStructure}
          onChange={onChangeFamilyStructure}
        >
          <option value="" hidden>
            Семейный строй
          </option>
          <option>Патриархальная семья</option>
          <option>Матриархальная семья</option>
          <option>Эгалитарная семья</option>
          <option>Отсутствует</option>
        </Select>
      </Section>

      <Section
        header="Прочая информация"
        footer="Например: Блогер-самоучка, люблю лошадей"
      >
        <Input
          placeholder="Ваши увлечения и хобби"
          value={otherInfo}
          onChange={onChangeOtherInfo}
        />
      </Section>
    </List>
  );
};

export default Preferences;
