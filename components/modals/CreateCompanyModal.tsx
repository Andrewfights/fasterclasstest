import React, { useState } from 'react';
import { X, Rocket, Building2, ShoppingBag, CreditCard, Heart, Sparkles } from 'lucide-react';
import { IndustryType } from '../../types';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCompany: (name: string, description: string, industry: IndustryType) => void;
}

const INDUSTRIES: { value: IndustryType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'saas', label: 'SaaS', icon: <Building2 className="w-5 h-5" />, description: 'Software as a Service' },
  { value: 'consumer', label: 'Consumer', icon: <ShoppingBag className="w-5 h-5" />, description: 'Consumer products & apps' },
  { value: 'marketplace', label: 'Marketplace', icon: <Sparkles className="w-5 h-5" />, description: 'Two-sided platforms' },
  { value: 'fintech', label: 'Fintech', icon: <CreditCard className="w-5 h-5" />, description: 'Financial technology' },
  { value: 'healthtech', label: 'Healthtech', icon: <Heart className="w-5 h-5" />, description: 'Healthcare & wellness' },
  { value: 'other', label: 'Other', icon: <Rocket className="w-5 h-5" />, description: 'Something unique' },
];

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  isOpen,
  onClose,
  onCreateCompany,
}) => {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState<IndustryType | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!companyName.trim()) {
        setError('Please enter a company name');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!description.trim()) {
        setError('Please add a one-liner for your startup');
        return;
      }
      setError('');
      setStep(3);
    } else if (step === 3) {
      if (!industry) {
        setError('Please select an industry');
        return;
      }
      setError('');
      onCreateCompany(companyName.trim(), description.trim(), industry);
      // Reset form
      setStep(1);
      setCompanyName('');
      setDescription('');
      setIndustry(null);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-[#13131A] rounded-2xl border border-[#2E2E3E] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#2E2E3E]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-[#6B7280] hover:text-white hover:bg-[#2E2E3E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a227] to-[#8B5CF6] flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Start Your Journey</h2>
              <p className="text-sm text-[#9CA3AF]">Create your virtual startup</p>
            </div>
          </div>
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-[#c9a227]' : 'bg-[#2E2E3E]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  What's your startup called?
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Acme Inc, TechFlow, FoodieApp"
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-sm text-[#6B7280]">
                Don't worry, you can change this later. Pick something that inspires you!
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Describe your startup in one line
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., AI-powered fitness coaching for busy professionals"
                  className="w-full px-4 py-3 bg-[#1E1E2E] border border-[#2E2E3E] rounded-xl text-white placeholder-[#6B7280] focus:outline-none focus:border-[#c9a227] transition-colors"
                  autoFocus
                />
              </div>
              <p className="text-sm text-[#6B7280]">
                This is your elevator pitch. What problem are you solving?
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                What industry are you in?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    onClick={() => setIndustry(ind.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      industry === ind.value
                        ? 'bg-[#c9a227]/20 border-[#c9a227] ring-1 ring-[#c9a227]'
                        : 'bg-[#1E1E2E] border-[#2E2E3E] hover:border-[#3E3E4E]'
                    }`}
                  >
                    <div className={`mb-2 ${industry === ind.value ? 'text-[#c9a227]' : 'text-[#9CA3AF]'}`}>
                      {ind.icon}
                    </div>
                    <div className="font-medium text-white">{ind.label}</div>
                    <div className="text-xs text-[#6B7280]">{ind.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              step === 1
                ? 'text-[#6B7280] cursor-not-allowed'
                : 'text-white hover:bg-[#2E2E3E]'
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-[#c9a227] to-[#d4af37] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {step === 3 ? (
              <>
                <Rocket className="w-4 h-4" />
                Launch Startup
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCompanyModal;
