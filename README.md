# SeminarPass AI (세미나 & 원데이 클래스 신청 자동화 센터)

> **초보자도 5분 만에 완성하는 원데이 클래스 / 세미나 참가 신청 & 구글 시트 연동 & Gemini AI 맞춤 안내 웹앱**

---

## 📌 주요 기능 요약
1. **세미나 및 클래스 참가 신청**: 이름, 소속, 이메일, 목표, 사전 질문, 경험 수준 접수
2. **구글 스프레드시트(Google Sheets) 연동**: 신청 즉시 Apps Script Webhook을 통해 구글 시트에 실시간 행 추가
3. **Gemini AI 맞춤 사전 가이드북 발행**: 참가자의 직무와 기대 목표를 분석하여 사전 준비 팁(3개), 추천 Q&A 질문(2개), 응원 메시지 자동 생성
4. **디지털 티켓 & QR 발급**: 고유 티켓 번호, QR 코드, 인쇄/PDF 저장, 텍스트 클립보드 복사 지원
5. **실시간 구글 시트 뷰어**: 웹앱 내에서 구글 시트에 누적되는 명단을 실시간으로 확인하고 CSV로 내보내기 지원

---

## 🚀 초보자를 위한 1, 2, 3단계 배포 가이드

### 1단계: GitHub에 코드 올리기
1. [GitHub](https://github.com)에 로그인 후 새 저장소(New Repository)를 만듭니다. (예: `seminar-pass-ai`)
2. 터미널에서 다음 명령어를 입력하여 코드를 업로드합니다:
   ```bash
   git init
   git add .
   git commit -m "feat: first release of SeminarPass AI"
   git branch -M main
   git remote add origin https://github.com/내아이디/seminar-pass-ai.git
   git push -u origin main
   ```

### 2단계: Vercel 무료 배포 & 환경변수(Environment Variables) 등록
1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인합니다.
2. **[Add New...]** -> **[Project]**를 누르고 방금 올린 저장소를 **[Import]**합니다.
3. 배포 화면의 **[Environment Variables]** 항목을 클릭하고 아래 2개의 값을 추가합니다:

| Key (환경변수 이름) | Value (값) | 설명 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSy...` (본인 키) | Google AI Studio에서 무료로 발급받은 API 키 |
| `GOOGLE_SHEET_WEBHOOK_URL` | `https://script.google.com/macros/s/.../exec` | 3단계에서 배포한 구글 앱스 스크립트 웹 앱 URL |

4. 하단의 **[Deploy]** 버튼을 누르면 1분 만에 전 세계에 무료 배포 완료!

---

### 3단계: 구글 스프레드시트 3분 무료 연동 (Google Apps Script)
1. 구글 드라이브에서 새 **구글 스프레드시트**를 생성합니다.
2. 상단 메뉴에서 **[확장 프로그램]** -> **[Apps Script]**를 클릭합니다.
3. 기존 코드를 모두 지우고 아래 스크립트를 그대로 복사해서 붙여넣습니다:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 첫 행에 헤더(제목)가 없으면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "참가번호", "신청일시", "세미나명", "이름", "소속/직무",
        "이메일", "연락처", "경험수준", "기대목표", "사전질문",
        "동반인원", "AI가이드요약"
      ]);
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
}
```
4. 우측 상단의 **[배포]** -> **[새 배포]** 클릭
5. 톱니바퀴 아이콘 -> **[웹 앱(Web app)]** 선택
6. **'액세스 권한이 있는 사용자'를 '모든 사용자(Anyone)'로 선택** 후 **[배포]** 클릭
7. 생성된 **웹 앱 URL**을 복사하여 Vercel의 `GOOGLE_SHEET_WEBHOOK_URL` 환경변수 또는 앱 내 시트 대시보드에 입력하면 즉시 실시간 연동 완료!

---

## 📂 파일 구조 및 역할

- `server.ts`: Express 백엔드 서버 (Gemini API 호출 및 구글 시트 웹훅 중계, API 키 브라우저 노출 방지)
- `src/App.tsx`: 화면 전체 상태 및 컴포넌트 총괄 컨트롤러
- `src/components/RegistrationForm.tsx`: 참가자 정보 및 질문 입력 폼
- `src/components/ConfirmationTicket.tsx`: 발급된 모바일 티켓 & Gemini AI 맞춤 안내서
- `src/components/ProcessingModal.tsx`: "신청서 검증 중... 구글 시트 저장 중... Gemini 분석 중..." 단계별 로딩 애니메이션
- `src/components/SheetDashboardModal.tsx`: 웹앱 내 실시간 구글 시트 테이블 뷰어 & CSV 내보내기
- `src/components/BeginnerDeployGuideModal.tsx`: 초보자를 위한 상세 Vercel & 구글 시트 가이드 모달
- `src/data/seminars.ts`: 사전 등록된 원데이 클래스 및 세미나 목록 데이터
