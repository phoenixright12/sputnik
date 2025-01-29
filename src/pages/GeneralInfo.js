import React, { useEffect, useState, useCallback } from "react";
import { Cell, Input, Section, List, Modal } from "@telegram-apps/telegram-ui";
import CustomCell from "../components/CustomCell";
import useTelegram from "../hooks/useTelegram";
import { useApi } from "../hooks/ApiContext";
import { useRegistrationData } from "../hooks/MainRegistrationData";

const GeneralInfo = ({ onSubmit }) => {
  const { registrationData, setRegistrationData } = useRegistrationData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [first_name, setFirstName] = useState(null);
  const [short_description, setShortDescription] = useState(null);
  const [date_of_birth, setDateOfBirth] = useState(null);
  const { cities } = useApi();
  const [city, setCity] = useState(null);
  const [gender, setGender] = useState(null);
  const { tg } = useTelegram();
  const [mainButtonText, setMainButtonText] = useState("Пропустить");

  // чтоб от введеных данных кнопка менялась

  const checkData = useCallback(() => {
    if (city || first_name || short_description || date_of_birth || gender) {
      setMainButtonText("Далее");
    } else {
      setMainButtonText("Пропустить");
    }
  }, [city, first_name, short_description, date_of_birth, gender]);

  useEffect(() => {
    tg.MainButton.setParams({ text: mainButtonText });
  }, [mainButtonText, tg]);

  // Проверяем данные при изменении полей
  useEffect(() => {
    checkData();
  }, [checkData]);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setIsModalOpen(false);
  };

  const filteredCities = Array.isArray(cities)
    ? cities.filter((city) =>
        city.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  //отслеживалка введеных данных
  const onChangeCity = (e) => {
    setCity(e.target.value);
    console.log("Город:", e.target.value);
  };

  const onChangeName = (e) => {
    setFirstName(e.target.value);
    console.log("имя пидора:", e.target.value);
  };

  const onChangeShortDescription = (e) => {
    setShortDescription(e.target.value);
    console.log("описанька пидора)):", e.target.value);
  };

  const onChangeDateOfBirth = (e) => {
    setDateOfBirth(e.target.value);
    console.log("дата рождения пидора)):", e.target.value);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    console.log("поиск:", e.target.value);
  };

  //подгрузка данных
  // Функция для сохранения данных регистрации
  const handleSave = () => {
    setRegistrationData({
      ...registrationData,
      first_name,
      short_description,
      gender,
      date_of_birth: Math.floor(new Date(date_of_birth).getTime() / 1000),
      city_id: city.id,
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
    <List>
      <Section header="Общая информация">
        <Input placeholder="Имя" value={first_name} onChange={onChangeName} />
        <Input
          placeholder="Напишите о себе (максимум 256 символов)"
          value={short_description}
          maxLength={256}
          onChange={onChangeShortDescription}
        />
      </Section>
      <Section footer="В анкете будет отображаться только ваш возраст">
        <Input
          type="date"
          placeholder="Дата рождения"
          name="date_of_birth"
          value={date_of_birth}
          onChange={onChangeDateOfBirth}
        />

        {/* <ul>
          {cities.map((city, index) => (
            <li key={index}>{city}</li> // Отображаем каждый город в списке
          ))}
        </ul> */}

        <Modal
          style={{ minHeight: 400 }}
          header={<Modal.Header>Выберите город</Modal.Header>}
          trigger={
            <Cell id="city" onClick={() => setIsModalOpen(true)}>
              {city ? city.name : "Выберите город"}
            </Cell>
          }
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Input placeholder="Поиск" value={search} onChange={onChangeSearch} />

          <Section>
            {filteredCities.map((filteredCity) => (
              <Cell
                key={filteredCity.id}
                onClick={() => handleCitySelect(filteredCity)}
                onChange={onChangeCity}
              >
                {filteredCity.name}
              </Cell>
            ))}
          </Section>
        </Modal>
      </Section>
      <CustomCell
        header="Выберите пол"
        name="gender"
        firstvalue="male"
        secondvalue="female"
        value={gender}
        firstdescription="Мужской"
        seconddescription="Женский"
        setValue={setGender} // Передача функции как пропса
      />
    </List>
  );
};

export default GeneralInfo;
