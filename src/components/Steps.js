import React from 'react';
import { Steps } from '@telegram-apps/telegram-ui';

const StepsPanel = ({ progress }) => {
  return (
    <Steps
      count={4} // Количество шагов
      progress={progress} // Текущий шаг
    />
  );
};

export default StepsPanel;
