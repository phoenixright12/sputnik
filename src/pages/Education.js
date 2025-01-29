import React, { useState, useEffect, useCallback } from "react";
import {
  Cell,
  Input,
  Section,
  List,
  Modal,
  Multiselect,
  Accordion,
} from "@telegram-apps/telegram-ui";
import useTelegram from "../hooks/useTelegram";
import { useApi } from "../hooks/ApiContext";
import { useRegistrationData } from "../hooks/MainRegistrationData";

const Education = ({ onSubmit }) => {
  const { registrationData, setRegistrationData } = useRegistrationData();
  const [searchProfession, setSearchProfession] = useState("");
  const [searchStudyPlace, setSearchStudyPlace] = useState("");
  const [mainButtonText, setMainButtonText] = useState("Пропустить");
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const { professions, studyPlaces, languages } = useApi();
  console.log("languages:", languages);
  const tg = useTelegram();

  const [studyPlace, setStudyPlace] = useState(null);
  const [profession, setProfession] = useState(null);
  const [language, setLanguage] = useState([]);
  const [otherInfo, setOtherInfo] = useState(null);

  const [isStudyPlaceModalOpen, setIsStudyPlaceModalOpen] = useState(false);
  const [isProfessionModalOpen, setIsProfessionModalOpen] = useState(false);

  const handleAccordionChange = useCallback((id) => {
    setExpandedAccordion((prev) => (prev === id ? null : id));
  }, []);

  const safeLanguages = Array.isArray(languages)
    ? languages
        .filter((lang) => lang && lang.id && lang.name) // Фильтрация некорректных данных
        .map(({ id, name }) => ({ value: id, label: name }))
    : [];

  const checkData = useCallback(() => {
    if (!studyPlace && !profession && !language.length && !otherInfo) {
      setMainButtonText("Пропустить");
    } else {
      setMainButtonText("Далее");
    }
  }, [studyPlace, profession, language, otherInfo]);

  useEffect(() => {
    tg.MainButton.setParams({ text: mainButtonText });
  }, [mainButtonText, tg]);

  // Проверяем данные при изменении полей
  useEffect(() => {
    checkData();
  }, [checkData]);
  //для работы с данными из апи кент

  const handleProfessionSelect = (selectedProfession) => {
    setProfession(selectedProfession);
    setIsProfessionModalOpen(false);
  };

  const filteredProfessions = Array.isArray(professions)
    ? professions.filter((profession) =>
        profession.name.toLowerCase().includes(searchProfession.toLowerCase())
      )
    : [];

  // const filteredLanguages = Array.isArray(languages)
  //   ? languages.filter((language) => language.name.toLowerCase())
  //   : [];

  // /отслеживалка введеных данных
  const onChangeSearchProfession = (e) => {
    setSearchProfession(e.target.value);
    console.log("поиск профессии:", e.target.value);
  };
  const onChangeSearchStudyPlace = (e) => {
    setSearchStudyPlace(e.target.value);
    console.log("поиск места обучения:", e.target.value);
  };
  const onChangeOtherInfo = (e) => {
    setOtherInfo(e.target.value);
    console.log("прочая информация:", e.target.value);
  };

  const OnChangeLanguages = (selectedLanguages) => {
    setLanguage(selectedLanguages);
    console.log("языки:", selectedLanguages);
  };

  const onChangeStudy = (e) => {
    setStudyPlace(e.target.value);
    console.log("идинах:", e.target.value);
  };

  const onChangeProff = (e) => {
    setProfession(e.target.value);
    console.log("профессия:", e.target.value);
  };

  const handleSave = () => {
    setRegistrationData({
      speciality: {
        profession: profession ? profession.name : "", // Берём только строку из объекта профессии
        place_of_study: studyPlace ? studyPlace.place : "", // Берём только строку из объекта места обучения
        languages: language.map((lang) => lang.label), // или .name, если нужен name вместо label

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
    mainButton.show();

    return () => {
      mainButton.offClick(handleSubmit);
      // mainButton.hide();
    };
  }, [handleSubmit]);

  // const safeLanguages = Array.isArray(languages)
  //   ? languages.filter((lang) => lang && lang.name && lang.id)
  //   : [];
  // console.log(safeLanguages);

  return (
    <List>
      <Section header="Специализация">
        <Modal
          header={<Modal.Header>Выберите профессию</Modal.Header>}
          trigger={
            <Cell
              id="profession"
              onClick={() => setIsProfessionModalOpen(true)}
            >
              {profession ? profession.name : "Выберите профессию"}
            </Cell>
          }
          open={isProfessionModalOpen}
          onClose={() => setIsProfessionModalOpen(false)}
        >
          <Input
            placeholder="Поиск"
            value={searchProfession}
            onChange={onChangeSearchProfession}
          />
          <Section>
            {filteredProfessions.map((filteredProff) => (
              <Cell
                key={filteredProff.id}
                onClick={() => handleProfessionSelect(filteredProff)}
                onChange={onChangeProff}
              >
                {filteredProff ? filteredProff.name : "Профессия"}
              </Cell>
            ))}
          </Section>
        </Modal>

        <Modal
          header={<Modal.Header>Выберите место обучения</Modal.Header>}
          trigger={
            <Cell
              id="study-place"
              onClick={() => setIsStudyPlaceModalOpen(true)}
            >
              {studyPlace ? studyPlace.place : "Место обучения"}
            </Cell>
          }
          open={isStudyPlaceModalOpen}
          onClose={() => setIsStudyPlaceModalOpen(false)}
        >
          <Input
            placeholder="Поиск"
            value={searchStudyPlace}
            onChange={onChangeSearchStudyPlace}
          />
          <Section>
            {Object.keys(studyPlaces).map((city) => {
              const cityData = studyPlaces[city];

              // Проверяем, является ли cityData массивом
              const places = Array.isArray(cityData)
                ? cityData
                : cityData.places || [];

              return (
                <Accordion
                  key={city}
                  id={city}
                  title={city}
                  expanded={expandedAccordion === city}
                  onChange={() => handleAccordionChange(city)}
                >
                  {places
                    .filter((place) =>
                      place
                        .toLowerCase()
                        .includes(searchStudyPlace.toLowerCase())
                    )
                    .map((place, index) => (
                      <Cell
                        key={index}
                        onClick={() => {
                          setStudyPlace({ place, city }); // Обновляем состояние с городом и местом
                          setIsStudyPlaceModalOpen(false);
                        }}
                      >
                        {place}
                      </Cell>
                    ))}
                </Accordion>
              );
            })}
          </Section>
        </Modal>
      </Section>

      <Section header="Языки">
        <Multiselect
          options={safeLanguages}
          value={language}
          onChange={OnChangeLanguages}
        />
      </Section>

      <Section header="Прочая информация">
        <Input
          placeholder="Специальность, опыт работы в прошлом"
          value={otherInfo}
          onChange={onChangeOtherInfo}
        />
      </Section>
    </List>
  );
};

export default Education;
