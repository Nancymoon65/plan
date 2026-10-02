import React from 'react';
import { Sparkles, Table2, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenSheetModal: () => void;
  onOpenGuideModal: () => void;
  registeredCount: number;
  hasGeminiKey: boolean;
  hasSheetWebhook: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSheetModal,
  onOpenGuideModal,
  registeredCount,
  hasGeminiKey,
  hasSheetWebhook,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  SeminarPass <span className="text-indigo-600">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  사내 세미나 & 원데이 클래스
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                스마트 참가 신청 & Google Sheets 실시간 연동 & Gemini 맞춤 가이드
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Status Pills (Subtle & informative) */}
            <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-400'}`} />
                Gemini AI 맞춤 가이드
              </span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                <span className={`w-2 h-2 rounded-full ${hasSheetWebhook ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                구글 시트 연동
              </span>
            </div>

            {/* View Sheet DB Button */}
            <button
              onClick={onOpenSheetModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
              title="구글 스프레드시트 연동 내역 보기"
            >
              <Table2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">신청 내역 (시트 DB)</span>
              <span className="sm:hidden">시트 DB</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                {registeredCount}
              </span>
            </button>

            {/* Beginner Deployment Guide Button */}
            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-600/20 transition-all"
              title="Vercel 배포 및 구글 시트 연동 초보자 가이드"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Vercel & 구글 시트 연동 가이드</span>
              <span className="sm:hidden">연동 가이드</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
