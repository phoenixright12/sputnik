import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  List,
  Section,
  Input,
  Multiselect,
} from "@telegram-apps/telegram-ui";
import "../assets/styles/ExternalFeatures.css";
import { useRegistrationData } from "../hooks/MainRegistrationData";
import useTelegram from "../hooks/useTelegram";
import { use } from "react";
// import "../assets/styles/GeneralStyle.css";

const ExternalFeatures = ({ onSubmit }) => {
  const { tg } = useTelegram();
  const { registrationData, setRegistrationData } = useRegistrationData();
  const [mainButtonText, setMainButtonText] = useState("Пропустить");
  // const { registrationData, setRegistrationData } = useRegistrationData();
  const checkData = useCallback(() => {
    if (height || weight || physique || otherInfo) {
      setMainButtonText("Далее");
    } else {
      setMainButtonText("Пропустить");
    }
  }, []);

  useEffect(() => {
    tg.MainButton.setParams({ text: mainButtonText });
  }, [mainButtonText, tg]);

  // Проверяем данные при изменении полей
  useEffect(() => {
    checkData();
  }, [checkData]);

  const [appearanceIssues] = useState([
    { value: "piercing", label: "пирсинг" },
    { value: "tattoos", label: "татуировки" },
    { value: "other", label: "другое" },
  ]);
  const [selectedAppearanceIssues, setSelectedAppearanceIssues] = useState([]);
  // const [appearanceIssuesTouched, setAppearanceIssuesTouched] = useState(false);
  const [bad_practices] = useState([
    { value: "smoking", label: "курение" },
    { value: "alcohol", label: "алкоголь" },
    { value: "drugs", label: "наркотики" },
    { value: "other", label: "другое" },
  ]);
  const [selectedBadHabits, setSelectedBadHabits] = useState([]);
  // const [badHabitsTouched, setBadHabitsTouched] = useState(false);

  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [physique, setPhysique] = useState(null);
  const [otherInfo, setOtherInfo] = useState(null);

  //отслеживаем изменения в полях
  const onHeightChange = (e) => {
    setHeight(e.target.value);
  };
  const onWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const onPhysiqueChange = (e) => {
    setPhysique(e.target.value);
  };

  const onChangeOtherInfo = (e) => {
    setOtherInfo(e.target.value);
  };
  const onChangeAppearanceIssues = (selectedOptions) => {
    setSelectedAppearanceIssues(selectedOptions);
  };

  const onChangeBadHabits = (selectedOptions) => {
    setSelectedBadHabits(selectedOptions);
  };
  // прикольчики с кнопочкой
  useEffect(() => {
    tg.MainButton.setParams({ text: "Далее" });
  });

  useEffect(() => {
    if (!height && !weight && !physique && !otherInfo) {
      tg.MainButton.setParams({ text: "Пропустить" });
    }
  }, [height, weight, physique, otherInfo]);

  //отправляем данные на сервер ток не ебу пока как лучше

  const handleSave = () => {
    setRegistrationData({
      ...registrationData,
      appearance: {
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
        physique,
        appearance_issues: selectedAppearanceIssues.map(
          (option) => option.value
        ), // Берем только value
        bad_practices: selectedBadHabits.map((option) => option.value), // Берем только value
        other_info: otherInfo,
      },
    });
  };
  const handleSubmit = () => {
    const data = {};
    if (data) {
      // Сохраняем данные в контексте
      handleSave();
      if (onSubmit) onSubmit(data); // Прокидываем данные через onSubmit
    }
  };

  useEffect(() => {
    const mainButton = window.Telegram.WebApp.MainButton;

    mainButton.onClick(handleSubmit);
    mainButton.show(); // Показываем кнопку

    return () => {
      mainButton.offClick(handleSubmit); // Убираем обработчик при размонтировании
      // mainButton.hide(); // Прячем кнопку
    };
  }, [handleSubmit]);

  return (
    <List className="list">
      <Section
        header="Внешность"
        footer="Данная информация не является обязательной."
      >
        <form className="form-section">
          <Input placeholder="Рост" value={height} onChange={onHeightChange} />
          <Input placeholder="Вес" value={weight} onChange={onWeightChange} />
        </form>
        <Select
          className="Select"
          placeholder="Телосложение"
          value={physique}
          onChange={onPhysiqueChange}
        >
          <option value="">Телосложение</option>
          <option value="thin">худой</option>
          <option value="normal">нормальный</option>
          <option value="sport">спортивный</option>
          <option value="thick">толстый</option>
          <option value="fat">жирный</option>
        </Select>
      </Section>

      <Section header="Особенности внешности">
        <Multiselect
          options={appearanceIssues}
          value={selectedAppearanceIssues}
          onChange={onChangeAppearanceIssues}
          sectionHeader="Особенности внешности"
        />
      </Section>

      <Section header="Вредные привычки">
        <Multiselect
          options={bad_practices}
          value={selectedBadHabits}
          onChange={onChangeBadHabits}
          sectionHeader="Вредные привычки"
        />
      </Section>

      <Section
        header="Прочая информация"
        footer="Например: Лазерная коррекция зрения, ношу линзы"
      >
        <Input
          placeholder="Перенесенные операции и прочая информация."
          value={otherInfo}
          onChange={onChangeOtherInfo}
        />
      </Section>
    </List>
  );
};

export default ExternalFeatures;
