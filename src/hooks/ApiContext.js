import React, { createContext, useState, useEffect, useContext } from "react";
import config from "../general/config";

// Здесь указываем все эндпоинты
const API_URLS = {
  getCities: `${config.serverUrl}api/server.getCities`,
  getStudyPlaces: `${config.serverUrl}api/server.getStudyPlaces`,
  getProfessions: `${config.serverUrl}api/server.getProfessions`,
  getLanguages: `${config.serverUrl}api/server.getLangs`,
};

// Создаем контекст
const ApiContext = createContext();

// Хук для удобного доступа к данным
export const useApi = () => {
  return useContext(ApiContext);
};

// Провайдер данных
export const ApiProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [studyPlaces, setStudyPlaces] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функция для загрузки данных с нескольких API
    const fetchData = async () => {
      try {
        const citiesRes = await fetch(API_URLS.getCities);
        const studyPlacesRes = await fetch(API_URLS.getStudyPlaces);
        const professionsRes = await fetch(API_URLS.getProfessions);
        const languagesRes = await fetch(API_URLS.getLanguages);

        if (
          !citiesRes.ok ||
          !studyPlacesRes.ok ||
          !professionsRes.ok ||
          !languagesRes.ok
        ) {
          throw new Error("Ошибка при загрузке данных с сервера");
        }

        const citiesData = await citiesRes.json();
        const studyPlacesData = await studyPlacesRes.json();
        const professionsData = await professionsRes.json();
        const languagesData = await languagesRes.json();

        // Проверяем и сохраняем только массив городов
        if (citiesData.ok && Array.isArray(citiesData.cities)) {
          setCities(citiesData.cities);
        } else {
          throw new Error("Ошибка с данными городов");
        }
        // Фильтруем языки, оставляя только нужные поля
        const filteredLanguages = languagesData.languages.map((lang) => ({
          id: lang.id,
          name: lang.name,
        }));

        setLanguages(filteredLanguages);
        console.log("Отфильтрованные языки:", filteredLanguages);
        const filteredStudyPlaces = Object.entries(
          studyPlacesData.study_places
        ).map(([city, places]) => ({
          city,
          places,
        }));

        setStudyPlaces(filteredStudyPlaces);
        console.log("Отфильтрованные учебные заведения:", filteredStudyPlaces);

        setStudyPlaces(filteredStudyPlaces);

        // Фильтруем и сохраняем профессии
        const filteredProfessions = professionsData.professions.map(
          (profession) => ({
            name: profession,
          })
        );

        setProfessions(filteredProfessions);
        console.log("Отфильтрованные профессии:", filteredProfessions);
        setProfessions(filteredProfessions);
      } catch (error) {
        setError(error.message);
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ApiContext.Provider
      value={{ cities, studyPlaces, professions, languages, loading, error }}
    >
      {children}
    </ApiContext.Provider>
  );
};
