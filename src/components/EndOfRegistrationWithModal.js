import React, { useEffect, useState } from "react";
import { Modal, Placeholder, Section, Cell } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";

const EndOfRegistrationWithModal = ({ isModalOpen, closeModal }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;

  const pages = [
    { title: "Личная жизнь", path: "/person-life" },
    { title: "Семья", path: "/family" },
    { title: "Проживание", path: "/habitation" },
    { title: "Предпочтения", path: "/preferences" },
  ];

  useEffect(() => {
    if (tg) {
      tg.MainButton.text = "Сохранить";
      tg.MainButton.show();

      const handleMainButtonClick = () => {
        tg.MainButton.hide();
        closeModal();
      };

      tg.MainButton.onClick(handleMainButtonClick);

      return () => {
        tg.MainButton.offClick(handleMainButtonClick);
        tg.MainButton.hide();
      };
    }
  }, [tg, closeModal]);

  return (
    <Modal
      header={<Modal.Header>Дополнительная информация</Modal.Header>}
      onClose={closeModal}
      open={isModalOpen}
    >
      <Section footer="Нажмите на пункт, чтобы открыть соответствующую страницу.">
        {pages.map((page, index) => (
          <Cell key={index} onClick={() => navigate(page.path)}>
            {page.title}
          </Cell>
        ))}
      </Section>
    </Modal>
  );
};

export default EndOfRegistrationWithModal;
