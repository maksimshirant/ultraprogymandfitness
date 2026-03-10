import { useEffect, useState } from 'react';
import Modal from './Modal';

const SHOW_ANNOUNCEMENT = true;
const ANNOUNCEMENT_DELAY_MS = 1000;
const ANNOUNCEMENT_CONTENT = {
  label: 'Объявление',
  title: 'Уважаемые клиенты',
  message: [
    'По техническим причинам 11 марта горячей воды не будет с 8:00 до 14:00. Приносим свои извинения за предоставленные неудобства.',
    'С уважением, администрация Ultra Pro Gym & Fitness',
  ],
  closeButtonLabel: 'Закрыть',
} as const;

interface AnnouncementProps {
  isBlocked?: boolean;
}

export default function Announcement({ isBlocked = false }: AnnouncementProps) {
  const [canShowAnnouncement, setCanShowAnnouncement] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!SHOW_ANNOUNCEMENT) {
      return;
    }

    let timeoutId: number | null = null;

    const scheduleAnnouncement = () => {
      timeoutId = window.setTimeout(() => {
        setCanShowAnnouncement(true);
      }, ANNOUNCEMENT_DELAY_MS);
    };

    if (document.readyState === 'complete') {
      scheduleAnnouncement();
    } else {
      window.addEventListener('load', scheduleAnnouncement, { once: true });
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener('load', scheduleAnnouncement);
    };
  }, []);

  const isOpen = SHOW_ANNOUNCEMENT && canShowAnnouncement && !isDismissed && !isBlocked;

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsDismissed(true)}
      announcement={ANNOUNCEMENT_CONTENT}
    />
  );
}
