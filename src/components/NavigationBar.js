import React, { useState } from 'react';
import { Tabbar} from '@telegram-apps/telegram-ui'; // Если используется vkui
import { useNavigate } from 'react-router-dom';
import chat from '../assets/images/chat_24.svg';
import heart from '../assets/images/heart_28.svg';
import settings from '../assets/images/settings.svg';

const NavigationBar = () => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', text: 'Home', src: chat, path: '/' },
    { id: 'profile', text: 'Profile', src: heart, path: '/search' },
    { id: 'settings', text: 'Settings', src: settings, path: '/settings' },
  ];

  const [currentTab, setCurrentTab] = useState(tabs[0].id);

  return (
    <div style={{ height: 100 }}>
      <Tabbar>
        {tabs.map(({ id, text, src, path  }) => (
          <Tabbar.Item
            key={id}
            text={text}
            selected={id === currentTab}
            onClick={() => navigate(path)}
          >
          <img alt="img"  src={src}
          />
          </Tabbar.Item>
        ))}
      </Tabbar>
    </div>
  );
};

export default NavigationBar;
