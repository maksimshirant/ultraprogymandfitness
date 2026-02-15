import { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VIDEO_MODAL_ASSETS = {
  src: 'ссылка на видео',
} as const;

const VIDEO_MODAL_TEXT = {
  frameTitle: 'UltraPro Welcome',
  heading: 'Добро пожаловать в UltraPro',
  description: '',
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          <iframe
            src={VIDEO_MODAL_ASSETS.src}
            title={VIDEO_MODAL_TEXT.frameTitle}
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-white text-xl font-semibold">
            {VIDEO_MODAL_TEXT.heading}
          </h3>
          <p className="text-gray-400 mt-2">
            {VIDEO_MODAL_TEXT.description}
          </p>
        </div>
      </div>
    </div>
  );
}
