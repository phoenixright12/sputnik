import React from "react";
import { Button, List } from "@telegram-apps/telegram-ui";
import "../assets/styles/CustomButton.css"; // Импорт файла стилей

const CustomButton = () => {
  return (
    <List style={{ position: "absolute", bottom: "35px", left: "16px", right: "16px"}}>
      <Button size="l" style={{ width: "97vw" }}>
        Продолжить
      </Button>
    </List>
  );
};

export default CustomButton;
