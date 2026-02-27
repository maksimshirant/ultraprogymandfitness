import { useEffect } from 'react';
import { X } from 'lucide-react';
import { BalancedHeading } from '@/components/typography/BalancedHeading';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VIDEO_MODAL_ASSETS = {
  src: 'https://vk.com/video_ext.php?oid=-174979815&id=456239183&hd=2&autoplay=1',
} as const;

const VIDEO_MODAL_TEXT = {
  frameTitle: 'Ultra Pro VK Clip',
  heading: 'Ultra Pro',
  description: 'Видео о клубе',
} as const;

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[460px] mx-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-gray-300 lg:hover:text-white transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-[9/16] w-full max-h-[70vh] max-h-[70dvh]">
          <iframe
            src={VIDEO_MODAL_ASSETS.src}
            title={VIDEO_MODAL_TEXT.frameTitle}
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="mt-4 text-center">
          <BalancedHeading as="h3" className="text-white text-xl font-semibold">
            {VIDEO_MODAL_TEXT.heading}
          </BalancedHeading>
          <p className="text-gray-400 mt-2">
            {VIDEO_MODAL_TEXT.description}
          </p>
        </div>
      </div>
    </div>
  );
}
