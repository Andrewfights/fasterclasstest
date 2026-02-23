import React from 'react';
import { Award, Trophy, Star } from 'lucide-react';

interface CertificatesSectionProps {
  onGetStarted?: () => void;
}

const CERTIFICATES = [
  {
    title: 'Fundraising Fundamentals',
    icon: '💰',
    color: '#10B981',
    lessons: 8,
  },
  {
    title: 'Product-Market Fit',
    icon: '🎯',
    color: '#8B5CF6',
    lessons: 6,
  },
  {
    title: 'Growth & Scaling',
    icon: '📈',
    color: '#3B82F6',
    lessons: 10,
  },
];

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  onGetStarted,
}) => {
  return (
    <section className="py-20 px-6 md:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#141414]">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#c9a227]/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#c9a227]" />
            </div>
            <div>
              <span className="mc-label text-[#c9a227]">Achievement System</span>
              <h2 className="mc-heading text-2xl md:text-3xl text-white">
                Earn Certificates
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#a3a3a3] text-lg mb-8 max-w-2xl">
            Complete courses and earn certificates to showcase your startup knowledge.
            Track your progress, unlock achievements, and level up your founder skills.
          </p>

          {/* Certificate Previews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {CERTIFICATES.map((cert, index) => (
              <div
                key={index}
                className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-colors"
              >
                {/* Certificate Frame */}
                <div
                  className="aspect-[4/3] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: `${cert.color}15` }}
                >
                  {/* Decorative Border */}
                  <div
                    className="absolute inset-2 border-2 rounded-md opacity-30"
                    style={{ borderColor: cert.color }}
                  />
                  {/* Icon */}
                  <span className="text-4xl">{cert.icon}</span>
                  {/* Certificate Badge */}
                  <div
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: cert.color }}
                  >
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Certificate Title */}
                <h3 className="font-semibold text-white text-sm mb-1">
                  {cert.title}
                </h3>
                <p className="text-[#737373] text-xs">
                  {cert.lessons} lessons to complete
                </p>
              </div>
            ))}
          </div>

          {/* Achievement Stats */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#c9a227]" />
              <span className="text-white">Earn XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#c9a227]" />
              <span className="text-white">Unlock Achievements</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#c9a227]" />
              <span className="text-white">Share Certificates</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-[#c9a227] text-black font-semibold rounded-md hover:bg-[#d4af37] transition-colors"
          >
            Start Earning
          </button>
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
