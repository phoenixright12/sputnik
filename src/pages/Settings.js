import React, { useEffect, useState } from "react";
import "../assets/styles/Settings.css";
import { Section, List, Cell, Input, Avatar } from "@telegram-apps/telegram-ui";
import ModalWindow from "../components/Modal";
import avatar from "../assets/images/sputnik-logo.png";

import chat from "../assets/images/chat_remove.svg";
import black_cell from "../assets/images/person_remove_28.svg";
import safety from "../assets/images/guard_28.svg";

import globe from "../assets/images/globe_28.svg";
import warning from "../assets/images/warning_28.svg";
import channel from "../assets/images/channel_28.svg";

function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <List
      className="list"
      style={
        {
          // background: 'var(--tgui--secondary_bg_color)',
          // padding: '15px',
          // width: '1000vh',
          // height: "100vh"
        }
      }
    >
      {isModalOpen && (
        <ModalWindow isModalOpen={isModalOpen} closeModal={closeModal} />
      )}

      <Section>
        <Cell
          before={<Avatar size={48} src={avatar} />}
          subtitle="Редактировать профиль"
        >
          Name
        </Cell>
        <Cell before={<img src={chat} />} after="Виден всем">
          Видимость
        </Cell>
      </Section>
      <Section
        header="настройки аккаунта"
        footer="Вы можете привязать дополнительные аккаунты к вашему профилю, чтобы повысить его безопасность."
      >
        <Cell before={<img src={chat} />}>Уведомления</Cell>
        <Cell before={<img src={black_cell} />}>Черный список</Cell>
        <Cell before={<img src={safety} />}>Безопасность</Cell>
      </Section>
      <Section header="Прочая информация" footer="Спутник - v1.0.2-beta">
        <Cell before={<img src={globe} />}>Условия использования</Cell>
        <Cell before={<img src={warning} />}>Информация о приложении</Cell>
        <Cell before={<img src={channel} />}>Сообщить о проблеме</Cell>
      </Section>
    </List>
  );
}

export default Settings;
