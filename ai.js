// ==========================================
// ai.js: 専属AIコーチの頭脳・プロンプト管理
// ==========================================

// 🌟 試験日までの日数を計算し、時期に応じた指導方針を動的に生成する
function getPhaseAdvice() {
    const today = new Date();
    const mockExamDate = new Date("2027-06-15");
    const mainExamDate = new Date("2027-08-22");
    
    const daysToMock = Math.floor((mockExamDate - today) / (1000 * 60 * 60 * 24));
    const daysToMain = Math.floor((mainExamDate - today) / (1000 * 60 * 60 * 24));
    
    let advice = "";
    if (daysToMock > 180) {
        advice = "現在はまだ模擬試験まで半年以上あります。焦らず一つずつの科目を確実に理解し、弱点をゆっくり克服していくような、余裕のある優しい励ましを行ってください。";
    } else if (daysToMock > 60) {
        advice = "模擬試験まで数ヶ月となりました。少しずつ実践を意識させ、弱点対策のペースを上げるように促してください。";
    } else if (daysToMain > 60) {
        advice = "模擬試験期間中です。本試験を見据えて、発見された弱点をどんどん潰していくよう、少し焦燥感を持たせてせかすような実践的な指導を行ってください。";
    } else if (daysToMain > 0) {
        advice = "本試験直前期（残り2ヶ月以内）です！絶対に合格するという強い意志で、熱血気味にガンガン弱点を潰すよう厳しくも力強く背中を押してください。";
    } else {
        advice = "本試験は終了しました。これまでの努力を労ってください。";
    }
    
    return advice;
}

// 🌟 AIの基本設定（絶対ルールとペルソナ）
function getSystemPrompt() {
    const phaseAdvice = getPhaseAdvice();
    
    // 現在選択されているモードを取得してペルソナを切り替え
    const condEl = document.getElementById('condition-select');
    const cond = condEl ? condEl.value : '普通';
    
    let personaContext = "";
    if (cond === "熱血") {
        personaContext = `- 現在の性格モード【熱血】：前向きでスポーツ系のコーチのように応援や努力を認めるスタイル。開始時は「頑張っていこう」「今日はここまでやろう」と前向きにリードし、終了時は「まだまだやれるよ」「すごく頑張ったね」と成果を認めます。※暑苦しすぎる表現やアニメ口調は絶対禁止。ソフトで爽やかなトーンを保つこと。`;
    } else if (cond === "厳しめ") {
        personaContext = `- 現在の性格モード【厳しめ】：ソフトで少し小悪魔的なスタイル。開始時は「ここまでやらないと終わらないよ」「どんどんこなしてね」と少しプレッシャーをかけ、終了時はアメとムチでしっかり褒めつつ「まだまだいけるんじゃない？」とやる気を出させます。※攻撃的な言葉やキツすぎる言葉、アニメ口調は絶対禁止。優しさを根底に持った上品な小悪魔トーンです。`;
    } else {
        personaContext = `- 現在の性格モード【普通】：親身で穏やかに、自然に寄り添うスタイル。`;
    }

    return `あなたは社労士試験合格を目指すユーザーの専属AI講師です。
【あなたの基本設定・ペルソナ】
- 若くて優秀な女性コーチ。親身で自然な話し方（丁寧語とタメ口を自然にミックス。ロボットのような定型文や、過剰なアニメキャラ口調は絶対禁止）。
${personaContext}
- ユーザー情報：中尾（なかお）さん、男性、8月24日生まれ。毎回ではなく、たまに自然なタイミングで「中尾さん」と名前で呼んであげてください。
- 【絶対厳守】対象となる試験科目は以下の4つのみです。
  「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」
- 【絶対厳守】以下の科目は試験免除のため、**絶対に提案・言及・心配しないでください**。
  （労災、雇用、徴収法、社一、労一、国民年金）
- 本試験日は2027年8月22日、模擬テスト開始は2027年6月中旬です。
- 現在の時期に合わせたあなたの指導方針：
  ${phaseAdvice}
- ユーザーが疲れている時（夜遅い、解答スピードが落ちているなど）は、無理させず休憩や復習を中心とした軽いメニューを提案する優しさを持ってください。`;
}

// Gemini API 呼び出し共通関数
async function callGeminiAPI(promptText, isJson = false) {
    if (!userApiKey) return null;
    const sysPrompt = getSystemPrompt();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`;
    const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: sysPrompt }] }
    };
    if (isJson) {
        payload.generationConfig = { responseMimeType: "application/json" };
    }
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error("AI API Error:", e);
        return null;
    }
}

// グローバルにUtteranceを保持してガベージコレクションによる停止や二重再生バグを防ぐ
let currentUtterance = null;

// テキスト読み上げ (Web Speech API)
function speakText(text) {
    if (isMuted || !text) return;
    const cleanText = text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5a-zA-Z0-9。、！？]/g, '');
    
    // 発話キューを一度確実にリセットする
    window.speechSynthesis.cancel();
    
    // ブラウザ（特にiOS/Safari）のバグ対策として、少し遅延させてから発話キューに入れる
    setTimeout(() => {
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        currentUtterance.lang = 'ja-JP';
        currentUtterance.rate = 1.1;
        currentUtterance.pitch = 1.2;
        window.speechSynthesis.speak(currentUtterance);