import React, { useEffect } from "react";
// import '../assets/styles/StartScreen.css';
import SputnikLogo from "../assets/images/sputnik-logo.png";
import "../assets/styles/MainStyles.css";
import { Placeholder, Button, List, Section } from "@telegram-apps/telegram-ui";

function StartScreen() {
  const tg = window.Telegram.WebApp;

  // Подключаем тему
  // useEffect(() => {
  //   if (tg?.themeParams) {
  //     const { bg_color, text_color,  secondary_bg_color} = tg.themeParams;
  //     document.documentElement.style.setProperty('--bg-color', bg_color || '#EFEFF4');
  //     document.documentElement.style.setProperty('--text-color', text_color || '#000000');
  //     document.documentElement.style.setProperty('--secondary-bg-color', secondary_bg_color || '#FFFFFF');
  //   }
  // }, [tg]);

  return (
    <List>
      <Section>
        <Placeholder
          style={{
            height: 620,
            // width: 500
          }}
          description="Принципиально новый сервис для знакомств в Telegram, нацеленный на создание семейных пар."
          // style={{
          //   color: 'var(--text-color)',
          // }}
          header="Спутник"
        >
          <img
            alt="Telegram sticker"
            className="sputnik-logo"
            src={SputnikLogo}
          />
        </Placeholder>
      </Section>
      <Section
        style={{
          position: "absolute",
          bottom: "35px",
          left: "16px",
          right: "16px",
        }}
      ></Section>
    </List>
  );
}

export default StartScreen;
