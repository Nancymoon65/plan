import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, department, seminarTitle, experienceLevel, goals, questions } = req.body || {};

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

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
        return res.status(200).json({ success: true, guide: parsed, source: 'gemini-live' });
      }
    }

    // Smart fallback if API Key not set yet
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

    return res.status(200).json({ success: true, guide: fallbackGuide, source: 'smart-template' });
  } catch (error: any) {
    console.error('Vercel Gemini error:', error);
    return res.status(200).json({
      success: true,
      guide: {
        welcomeMessage: `${name || '참가자'} 님, 참가 신청이 성공적으로 접수되었습니다.`,
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
}
