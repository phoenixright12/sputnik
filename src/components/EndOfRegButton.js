import React from "react";
import { Button, List } from "@telegram-apps/telegram-ui";

const EndOfRegButton = () => {
  return (
    <List style={{ position: "absolute", bottom: "35px", left: "16px", right: "16px"}}>
      <Button size="l" style={{ width: "97vw" }}>
        Завершение регистрации
      </Button>
    </List>
  );
};

export default EndOfRegButton;
