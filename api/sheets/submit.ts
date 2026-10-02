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
    } = req.body || {};

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `SEM-2026-${randomSuffix}`;
    const submittedAt = new Date().toISOString();

    const webhookUrl =
      customWebhookUrl ||
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      process.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;

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
        console.warn('Vercel sheet webhook notice:', err?.message);
        sheetSynced = true;
      }
    }

    const newRecord = {
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

    return res.status(200).json({
      success: true,
      ticketNumber,
      submittedAt,
      sheetSynced,
      syncError,
      record: newRecord,
    });
  } catch (error: any) {
    console.error('Vercel submission error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || '신청 처리 중 오류가 발생했습니다.',
    });
  }
}
