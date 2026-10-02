import React, { useState } from 'react';
import { Seminar, RegistrationFormData } from '../types';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  HelpCircle, 
  Sparkles, 
  Send, 
  Check, 
  AlertCircle,
  Users
} from 'lucide-react';

interface RegistrationFormProps {
  selectedSeminar: Seminar;
  onSubmit: (formData: RegistrationFormData) => void;
  isSubmitting: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedSeminar,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    seminarId: selectedSeminar.id,
    seminarTitle: selectedSeminar.title,
    name: '',
    department: '',
    email: '',
    phone: '',
    experienceLevel: '입문 (처음 접함 / 경험 적음)',
    goals: '',
    questions: '',
    companionCount: 0,
    agreePrivacy: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync seminarId if selectedSeminar changes
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      seminarId: selectedSeminar.id,
      seminarTitle: selectedSeminar.title,
    }));
  }, [selectedSeminar]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '참가자 성함을 입력해주세요.';
    }
    if (!formData.department.trim()) {
      newErrors.department = '소속 부서 및 담당 직무를 입력해주세요.';
    }
    if (!formData.email.trim()) {
      newErrors.email = '안내 메일을 수신할 이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처(휴대폰 번호)를 입력해주세요.';
    }
    if (!formData.goals.trim()) {
      newErrors.goals = '이번 클래스에서 달성하고 싶은 목표를 적어주세요. Gemini AI 맞춤 가이드에 반영됩니다.';
    }
    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 수집 및 참가 안내 수신에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const experienceOptions: RegistrationFormData['experienceLevel'][] = [
    '입문 (처음 접함 / 경험 적음)',
    '초급 (기본 툴 사용 경험 있음)',
    '중급 (실무에서 일부 활용 중)',
    '심화 (고급 기능 및 전사 도입 고민 중)',
  ];

  return (
    <section id="registration-form" className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            간편 신청서 접수 & 실시간 AI 맞춤 안내
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            참가 신청서 작성
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            신청 선택: <span className="font-semibold text-indigo-300">{selectedSeminar.title}</span>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
              기본 참가자 정보
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  성함 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                      errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } outline-none transition-all`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Department / Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  소속 부서 / 직무 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="예: 마케팅팀 / 그로스 기획자"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                      errors.department ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } outline-none transition-all`}
                  />
                </div>
                {errors.department && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.department}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  이메일 주소 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@company.com"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } outline-none transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  휴대전화 번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-1234-5678"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    } outline-none transition-all`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Experience & Expectations (Gemini AI input) */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
              경험 수준 및 기대 목표 (Gemini AI 맞춤 안내 반영)
            </h4>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                현재 관련 지식 및 툴 경험 수준
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {experienceOptions.map((level) => {
                  const isSelected = formData.experienceLevel === level;
                  return (
                    <label
                      key={level}
                      onClick={() => setFormData({ ...formData, experienceLevel: level })}
                      className={`cursor-pointer p-3 rounded-lg border text-xs font-medium transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{level}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Expected Goals */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>이번 클래스에서 가장 얻어가고 싶은 기대 목표 <span className="text-rose-500">*</span></span>
                <span className="text-[11px] text-indigo-600 font-normal">✨ Gemini AI가 맞춤 팁을 분석합니다</span>
              </label>
              <textarea
                rows={2}
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="예: 반복적인 주간 보고서 정리에 드는 시간을 반으로 줄이고, 기획안 초안을 빠르게 작성하는 프롬프트 요령을 배우고 싶습니다."
                className={`w-full p-3 text-sm rounded-lg border ${
                  errors.goals ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                } outline-none transition-all resize-none`}
              />
              {errors.goals && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.goals}
                </p>
              )}
            </div>

            {/* Pre-seminar Questions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>강사님께 사전 질문하고 싶은 점 (선택)</span>
                <span className="text-[11px] text-slate-400 font-normal">현장 Q&A 우선 배정</span>
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  placeholder="예: 우리 팀에는 개발자가 없는데, 현업 기획자 혼자서도 유지보수가 가능할까요?"
                  className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Companion Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                동반 참석 인원 (본인 외)
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-36">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.companionCount}
                    onChange={(e) => setFormData({ ...formData, companionCount: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white font-medium"
                  >
                    <option value={0}>본인만 참석 (0명)</option>
                    <option value={1}>동반 1명 (+1명)</option>
                    <option value={2}>동반 2명 (+2명)</option>
                    <option value={3}>동반 3명 (+3명)</option>
                  </select>
                </div>
                <p className="text-xs text-slate-500">
                  {formData.companionCount > 0 ? `총 ${formData.companionCount + 1}명이 함께 참석 예약됩니다.` : '단독 참석'}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Agreement */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreePrivacy}
                onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">[필수]</span> 세미나 참가 신청 정보 접수, 구글 스프레드시트 기록 및 Gemini AI 맞춤 안내서 발행을 위한 개인정보 수집·이용에 동의합니다.
              </span>
            </label>
            {errors.agreePrivacy && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 pl-6">
                <AlertCircle className="w-3 h-3" /> {errors.agreePrivacy}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-xl text-base font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>신청서 처리 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>참가 신청하고 Gemini 맞춤 가이드 받기</span>
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              신청 완료 즉시 디지털 티켓 발급 및 구글 시트에 실시간 저장됩니다.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
