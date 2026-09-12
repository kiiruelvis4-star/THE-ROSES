import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  CheckCircle2, 
  RotateCcw, 
  User, 
  Sparkles,
  Smile
} from 'lucide-react';
import { Student } from '../../types';
import { storage } from '../../services/storageService';

interface LearnerPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onPhotoUpdated: (newAvatarUrl: string) => void;
}

// Preset school student avatars for immediate selection
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&fit=crop&crop=face',
];

export const LearnerPhotoUploadModal: React.FC<LearnerPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  student,
  onPhotoUpdated,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(student.avatar || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compress & resize image to 300x300 canvas for fast offline storage
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 320;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSelectedImage(e.target?.result as string);
          setIsProcessing(false);
          return;
        }

        // Calculate aspect ratio crop to center square
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSavePhoto = () => {
    if (!selectedImage) return;

    storage.updateStudentAvatar(student.id, selectedImage);
    setSuccessMessage('Profile photo updated successfully!');
    onPhotoUpdated(selectedImage);

    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-black font-heading">
                Update Learner Picture
              </h3>
              <p className="text-xs text-slate-300">
                {student.name} • {student.grade}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-rose-500/30 overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-transform active:scale-90"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Tap camera to upload a photo of {student.name}
            </p>
          </div>

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Action Upload Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-500 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>{isProcessing ? 'Processing...' : 'Upload File'}</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-rose-500 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4 text-rose-600" />
              <span>Take Photo</span>
            </button>
          </div>

          {/* Preset Sample Avatars */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Smile className="w-3.5 h-3.5" />
              <span>Or Choose Sample Avatar</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((presetUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(presetUrl)}
                  className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                    selectedImage === presetUrl
                      ? 'border-rose-600 ring-2 ring-rose-500/40'
                      : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={presetUrl}
                    alt={`Avatar ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Save & Cancel */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePhoto}
              className="flex-1 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-950/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Save Picture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
