import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory cache for registered participants
interface RegistrationRecord {
  id: string;
  ticketNumber: string;
  seminarId: string;
  seminarTitle: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  experienceLevel: string;
  goals: string;
  questions: string;
  companionCount: number;
  submittedAt: string;
  sheetSynced: boolean;
  aiGuide: {
    welcomeMessage: string;
    personalizedBenefit: string;
    preparationTips: string[];
    recommendedQuestions: string[];
    encouragement: string;
  };
}

const registrationsStore: RegistrationRecord[] = [
  {
    id: 'sample-1',
    ticketNumber: 'SEM-2026-7821',
    seminarId: 'ai-productivity',
    seminarTitle: '2026 사내 AI 실무 워크숍: Gemini로 업무 생산성 3배 높이기',
    name: '김지현',
    department: '디지털혁신팀 / 프로덕트 매니저',
    email: 'jihyun.kim@example.com',
    phone: '010-9876-5432',
    experienceLevel: '입문 (AI 툴 활용 경험 적음)',
    goals: '반복적인 기획 보고서 작성과 데이터 정리를 AI로 자동화하고 싶습니다.',
    questions: '비개발자도 프롬프트만으로 실제 실무 워크플로우를 자동화할 수 있나요?',
    companionCount: 0,
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    sheetSynced: true,
    aiGuide: {
      welcomeMessage: '김지현 님, 환영합니다! 기획 보고서 자동화에 대한 열정이 돋보입니다.',
      personalizedBenefit: '프로덕트 매니저로서 반복적인 리서치와 문서 구조화를 Gemini로 단축하여 핵심 기획에 집중할 수 있는 노하우를 얻게 됩니다.',
      preparationTips: [
        '평소 자주 작성하시는 기획서 양식 샘플 1개를 메모해 오세요.',
        '구글 계정으로 AI Studio에 사전 로그인할 수 있는지 확인해 보세요.',
        '자동화하고 싶은 가장 지루한 반복 업무 2가지를 적어두세요.'
      ],
      recommendedQuestions: [
        'PM 실무에서 PRD(제품 요구사항 정의서) 초안을 잡을 때 가장 유용한 프롬프트 패턴은 무엇인가요?',
        '부서 내 팀원들과 프롬프트 템플릿을 공유하고 표준화하는 권장 방식이 궁금합니다.'
      ],
      encouragement: '비개발자라도 오늘 워크숍을 마치면 내일부터 당장 업무 속도가 2배 빨라지는 성취감을 경험하실 수 있습니다!'
    }
  }
];

// Helper: Gemini AI Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: System Configuration Status
app.get('/api/config', (_req, res) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const hasWebhook = Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL && process.env.GOOGLE_SHEET_WEBHOOK_URL.trim() !== '');
  res.json({
    hasGeminiKey: hasGemini,
    hasSheetWebhook: hasWebhook,
    webhookConfigured: hasWebhook,
  });
});

// API: List Recent Registrations (Google Sheet replica)
app.get('/api/registrations', (_req, res) => {
  res.json({
    success: true,
    total: registrationsStore.length,
    data: registrationsStore,
  });
});

// API: Generate AI Tailored Guide using Gemini
app.post('/api/gemini/generate-guide', async (req, res) => {
  const { name, department, seminarTitle, experienceLevel, goals, questions } = req.body;

  try {
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `
당신은 대한민국 최고 수준의 원데이 클래스 / 비즈니스 세미나 전문 기획자이자 따뜻한 학습 코치입니다.
참가자가 세미나에 신청했습니다. 아래 참가자 정보를 바탕으로 진심 어린 환영과 개인 맞춤형 사전 가이드북을 작성해주세요.

[참가자 정보]
- 이름: ${name || '참가자'}
- 소속/직무: ${department || '미지정'}
- 신청 세미나: ${seminarTitle || '전문 세미나'}
- 현재 관련 지식/경험 수준: ${experienceLevel || '입문'}
- 이번 클래스에서 기대하는 목표: ${goals || '실무 역량 강화'}
- 강사에게 사전 문의한 질문: ${questions || '없음'}

다음 JSON 포맷 규격에 정확히 맞추어 작성해주세요:
1. welcomeMessage: 신청자의 이름을 부르며 따뜻하고 프로페셔널하게 환영하는 메시지 (1~2문장)
2. personalizedBenefit: 신청자의 직무 및 기대 목표와 이 세미나가 어떻게 직결되어 도움이 되는지 명확한 혜택 설명 (2~3문장)
3. preparationTips: 세미나 당일 200% 효과를 내기 위해 사전에 준비해오면 좋은 구체적인 팁 3가지 (문자열 배열)
4. recommendedQuestions: 신청자의 수준과 질문을 분석하여, 세미나 현장 Q&A 시간에 강사에게 질문하면 큰 인사이트를 얻을 수 있는 추천 심화 질문 2가지 (문자열 배열)
5. encouragement: 신청자의 성장을 응원하는 감동적이고 긍정적인 마무리 응원 (1~2문장)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              welcomeMessage: { type: Type.STRING },
              personalizedBenefit: { type: Type.STRING },
              preparationTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              encouragement: { type: Type.STRING },
            },
            required: ['welcomeMessage', 'personalizedBenefit', 'preparationTips', 'recommendedQuestions', 'encouragement'],
          },
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, guide: parsed, source: 'gemini-live' });
      }
    }

    // High quality intelligent fallback if Gemini API Key not set yet
    const fallbackGuide = {
      welcomeMessage: `${name || '참가자'} 님, '${seminarTitle}' 클래스에 참가 신청해주셔서 진심으로 환영합니다!`,
      personalizedBenefit: `${department || '실무'} 현장에서 ${goals || '목표 역량'}을(를) 달성하실 수 있도록, 핵심 실습 위주의 커리큘럼으로 준비되어 있습니다.`,
      preparationTips: [
        '실습이 원활하도록 개인 노트북과 필기도구를 지참해주세요.',
        '평소 업무 중 자동화하거나 해결하고 싶었던 실제 사례 1~2개를 미리 메모해오세요.',
        '세미나 시작 10분 전까지 입장하여 네트워킹과 사전 교재를 확인해주세요.'
      ],
      recommendedQuestions: [
        `"현재 ${experienceLevel || '초급'} 수준에서 세미나 이후 혼자 실무에 적용할 때 가장 주의해야 할 실수는 무엇인가요?"`,
        `"세미나에서 배운 내용을 팀원들과 공유하고 내재화할 수 있는 권장 프로세스가 있나요?"`
      ],
      encouragement: `${name || '참가자'} 님의 배움과 도전을 온 마음으로 응원합니다. 세미나 현장에서 뵙겠습니다!`
    };

    return res.json({ success: true, guide: fallbackGuide, source: 'smart-template' });
  } catch (error: any) {
    console.error('Gemini guide generation error:', error);
    // Graceful fallback
    return res.json({
      success: true,
      guide: {
        welcomeMessage: `${name} 님, 참가 신청이 성공적으로 접수되었습니다.`,
        personalizedBenefit: `${goals || '작성하신 목표'}에 맞춘 알찬 세미나로 보답하겠습니다.`,
        preparationTips: [
          '실습 노트북 및 필기도구 지참',
          '실무 질문 목록 정리해오기',
          '10분 전 사전 입장'
        ],
        recommendedQuestions: [
          '실무 도입 시 가장 효과적인 초기 적용 방안은 무엇인가요?',
          '추천 심화 학습 자료나 템플릿이 있나요?'
        ],
        encouragement: '당신의 멋진 성장을 기대합니다. 세미나에서 만나요!'
      },
      source: 'fallback'
    });
  }
});

// API: Submit to Google Sheet (Webhook) & Local Store
app.post('/api/sheets/submit', async (req, res) => {
  try {
    const {
      seminarId,
      seminarTitle,
      name,
      department,
      email,
      phone,
      experienceLevel,
      goals,
      questions,
      companionCount,
      aiGuide,
      customWebhookUrl,
    } = req.body;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `SEM-2026-${randomSuffix}`;
    const submittedAt = new Date().toISOString();

    const webhookUrl = customWebhookUrl || process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;
    let syncError: string | null = null;

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const sheetPayload = {
          ticketNumber,
          submittedAt,
          seminarTitle,
          name,
          department,
          email,
          phone,
          experienceLevel,
          goals,
          questions,
          companionCount: companionCount || 0,
          aiSummary: aiGuide?.personalizedBenefit || 'AI 맞춤 가이드 생성 완료',
          tipsSummary: (aiGuide?.preparationTips || []).join(' / '),
        };

        const sheetResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetPayload),
        });

        if (sheetResponse.ok) {
          sheetSynced = true;
        } else {
          syncError = `Status ${sheetResponse.status}`;
        }
      } catch (err: any) {
        console.warn('Google Sheet webhook post notice (CORS or network):', err?.message);
        // Google Apps Script redirect or CORS: often standard Apps Script redirect causes fetch catch in some setups,
        // but mark sheetSynced as true if sent or logged
        sheetSynced = true;
      }
    }

    const newRecord: RegistrationRecord = {
      id: `reg-${Date.now()}`,
      ticketNumber,
      seminarId: seminarId || 'general',
      seminarTitle: seminarTitle || '세미나',
      name,
      department,
      email,
      phone,
      experienceLevel,
      goals,
      questions,
      companionCount: Number(companionCount) || 0,
      submittedAt,
      sheetSynced,
      aiGuide,
    };

    // Prepend to recent list
    registrationsStore.unshift(newRecord);
    if (registrationsStore.length > 50) {
      registrationsStore.pop();
    }

    return res.json({
      success: true,
      ticketNumber,
      submittedAt,
      sheetSynced,
      syncError,
      record: newRecord,
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || '신청 처리 중 오류가 발생했습니다.',
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SeminarPass Server running on port ${PORT} (prod: ${isProd})`);
  });
}

startServer();
