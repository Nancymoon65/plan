import React, { useState } from 'react';
import { Seminar } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Laptop
} from 'lucide-react';

interface SeminarHeroProps {
  seminars: Seminar[];
  selectedSeminar: Seminar;
  onSelectSeminar: (seminar: Seminar) => void;
}

export const SeminarHero: React.FC<SeminarHeroProps> = ({
  seminars,
  selectedSeminar,
  onSelectSeminar,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'speaker'>('overview');

  const remainingSeats = Math.max(0, selectedSeminar.totalSeats - selectedSeminar.registeredSeats);
  const seatFillPercentage = Math.min(100, Math.round((selectedSeminar.registeredSeats / selectedSeminar.totalSeats) * 100));

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
      <div className="max-w-7xl mx-auto">
        {/* Top Seminar Selector Pill List */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              신청 가능한 클래스 & 세미나
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              원데이 클래스 & 세미나 참가 신청
            </h1>
          </div>

          {/* Quick Selector Dropdown / Pills */}
          <div className="flex flex-wrap gap-2">
            {seminars.map((sem) => {
              const isSelected = sem.id === selectedSeminar.id;
              return (
                <button
                  key={sem.id}
                  onClick={() => onSelectSeminar(sem)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/50'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">{sem.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Featured Seminar Showcase Card */}
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700/70 p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Column: Title & Key Details */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedSeminar.category}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  {selectedSeminar.badge}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedSeminar.fee}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
                  {selectedSeminar.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {selectedSeminar.subtitle}
                </p>
              </div>

              {/* Meta Info Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">일시</p>
                    <p className="text-sm font-semibold text-slate-100">{selectedSeminar.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">진행 시간</p>
                    <p className="text-sm font-semibold text-slate-100">{selectedSeminar.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 sm:col-span-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-medium">진행 장소</p>
                    <p className="text-sm font-semibold text-slate-100 truncate">{selectedSeminar.location}</p>
                  </div>
                  {selectedSeminar.isOnlineAvailable && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      <Laptop className="w-3 h-3" />
                      Zoom 송출
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-tabs: Overview, Agenda, Speaker */}
              <div className="pt-2">
                <div className="flex border-b border-slate-700/80">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                      activeTab === 'overview'
                        ? 'border-indigo-400 text-indigo-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    핵심 태그 & 특징
                  </button>
                  <button
                    onClick={() => setActiveTab('agenda')}
                    className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                      activeTab === 'agenda'
                        ? 'border-indigo-400 text-indigo-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    세부 커리큘럼 ({selectedSeminar.agenda.length}개 세션)
                  </button>
                  <button
                    onClick={() => setActiveTab('speaker')}
                    className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                      activeTab === 'speaker'
                        ? 'border-indigo-400 text-indigo-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    강사 소개
                  </button>
                </div>

                <div className="pt-4">
                  {activeTab === 'overview' && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeminar.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-indigo-200 border border-indigo-500/20 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {activeTab === 'agenda' && (
                    <div className="space-y-3">
                      {selectedSeminar.agenda.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-xs sm:text-sm"
                        >
                          <div className="flex items-center gap-2 font-semibold text-indigo-300">
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                              {item.time}
                            </span>
                            <span>{item.title}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400 pl-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'speaker' && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-base shadow shrink-0">
                        {selectedSeminar.speaker.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm sm:text-base">
                            {selectedSeminar.speaker.name}
                          </h4>
                          <span className="text-xs text-indigo-300 font-medium">
                            {selectedSeminar.speaker.role} · {selectedSeminar.speaker.company}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                          {selectedSeminar.speaker.bio}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Live Seat Availability & Registration CTA Box */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-xl p-5 border border-slate-700/80 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Users className="w-4 h-4 text-indigo-400" />
                    실시간 좌석 현황
                  </span>
                  <span className="text-rose-400 font-bold">
                    잔여 {remainingSeats}석 남음
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-rose-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${seatFillPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>신청 완료 {selectedSeminar.registeredSeats}명</span>
                  <span>정원 {selectedSeminar.totalSeats}명 ({seatFillPercentage}%)</span>
                </div>
              </div>

              {/* Gemini AI Auto Guide Callout */}
              <div className="p-3.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Gemini AI 맞춤 사전 가이드 제공
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  신청서에 작성하신 직무와 기대 목표를 Gemini AI가 분석하여, 세미나를 200% 활용할 수 있는 <b>개인 맞춤 사전 준비 팁</b>과 <b>추천 Q&A 질문</b>을 즉시 발급해 드립니다.
                </p>
              </div>

              {/* Instant Scroll to Form Anchor */}
              <a
                href="#registration-form"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all text-center"
              >
                지금 참가 신청하기
                <ChevronRight className="w-4 h-4" />
              </a>

              <p className="text-center text-[11px] text-slate-400">
                접수 즉시 구글 시트에 실시간 자동 기록됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
