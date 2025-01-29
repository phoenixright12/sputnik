import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AppRoot } from "@telegram-apps/telegram-ui";
import GeneralInfo from "./pages/GeneralInfo";
import EducationPage from "./pages/Education";
import ExternalFeatures from "./pages/ExternalFeatures";
import EndOfRegistration from "./pages/EndOfRegistration";
import useTelegram from "./hooks/useTelegram";
import StartScreen from "./pages/StartScreen";
import TgNavButton from "./components/TgNavButton";
import TgBackButton from "./components/TgBackButton";
import StepsPanel from "./components/Steps";
import Settings from "./pages/Settings";
import PersonLife from "./pages/PersonLife";
import Family from "./pages/Family";
import Habitation from "./pages/Habitation";
import Preferences from "./pages/Preferences";
import InitializatorApi from "./components/InitializatorApi";
import { MainRegistrationDataProvider } from "./hooks/MainRegistrationData";
import config from "./general/config";

function App() {
  const tg = window.Telegram?.WebApp;

  useTelegram(tg);

  return (
    <MainRegistrationDataProvider>
      <AppRoot>
        <InitializatorApi />

        <Router>
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route
              path="/general-info"
              element={<PageWithSteps page="general-info" />}
            />
            <Route
              path="/education"
              element={<PageWithSteps page="education" />}
            />
            <Route
              path="/external-features"
              element={<PageWithSteps page="external-features" />}
            />
            <Route
              path="/end-of-registration"
              element={<PageWithSteps page="end-of-registration" />}
            />

            <Route path="/settings" element={<Settings />} />
            <Route path="/person-life" element={<PersonLife />} />
            <Route path="/family" element={<Family />} />
            <Route path="/habitation" element={<Habitation />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
          <TgBackButton />
          <TgNavButton />
        </Router>
      </AppRoot>
    </MainRegistrationDataProvider>
  );
}

const PageWithSteps = ({ page }) => {
  const stepsMapping = {
    "general-info": 1,
    education: 2,
    "external-features": 3,
    "end-of-registration": 4,
    settings: 5,
  };

  return (
    <div>
      <StepsPanel progress={stepsMapping[page]} />
      {page === "general-info"}
      {page === "education" && <EducationPage />}
      {page === "external-features" && <ExternalFeatures />}
      {page === "end-of-registration" && <EndOfRegistration />}
    </div>
  );
};

export default App;
