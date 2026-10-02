import React, { useState } from 'react';
import { RegistrationRecord, Seminar } from '../types';
import { 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Printer, 
  ArrowLeft, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building2, 
  HelpCircle, 
  Lightbulb, 
  Share2, 
  Check,
  ShieldCheck
} from 'lucide-react';

interface ConfirmationTicketProps {
  record: RegistrationRecord;
  seminar: Seminar;
  onReset: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const ConfirmationTicket: React.FC<ConfirmationTicketProps> = ({
  record,
  seminar,
  onReset,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyGuide = () => {
    const text = `[SeminarPass AI 참가 확정 안내서]
- 참가 번호: ${record.ticketNumber}
- 세미나명: ${record.seminarTitle}
- 참가자: ${record.name} (${record.department})
- 일시: ${seminar.date} ${seminar.time}
- 장소: ${seminar.location}

[Gemini AI 맞춤 웰컴 메시지]
${record.aiGuide.welcomeMessage}

[맞춤 기대 효과]
${record.aiGuide.personalizedBenefit}

[사전 준비 추천 꿀팁]
${record.aiGuide.preparationTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

[현장 강사 추천 질문]
${record.aiGuide.recommendedQuestions.map((q, i) => `Q${i + 1}. ${q}`).join('\n')}

[응원 메시지]
${record.aiGuide.encouragement}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('클립보드 복사 완료', '참가 티켓 및 맞춤 가이드 내용이 복사되었습니다.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in print:p-0">
      {/* Top Congratulatory Header */}
      <div className="text-center mb-8 print:hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-sm ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          참가 신청이 성공적으로 완료되었습니다!
        </h2>
        <p className="mt-1 text-sm text-slate-600 max-w-xl mx-auto">
          구글 스프레드시트에 등록되었으며, Gemini AI가 {record.name} 님만을 위한 맞춤 사전 가이드를 완성했습니다.
        </p>
      </div>

      {/* Main Ticket & Guide Container */}
      <div className="space-y-6">
        {/* Ticket Header & Pass Card */}
        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-xl overflow-hidden print:shadow-none print:border">
          {/* Top Notch Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-400/30">
                  공식 참가 패스 (Official Admission Ticket)
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                  {record.seminarTitle}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">참가 번호</p>
                <p className="text-base sm:text-lg font-mono font-bold text-indigo-300">
                  {record.ticketNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Body & QR Area */}
          <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-dashed border-slate-200 bg-slate-50/50">
            {/* Left 2 Cols: Attendee & Event Details */}
            <div className="md:col-span-2 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">참가자</span>
                    <span className="font-bold text-slate-900">{record.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">소속 / 직무</span>
                    <span className="font-semibold text-slate-900 truncate block">{record.department}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">일시</span>
                  <span className="font-semibold text-slate-900">{seminar.date} ({seminar.time})</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">장소</span>
                  <span className="font-semibold text-slate-900">{seminar.location}</span>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Simulated QR Code & Sync Badge */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 mb-2">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <span className="text-[11px] font-mono font-medium text-slate-500">
                {record.ticketNumber}
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                구글 시트 등록 확인
              </span>
            </div>
          </div>

          {/* Gemini AI Personalized Guide Section */}
          <div className="p-6 sm:p-8 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Gemini AI 맞춤 사전 안내서
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                개인화 분석 완료
              </span>
            </div>

            {/* Welcome & Personalized Benefit */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <p className="text-sm font-bold text-indigo-950">
                {record.aiGuide.welcomeMessage}
              </p>
              <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
                {record.aiGuide.personalizedBenefit}
              </p>
            </div>

            {/* 3 Preparation Tips */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                세미나 전 200% 활용을 위한 맞춤 사전 준비 팁
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {record.aiGuide.preparationTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] mb-1">
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-slate-800 leading-snug">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended In-depth Questions */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                세미나 현장에서 강사님께 질문하면 좋은 추천 질문
              </h5>
              <div className="space-y-2">
                {record.aiGuide.recommendedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px] shrink-0 mt-0.5">
                      질문 {idx + 1}
                    </span>
                    <p className="leading-relaxed">"{q}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement Quote */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white text-center">
              <p className="text-xs sm:text-sm font-semibold text-indigo-200 italic">
                "{record.aiGuide.encouragement}"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Copy, Print, New Registration) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            새로운 참가 신청하기
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGuide}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>안내서 텍스트 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>티켓 & 안내서 인쇄 / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
