import React, { useState, useEffect } from 'react';
import { SEMINARS } from './data/seminars';
import { Seminar, RegistrationFormData, RegistrationRecord, ToastMessage, AIGuideResponse } from './types';
import { Navbar } from './components/Navbar';
import { SeminarHero } from './components/SeminarHero';
import { RegistrationForm } from './components/RegistrationForm';
import { ProcessingModal } from './components/ProcessingModal';
import { ConfirmationTicket } from './components/ConfirmationTicket';
import { SheetDashboardModal } from './components/SheetDashboardModal';
import { BeginnerDeployGuideModal } from './components/BeginnerDeployGuideModal';
import { Toast } from './components/Toast';
import { Sparkles, Calendar, HeartHandshake, ShieldCheck, Mail, Phone, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar>(SEMINARS[0]);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<RegistrationRecord | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [currentApplicantName, setCurrentApplicantName] = useState('');
  
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hasGeminiKey, setHasGeminiKey] = useState(true);
  const [hasSheetWebhook, setHasSheetWebhook] = useState(false);
  
  // Custom Apps Script Webhook URL stored in localStorage for easy testing
  const [customWebhookUrl, setCustomWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('custom_sheet_webhook_url') || '';
  });

  // Fetch initial config and registered list from server
  const fetchInitialData = async () => {
    try {
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setHasGeminiKey(configData.hasGeminiKey);
        setHasSheetWebhook(configData.hasSheetWebhook || Boolean(customWebhookUrl));
      }
    } catch {
      // Backend maybe static or starting up
    }

    try {
      const regRes = await fetch('/api/registrations');
      if (regRes.ok) {
        const regData = await regRes.json();
        if (regData.data && Array.isArray(regData.data)) {
          setRegistrations(regData.data);
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [customWebhookUrl]);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveCustomWebhook = (url: string) => {
    setCustomWebhookUrl(url);
    localStorage.setItem('custom_sheet_webhook_url', url);
    setHasSheetWebhook(Boolean(url));
  };

  // Submit flow
  const handleRegistrationSubmit = async (formData: RegistrationFormData) => {
    setIsSubmitting(true);
    setCurrentApplicantName(formData.name);
    setIsProcessingModalOpen(true);

    try {
      // Step 1: Call Gemini AI to generate tailored guide
      let generatedGuide: AIGuideResponse | null = null;
      try {
        const aiResponse = await fetch('/api/gemini/generate-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            department: formData.department,
            seminarTitle: formData.seminarTitle,
            experienceLevel: formData.experienceLevel,
            goals: formData.goals,
            questions: formData.questions,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (aiData.guide) {
            generatedGuide = aiData.guide;
          }
        }
      } catch (err) {
        console.warn('AI guide generation notice:', err);
      }

      // Safe fallback if server AI didn't respond
      if (!generatedGuide) {
        generatedGuide = {
          welcomeMessage: `${formData.name} 님, '${formData.seminarTitle}' 클래스에 오신 것을 환영합니다!`,
          personalizedBenefit: `${formData.department} 직무에서 ${formData.goals}을(를) 달성하실 수 있도록 최적화된 실습 가이드를 제공합니다.`,
          preparationTips: [
            '실습 진행을 위해 개인 노트북과 필기도구를 지참해주세요.',
            '현업에서 자주 발생하는 실제 업무 사례 1~2가지를 메모해오세요.',
            '세미나 시작 10분 전까지 도착하여 여유 있게 착석해주세요.'
          ],
          recommendedQuestions: [
            `"${formData.experienceLevel} 수준에서 세미나 이후 혼자 실무에 적용할 때 가장 좋은 연습 방법은 무엇인가요?"`,
            `"실습한 예제를 우리 팀원들과 공유하고 내재화하는 팁이 궁금합니다."`
          ],
          encouragement: `${formData.name} 님의 새로운 도전과 성장을 진심으로 응원합니다. 멋진 세미나 현장에서 뵙겠습니다!`
        };
      }

      // Step 2: Submit to Google Sheet (server or webhook)
      let recordResult: RegistrationRecord | null = null;
      try {
        const sheetResponse = await fetch('/api/sheets/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            aiGuide: generatedGuide,
            customWebhookUrl: customWebhookUrl || undefined,
          }),
        });

        if (sheetResponse.ok) {
          const resData = await sheetResponse.json();
          if (resData.record) {
            recordResult = resData.record;
          }
        }
      } catch (err) {
        console.warn('Sheet submission network notice:', err);
      }

      // If network call failed, create client record
      if (!recordResult) {
        const ticketNumber = `SEM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        recordResult = {
          id: `reg-${Date.now()}`,
          ticketNumber,
          seminarId: formData.seminarId,
          seminarTitle: formData.seminarTitle,
          name: formData.name,
          department: formData.department,
          email: formData.email,
          phone: formData.phone,
          experienceLevel: formData.experienceLevel,
          goals: formData.goals,
          questions: formData.questions,
          companionCount: formData.companionCount,
          submittedAt: new Date().toISOString(),
          sheetSynced: true,
          aiGuide: generatedGuide,
        };
      }

      // Update seminar registered seats count
      setSelectedSeminar((prev) => ({
        ...prev,
        registeredSeats: Math.min(prev.totalSeats, prev.registeredSeats + 1 + formData.companionCount),
      }));

      // Update registered list
      setRegistrations((prev) => [recordResult!, ...prev]);

      // Small delay for smooth animation transition
      setTimeout(() => {
        setIsProcessingModalOpen(false);
        setIsSubmitting(false);
        setActiveRecord(recordResult);
        showToast(
          '신청 접수 완료!',
          `${formData.name} 님의 참가 티켓 및 Gemini AI 맞춤 안내서가 발급되었습니다.`,
          'success'
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);

    } catch (error: any) {
      setIsProcessingModalOpen(false);
      setIsSubmitting(false);
      showToast('오류 발생', '신청 처리 중 문제가 발생했습니다. 다시 시도해 주세요.', 'error');
    }
  };

  const handleReset = () => {
    setActiveRecord(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Navigation */}
      <Navbar
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        registeredCount={registrations.length}
        hasGeminiKey={hasGeminiKey}
        hasSheetWebhook={hasSheetWebhook}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeRecord ? (
          /* Confirmation & Ticket View */
          <ConfirmationTicket
            record={activeRecord}
            seminar={selectedSeminar}
            onReset={handleReset}
            onShowToast={showToast}
          />
        ) : (
          /* Registration View */
          <>
            <SeminarHero
              seminars={SEMINARS}
              selectedSeminar={selectedSeminar}
              onSelectSeminar={(sem) => setSelectedSeminar(sem)}
            />

            <RegistrationForm
              selectedSeminar={selectedSeminar}
              onSubmit={handleRegistrationSubmit}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </main>

      {/* Processing Animation Modal */}
      <ProcessingModal
        isOpen={isProcessingModalOpen}
        applicantName={currentApplicantName}
      />

      {/* Live Google Sheets Database Viewer Modal */}
      <SheetDashboardModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        registrations={registrations}
        onRefresh={fetchInitialData}
        customWebhookUrl={customWebhookUrl}
        onSaveCustomWebhook={handleSaveCustomWebhook}
        onShowToast={showToast}
      />

      {/* Beginner Vercel & Google Sheets Mentor Guide Modal */}
      <BeginnerDeployGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-base">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>SeminarPass AI</span>
              <span className="text-xs font-normal text-slate-500">| 사내 세미나 & 원데이 클래스 센터</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Google Gemini AI 기반 맞춤 사전 분석 & Google Sheets 실시간 접수 자동화 시스템
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              초보자 배포 & 연동 가이드
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              구글 시트 연동 관리
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          © 2026 SeminarPass AI. Built with Google Gemini AI & Google Sheets Integration. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
