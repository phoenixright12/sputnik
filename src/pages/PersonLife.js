import React, { useState, useCallback, useEffect } from "react";
import {
  Radio,
  Cell,
  Headline,
  Slider,
  Section,
  IconContainer,
  List,
} from "@telegram-apps/telegram-ui";
import "../assets/styles/PersonalLife.css";
import "../assets/styles/MainStyles.css";
import useTelegram from "../hooks/useTelegram";
import config from "../general/config";

const PersonalLife = ({ onSendData }) => {
  const access_token = localStorage.getItem("access_token");
  const { tg } = useTelegram();
  const [hasRelationships, setHasRelationships] = useState(null);
  const [hasIntimacyRelationships, setHasIntimacyRelationships] =
    useState(null);
  const [hasMarried, setHasMarried] = useState(null);
  const [value, setValue] = useState(0); // Значение по умолчанию
  const [mainButtonText, setMainButtonText] = useState("Пропустить");

  const handleSliderChange = (newValue) => {
    setValue(newValue); // Обновляем значение слайдера
  };

  // Проверяем данные на каждом изменении
  const checkData = useCallback(() => {
    if (
      hasRelationships === null ||
      hasIntimacyRelationships === null ||
      hasMarried === null ||
      value === 0
    ) {
      setMainButtonText("Пропустить");
    } else {
      setMainButtonText("Сохранить");
    }
  }, [hasRelationships, hasIntimacyRelationships, hasMarried, value]);

  // Отправляем данные
  const handleSave = useCallback(() => {
    const data = {
      intimacy: {
        has_relationships: hasRelationships === "YES",
        has_intimacy_relationships: hasIntimacyRelationships === "YES",
        has_married: hasMarried === "YES",
        child_count: value,
      },
    };
    return data;
  }, [hasRelationships, hasIntimacyRelationships, hasMarried, value]);

  const handleSubmit = useCallback(() => {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.disable(); // Отключаем кнопку, чтобы предотвратить повторные клики

    try {
      const data = handleSave(); // Формируем данные

      // Если хотя бы какие-то данные есть, отправляем их
      if (
        hasRelationships !== null ||
        hasIntimacyRelationships !== null ||
        hasMarried !== null ||
        value !== 0
      ) {
        console.log("Отправляемые данные:", data);

        // Отправка данных на сервер
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
    tg.MainButton.setParams({ text: mainButtonText });
  }, [mainButtonText, tg]);

  // Один useEffect для проверки и отправки данных
  useEffect(() => {
    checkData();
  }, [checkData]);

  useEffect(() => {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.onClick(handleSubmit);
    // mainButton.show(); // Показываем кнопку

    return () => {
      mainButton.offClick(handleSubmit); // Убираем обработчик при размонтировании
      mainButton.hide(); // Прячем кнопку
    };
  }, [handleSubmit]);

  return (
    <List className="list">
      <Headline level="1" weight="1">
        Личная жизнь
      </Headline>

      <Section header="БЫЛИ ЛИ У ВАС ОТНОШЕНИЯ">
        <form className="yesno">
          <Section>
            <Cell
              className="yesno__item"
              before={
                <Radio
                  name="hasRelationships"
                  value="NO"
                  checked={hasRelationships === "NO"}
                  onChange={() => setHasRelationships("NO")}
                />
              }
            >
              Нет
            </Cell>
          </Section>
          <Section>
            <Cell
              className="yesno__item"
              before={
                <Radio
                  name="hasRelationships"
                  value="YES"
                  checked={hasRelationships === "YES"}
                  onChange={() => setHasRelationships("YES")}
                />
              }
            >
              Да
            </Cell>
          </Section>
        </form>
      </Section>

      <Section header="БЫЛИ ЛИ У ВАС ПОЛОВЫЕ ОТНОШЕНИЯ">
        <form className="yesno">
          <Section>
            <Cell
              className="yesno__item"
              before={
                <Radio
                  name="hasIntimacyRelationships"
                  value="NO"
                  checked={hasIntimacyRelationships === "NO"}
                  onChange={() => setHasIntimacyRelationships("NO")}
                />
              }
            >
              Нет
            </Cell>
          </Section>
          <Section>
            <Cell
              className="yesno__item"
              before={
                <Radio
                  name="hasIntimacyRelationships"
                  value="YES"
                  checked={hasIntimacyRelationships === "YES"}
                  onChange={() => setHasIntimacyRelationships("YES")}
                />
              }
            >
              Да
            </Cell>
          </Section>
        </form>
      </Section>

      <Section header="БЫЛИ ЛИ ВЫ ЗАМУЖЕМ">
        <form className="yesno">
          {/* <Section> */}
          <Cell
            className="yesno__item"
            before={
              <Radio
                name="hasMarried"
                value="NO"
                checked={hasMarried === "NO"}
                onChange={() => setHasMarried("NO")}
              />
            }
          >
            Нет
          </Cell>
          {/* </Section> */}
          {/* <Section> */}
          <Cell
            className="yesno__item"
            before={
              <Radio
                name="hasMarried"
                value="YES"
                checked={hasMarried === "YES"}
                onChange={() => setHasMarried("YES")}
              />
            }
          >
            Да
          </Cell>
          {/* </Section> */}
        </form>
      </Section>

      <Section header="Количество детей">
        <div style={{ width: "100%" }}>
          <Slider
            after={<IconContainer>{value}</IconContainer>}
            onChange={handleSliderChange} // Передаем новое значение
            min={0}
            max={32}
            step={1}
            style={{ width: "85%" }}
          />
        </div>
      </Section>
    </List>
  );
};

export default PersonalLife;
