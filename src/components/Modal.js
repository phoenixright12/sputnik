import React, { useEffect, useState } from "react";
import { Modal, Placeholder, Section, Cell } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";
import "../assets/styles/GeneralStyle.css";

export default function ModalWindow({ isModalOpen, closeModal }) {
  {
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
        // tg.MainButton.text = "Сохранить";
        tg.MainButton.show();
        tg.BackButton.show();

        const handleMainButtonClick = () => {
          tg.MainButton.hide();
          console.log("а я спряталась");
          closeModal();
        };

        tg.BackButton.onClick(() => {
          closeModal();
          //   navigate("/settings");
          tg.BackButton.hide();
          console.log("BackButton скрыта на слоус модал");
        });

        tg.MainButton.onClick(handleMainButtonClick);

        return () => {
          tg.MainButton.offClick(handleMainButtonClick);
        };
      }
    }, [tg, closeModal]);

    const handlePageClick = (path) => {
      navigate(path); // Навигация на выбранную страницу
      closeModal(); // Закрываем модальное окно
    };

    return (
      <Modal
        className="Modal"
        header={<Modal.Header>Дополнительная информация</Modal.Header>}
        onClose={closeModal}
        open={isModalOpen}
      >
        <Section footer="Добавьте дополнительную информацию, чтобы видеть её в других анкетах, или осуществлять по ней поиск в фильтрах.">
          {pages.map((page, index) => (
            <Cell key={index} onClick={() => handlePageClick(page.path)}>
              {page.title}
            </Cell>
          ))}
        </Section>
      </Modal>
    );
  }
}
