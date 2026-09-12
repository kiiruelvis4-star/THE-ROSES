import React, { useState } from 'react';
import { 
  X, 
  Save, 
  User, 
  Phone, 
  Home, 
  HeartPulse, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  Camera
} from 'lucide-react';
import { Student } from '../../types';
import { storage } from '../../services/storageService';

interface LearnerEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onSuccess: (updatedStudent: Student) => void;
  isParentRole?: boolean;
}

export const LearnerEditProfileModal: React.FC<LearnerEditProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
  isParentRole = true
}) => {
  const [parentName, setParentName] = useState(student.parentName || '');
  const [parentPhone, setParentPhone] = useState(student.parentPhone || '');
  const [parentEmail, setParentEmail] = useState(student.parentEmail || '');
  const [emergencyContact, setEmergencyContact] = useState(student.emergencyContact || '');
  const [homeAddress, setHomeAddress] = useState(student.homeAddress || '');
  const [medicalNotes, setMedicalNotes] = useState(student.medicalNotes || '');
  const [hobbiesAndTalents, setHobbiesAndTalents] = useState(student.hobbiesAndTalents || '');
  const [learnerPassword, setLearnerPassword] = useState(student.password || '');
  const [dob, setDob] = useState(student.dob || '');
  const [avatar, setAvatar] = useState(student.avatar || student.avatarUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Student = {
      ...student,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      emergencyContact: emergencyContact.trim() || parentPhone.trim(),
      homeAddress: homeAddress.trim(),
      medicalNotes: medicalNotes.trim(),
      hobbiesAndTalents: hobbiesAndTalents.trim(),
      password: learnerPassword.trim() || student.password,
      dob: dob.trim(),
      avatar: avatar.trim() || student.avatar
    };

    storage.saveStudent(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onSuccess(updated);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 rounded-full p-0.5 bg-white/20 overflow-hidden shrink-0">
                <img
                  src={avatar || student.avatar || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150'}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <label 
                className="absolute -bottom-1 -right-1 p-1 bg-white text-rose-800 rounded-full shadow-md cursor-pointer hover:bg-rose-50"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setAvatar(ev.target.result as string);
                        }
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-black font-heading tracking-tight flex items-center gap-2">
                Edit Learner Details
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/20 text-rose-100 border border-white/20">
                  {isParentRole ? 'Parent Portal' : 'Faculty Access'}
                </span>
              </h2>
              <p className="text-xs text-rose-200">
                {student.name} • Adm: <strong className="font-mono">{student.admissionNumber}</strong> ({student.grade})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Learner details updated and saved successfully!</span>
            </div>
          )}

          {/* Section 1: Parent & Guardian Contacts */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              Parent & Guardian Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent / Guardian Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Sarah Wanjiku Mwangi"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="e.g. 0712 345678"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Phone Contact
                </label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. 0722 987654 (Relative / Guardian)"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Residential Address & Learner Bio */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-rose-600" />
              Home Location & Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Home Estate / Residential Address
                </label>
                <input
                  type="text"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="e.g. Section 58 / Milimani, Nakuru"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Health & Accommodations */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              Health & Medical Care
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medical Notes / Health Considerations
                </label>
                <textarea
                  rows={2}
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="List any medical notes, inhaler requirements, or physical accommodations..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Learner Portal Real Password
                </label>
                <input
                  type="text"
                  value={learnerPassword}
                  onChange={(e) => setLearnerPassword(e.target.value)}
                  placeholder={`e.g. LRA@${student.admissionNumber.replace(/[^0-9]/g, '') || '2026'}`}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Custom real password for your learner to log into the private portal.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Hobbies & Talents */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              Learner Hobbies, Talents & Aspirations
            </h3>
            <div>
              <input
                type="text"
                value={hobbiesAndTalents}
                onChange={(e) => setHobbiesAndTalents(e.target.value)}
                placeholder="e.g. Football, Art & Drawing, Music Piano, Coding, Debating Club"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-600 outline-hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-950/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Learner Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
