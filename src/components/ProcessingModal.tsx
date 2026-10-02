import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Database, FileText, Ticket } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onFinish?: () => void;
  applicantName: string;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  applicantName,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    const t1 = setTimeout(() => setCurrentStep(2), 600);
    const t2 = setTimeout(() => setCurrentStep(3), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '신청 정보 검증',
      desc: `${applicantName || '참가자'} 님의 등록 정보를 확인하고 있습니다.`,
      icon: FileText,
    },
    {
      step: 2,
      title: '구글 스프레드시트 기록',
      desc: '참가자 데이터베이스(Google Sheets)에 동기화 중입니다.',
      icon: Database,
    },
    {
      step: 3,
      title: 'Gemini AI 맞춤 가이드 생성',
      desc: '신청자의 직무와 목표를 분석하여 사전 준비 팁과 질문을 작성 중입니다.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Central Pulse Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5 relative">
          <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-600 rounded-full animate-ping" />
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          참가 신청서 처리 중...
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
          잠시만 기다려주세요. 개인 맞춤 안내서를 생성하고 있습니다.
        </p>

        {/* Steps List */}
        <div className="space-y-3.5 text-left mb-6">
          {steps.map((item) => {
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            const ItemIcon = item.icon;

            return (
              <div
                key={item.step}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : isCurrent
                    ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                    : 'bg-slate-50 border-slate-100 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  ) : (
                    <ItemIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isDone
                        ? 'text-emerald-900'
                        : isCurrent
                        ? 'text-indigo-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom reassurance */}
        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <Ticket className="w-3.5 h-3.5 text-indigo-500" />
          처리가 완료되면 즉시 모바일 티켓과 맞춤 안내서가 표시됩니다.
        </div>
      </div>
    </div>
  );
};
