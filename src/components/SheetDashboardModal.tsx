import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { 
  X, 
  Table2, 
  Download, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Link, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface SheetDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: RegistrationRecord[];
  onRefresh: () => void;
  customWebhookUrl: string;
  onSaveCustomWebhook: (url: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const SheetDashboardModal: React.FC<SheetDashboardModalProps> = ({
  isOpen,
  onClose,
  registrations,
  onRefresh,
  customWebhookUrl,
  onSaveCustomWebhook,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempWebhookUrl, setTempWebhookUrl] = useState(customWebhookUrl);

  if (!isOpen) return null;

  const filtered = registrations.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.ticketNumber.toLowerCase().includes(q) ||
      r.seminarTitle.toLowerCase().includes(q)
    );
  });

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomWebhook(tempWebhookUrl.trim());
    onShowToast('웹훅 설정 저장', '구글 시트 웹훅 URL이 업데이트되었습니다.', 'success');
  };

  const exportCSV = () => {
    if (registrations.length === 0) {
      onShowToast('다운로드 불가', '내보낼 데이터가 없습니다.', 'info');
      return;
    }

    const headers = [
      '참가번호',
      '신청일시',
      '세미나명',
      '성함',
      '소속/직무',
      '이메일',
      '연락처',
      '경험수준',
      '기대목표',
      '사전질문',
      '동반인원',
      'AI가이드요약',
    ];

    const rows = registrations.map((r) => [
      `"${r.ticketNumber}"`,
      `"${new Date(r.submittedAt).toLocaleString('ko-KR')}"`,
      `"${r.seminarTitle.replace(/"/g, '""')}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.experienceLevel}"`,
      `"${r.goals.replace(/"/g, '""')}"`,
      `"${(r.questions || '').replace(/"/g, '""')}"`,
      `"${r.companionCount}"`,
      `"${(r.aiGuide?.personalizedBenefit || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `세미나_신청명단_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('CSV 다운로드 완료', '신청 명단 파일이 저장되었습니다.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  구글 스프레드시트 실시간 데이터베이스 뷰어
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  실시간 연동 ({registrations.length}건)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                참가자가 신청서를 제출하면 구글 시트에 자동 기록되는 실제 데이터 구조를 확인합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Webhook Configuration & Control Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Custom Webhook URL form */}
          <form onSubmit={handleSaveWebhook} className="flex-1 flex items-center gap-2">
            <span className="font-semibold text-slate-700 shrink-0 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-indigo-600" />
              Apps Script 웹훅 URL:
            </span>
            <input
              type="text"
              value={tempWebhookUrl}
              onChange={(e) => setTempWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec (미설정 시 앱 내 자체 시뮬레이션 저장)"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shrink-0"
            >
              저장
            </button>
          </form>

          {/* Search & Export Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름, 이메일, 부서 검색"
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
              title="새로고침"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              CSV 다운로드
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              검색 조건에 맞는 참가 신청 내역이 없습니다.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28">참가 번호</th>
                    <th className="p-3 w-28">신청 일시</th>
                    <th className="p-3 w-44">세미나명</th>
                    <th className="p-3 w-24">참가자</th>
                    <th className="p-3 w-36">소속 / 직무</th>
                    <th className="p-3 w-40">이메일 / 연락처</th>
                    <th className="p-3 w-28">경험 수준</th>
                    <th className="p-3">기대 목표 & AI 가이드 요약</th>
                    <th className="p-3 w-20 text-center">동기화</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                        {item.ticketNumber}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {new Date(item.submittedAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3 font-medium text-slate-900 line-clamp-2">
                        {item.seminarTitle}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {item.name}
                        {item.companionCount > 0 && (
                          <span className="ml-1 text-[10px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded font-normal">
                            +{item.companionCount}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.department}
                      </td>
                      <td className="p-3 text-slate-600">
                        <div className="truncate max-w-[150px]">{item.email}</div>
                        <div className="text-[11px] text-slate-400">{item.phone}</div>
                      </td>
                      <td className="p-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {item.experienceLevel.split(' ')[0]}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">
                        <p className="line-clamp-1 font-medium">{item.goals}</p>
                        {item.aiGuide && (
                          <p className="text-[11px] text-indigo-700 line-clamp-1 mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                            {item.aiGuide.personalizedBenefit}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          저장됨
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>신청 즉시 구글 스프레드시트 앱스 스크립트 웹훅으로 100% 안전하게 전파됩니다.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
