import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  KeyRound, 
  Table, 
  Github, 
  Terminal, 
  HelpCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface BeginnerDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const BeginnerDeployGuideModal: React.FC<BeginnerDeployGuideModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3' | 'files'>('step1');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedKeyName, setCopiedKeyName] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('복사 완료', `${label}이(가) 클립보드에 복사되었습니다.`, 'success');
  };

  const googleAppsScriptCode = `// [Google Apps Script: 구글 스프레드시트 자동 저장 웹훅]
// 1. 구글 스프레드시트 생성 후 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
// 2. 기존 코드를 모두 지우고 아래 코드를 그대로 붙여넣기
// 3. 우측 상단 [배포] -> [새 배포] -> 유형 [웹 앱] 선택
// 4. '액세스 권한이 있는 사용자'를 '모든 사용자(Anyone)'로 선택 후 배포 클릭
// 5. 발급된 '웹 앱 URL'을 복사하여 Vercel 환경변수(GOOGLE_SHEET_WEBHOOK_URL)에 등록!

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 첫 행에 제목(헤더)이 없으면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "참가번호",
        "신청일시",
        "세미나명",
        "이름",
        "소속/직무",
        "이메일",
        "연락처",
        "경험수준",
        "기대목표",
        "사전질문",
        "동반인원",
        "AI가이드요약"
      ]);
      // 헤더 서식 지정 (배경색 & 굵게)
      sheet.getRange(1, 1, 1, 12).setBackground("#4F46E5").setFontColor("#FFFFFF").setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.ticketNumber || "",
      data.submittedAt || new Date().toISOString(),
      data.seminarTitle || "",
      data.name || "",
      data.department || "",
      data.email || "",
      data.phone || "",
      data.experienceLevel || "",
      data.goals || "",
      data.questions || "",
      data.companionCount || 0,
      data.aiSummary || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  초보자를 위한 1·2·3단계 Vercel 배포 & 구글 시트 연동 가이드
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  초보자 친화
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                코딩을 몰라도 그대로 따라하면 GitHub 업로드, 무료 Vercel 배포, 구글 시트 연동까지 한 번에 끝낼 수 있습니다.
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

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('step1')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'step1'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
            1단계: GitHub에 올리기
          </button>
          <button
            onClick={() => setActiveTab('step2')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'step2'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
            2단계: Vercel 환경변수 설정
          </button>
          <button
            onClick={() => setActiveTab('step3')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'step3'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">3</span>
            3단계: 구글 시트 연동 (코드 복사)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'files'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📂 파일별 역할 안내
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-5 sm:p-7 space-y-6 text-sm text-slate-700">
          {/* STEP 1: GitHub */}
          {activeTab === 'step1' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <Github className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-950 text-sm">
                    GitHub(깃허브)란 무엇인가요?
                  </h4>
                  <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
                    작성한 웹앱 코드를 안전하게 보관하는 무료 클라우드 저장소입니다. Vercel은 깃허브에 올라간 코드를 자동으로 감지하여 인터넷에 무료로 배포해 줍니다.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-base">진행 순서:</h4>
                <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <li>
                    <b>GitHub.com 로그인</b> 후 우측 상단의 <b>[+]</b> 버튼 클릭 → <b>[New repository]</b> 선택
                  </li>
                  <li>
                    저장소 이름(Repository name)에 <code className="px-1.5 py-0.5 bg-slate-100 rounded text-indigo-600 font-semibold">seminar-pass-ai</code> 입력 후 <b>[Create repository]</b> 클릭
                  </li>
                  <li>
                    컴퓨터 터미널(또는 GitHub Desktop 프로그램)에서 프로젝트 폴더를 열고 다음 명령어를 순서대로 실행합니다:
                  </li>
                </ol>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-1.5 relative">
                  <button
                    onClick={() => copyToClipboard(`git init\ngit add .\ngit commit -m "feat: first release of SeminarPass AI"\ngit branch -M main\ngit remote add origin <내_깃허브_주소>\ngit push -u origin main`, 'Git 명령어')}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded bg-slate-800"
                    title="명령어 복사"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <p className="text-slate-400"># 깃허브에 코드 올리기</p>
                  <p>git init</p>
                  <p>git add .</p>
                  <p>git commit -m "feat: first release of SeminarPass AI"</p>
                  <p>git branch -M main</p>
                  <p>git remote add origin https://github.com/내아이디/seminar-pass-ai.git</p>
                  <p>git push -u origin main</p>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <b>보안 주의:</b> <code className="bg-amber-100 px-1 rounded">.env</code> 파일(실제 API 키가 적힌 파일)은 이미 <code className="bg-amber-100 px-1 rounded">.gitignore</code>에 포함되어 있으므로 깃허브에 절대 올라가지 않으니 안심하세요!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Vercel & Environment Variables */}
          {activeTab === 'step2' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-indigo-950 text-sm">
                    Vercel Environment Variables(환경변수) 설정 안내
                  </h4>
                  <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
                    API 키를 코드에 직접 적지 않고, Vercel 대시보드에만 안전하게 등록해 두는 보안 표준 방식입니다.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Vercel 대시보드에서 등록할 필수 환경변수 표:
                </h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-44">Key (변수 이름)</th>
                        <th className="p-3">Value (넣어야 할 값 설명)</th>
                        <th className="p-3 w-24 text-center">복사</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-700">
                          GEMINI_API_KEY
                        </td>
                        <td className="p-3 text-slate-600">
                          <p className="font-semibold text-slate-900">구글 Gemini AI API 키 (필수)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Google AI Studio (aistudio.google.com)에서 <b>[Get API key]</b>를 눌러 무료로 발급받은 문자열
                          </p>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              copyToClipboard('GEMINI_API_KEY', 'GEMINI_API_KEY');
                              setCopiedKeyName('gemini');
                              setTimeout(() => setCopiedKeyName(null), 2000);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                            title="Key 이름 복사"
                          >
                            {copiedKeyName === 'gemini' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-700">
                          GOOGLE_SHEET_WEBHOOK_URL
                        </td>
                        <td className="p-3 text-slate-600">
                          <p className="font-semibold text-slate-900">구글 스프레드시트 웹 앱 URL (선택/권장)</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            3단계에서 Google Apps Script를 배포하고 복사한 웹 앱 실행 URL (<code className="text-slate-700">https://script.google.com/macros/s/.../exec</code>)
                          </p>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              copyToClipboard('GOOGLE_SHEET_WEBHOOK_URL', 'GOOGLE_SHEET_WEBHOOK_URL');
                              setCopiedKeyName('sheet');
                              setTimeout(() => setCopiedKeyName(null), 2000);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                            title="Key 이름 복사"
                          >
                            {copiedKeyName === 'sheet' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">📌 Vercel 배포 방법 (초간단 4단계):</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                    <li><a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline inline-flex items-center gap-1">Vercel.com <ExternalLink className="w-3 h-3" /></a> 에 깃허브 계정으로 무료 가입 및 로그인</li>
                    <li><b>[Add New...]</b> → <b>[Project]</b> 클릭 후 방금 올린 <b>seminar-pass-ai</b> 저장소 <b>[Import]</b></li>
                    <li>화면 중앙의 <b>[Environment Variables]</b> 아코디언 메뉴 클릭</li>
                    <li>위 표의 <b>Key</b>와 <b>Value</b>를 각각 복사해서 붙여넣고 <b>[Add]</b> 클릭 후 하단 <b>[Deploy]</b> 클릭!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Google Sheets Apps Script */}
          {activeTab === 'step3' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <Table className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    구글 스프레드시트 3분 무료 연동 (Google Apps Script)
                  </h4>
                  <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                    유료 데이터베이스 없이 구글 시트를 실시간 DB로 사용하는 가장 편리하고 확실한 방법입니다. 아래 코드를 복사해서 구글 시트에 붙여넣기만 하면 끝납니다.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    구글 시트에 붙여넣을 스크립트 코드:
                  </span>
                  <button
                    onClick={() => {
                      copyToClipboard(googleAppsScriptCode, 'Google Apps Script 코드');
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedScript ? '코드 복사 완료!' : '전체 코드 원클릭 복사'}</span>
                  </button>
                </div>

                <div className="relative bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-64 border border-slate-800">
                  <pre>{googleAppsScriptCode}</pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <p className="font-bold text-slate-800">💡 구글 시트 적용 순서 (캡처 보듯 따라하기):</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                    <li>새 구글 스프레드시트를 하나 만듭니다 (제목 예: <b>세미나 참가자 접수 명단</b>)</li>
                    <li>상단 메뉴에서 <b>[확장 프로그램]</b> → <b>[Apps Script]</b>를 클릭합니다.</li>
                    <li>기존에 적힌 빈 함수를 모두 지우고, 위의 <b>복사한 코드</b>를 그대로 붙여넣습니다.</li>
                    <li>우측 상단의 파란색 <b>[배포]</b> 버튼 → <b>[새 배포]</b>를 클릭합니다.</li>
                    <li>톱니바퀴 아이콘을 눌러 유형을 <b>[웹 앱(Web app)]</b>으로 선택합니다.</li>
                    <li>
                      <b>중요:</b> '액세스 권한이 있는 사용자'를 꼭 <b>'모든 사용자(Anyone)'</b>로 변경한 뒤 [배포]를 누릅니다!
                    </li>
                    <li>화면에 나오는 <b>웹 앱 URL(URL)</b>을 복사하여 Vercel의 <code>GOOGLE_SHEET_WEBHOOK_URL</code>에 넣어주면 즉시 실시간 연동 완료!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Files Architecture Breakdown */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                프로젝트 파일 구조 및 각 파일의 역할 (복사할 대상 확인용)
              </h4>
              <p className="text-xs text-slate-500">
                초보자분들이 코드를 나누어 복사하거나 유지보수할 때 어떤 파일이 무슨 일을 하는지 쉽게 파악할 수 있도록 정리했습니다.
              </p>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
                    <span>📄 server.ts</span>
                    <span className="font-sans font-normal text-[11px] text-slate-400">(백엔드 서버)</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Gemini AI API 키를 안전하게 보관하여 브라우저에 노출되지 않도록 처리하고, 구글 시트 웹훅으로 신청 데이터를 전송하는 백엔드 서버입니다.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
                    <span>📄 src/App.tsx</span>
                    <span className="font-sans font-normal text-[11px] text-slate-400">(메인 화면)</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    헤더, 세미나 상세 정보, 참가 신청서, 완료 티켓, 로딩 애니메이션 모달을 조립하여 사용자에게 보여주는 화면 전체 컨트롤러입니다.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
                    <span>📄 src/components/RegistrationForm.tsx</span>
                    <span className="font-sans font-normal text-[11px] text-slate-400">(신청서 폼)</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    참가자 성함, 부서, 이메일, 목표, 질문을 입력받고 빈 칸이 없는지 검사(Validation)하는 UI 컴포넌트입니다.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
                    <span>📄 src/components/ConfirmationTicket.tsx</span>
                    <span className="font-sans font-normal text-[11px] text-slate-400">(티켓 & AI 가이드)</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    신청 완료 후 발급되는 디지털 입장 티켓, QR 코드, 그리고 Gemini AI가 참가자의 목표에 맞게 작성해 준 사전 준비 팁과 Q&A 질문을 보여줍니다.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
                    <span>📄 src/data/seminars.ts</span>
                    <span className="font-sans font-normal text-[11px] text-slate-400">(세미나 목록 데이터)</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    사내 AI 실무 워크숍, 노코드 자동화 등 클래스의 일정, 강사 소개, 커리큘럼 아젠다가 적혀 있는 데이터 파일입니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            궁금한 점이 있으면 언제든 편하게 물어보세요. 성공적인 세미나 진행을 응원합니다!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
