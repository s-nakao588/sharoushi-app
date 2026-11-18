/* =========================================================
   📓 マイノート・フリーノート管理モジュール (GAS同期＆PDF連携版)
   ========================================================= */

// 🌟 新しく作成したマイノート用GASのウェブアプリURL
const NOTEBOOK_GAS_URL = "https://script.google.com/macros/s/AKfycbyXgXlK8FpQZqqvvu7dxS4htbPlB9FJeJySls4GM0ZZlDrlvKCy4QXiXUV6OdrrveA5/exec";

// 🌟 各科目のテキストPDFと、項目ごとの開始ページ設定辞書
const TEXTBOOK_PDF_CONFIG = {
    "労働基準法": {
        "url": "https://drive.google.com/open?id=1dTgqAqxWKumJEK3QD2_GlrFAdeYxMsqY&usp=drive_fs",
        "chapters": {
            "1 労働基準法の基本理念": 8,
            "2 労働契約": 20,
            "3 賃金、賃金の支払の5原則": 37,
            "4 労働時間、休憩、休日": 49,
            "5 労働時間、変形労働時間制": 60,
            "6 時間外・休日労働、割増賃金": 70,
            "労働時間の計算等": 83, // 7 みなし労働時間制
            "8 年次有給休暇": 89,
            "9 年少者、妊産婦等": 97,
            "就業規則、監督等その他": 108
        }
    }
    // 今後、安衛法や健保法が追加されたらここに書き足すだけで自動連携されます
};

let currentNotebookId = null;
let currentNotebookImageBase64 = null;
let isFreeNoteMode = false;
let activeFreeNoteMap = {}; 

// 🌟 アプリ起動時にGASからマイノートデータを一括同期する（裏で非同期実行）
document.addEventListener('DOMContentLoaded', async () => {
    if (!NOTEBOOK_GAS_URL || NOTEBOOK_GAS_URL.includes("ここに")) return;
    try {
        const res = await fetch(NOTEBOOK_GAS_URL, {
            method: 'POST', body: JSON.stringify({ action: 'get_notebooks' })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('user_notebooks', JSON.stringify(data.notebooks));
            if (typeof updateStartScreenNotebookBadge === "function") updateStartScreenNotebookBadge();
        }
    } catch(e) {
        console.warn("マイノートの同期に失敗しました（オフラインまたはURL未設定）");
    }
});

// 🌟 PDFジャンプボタンを動的にHTMLへ挿入する関数
function insertPdfJumpButton(subjectName, chapterName) {
    const existingBtn = document.getElementById('dynamic-pdf-jump-btn');
    if (existingBtn) existingBtn.remove(); // 過去のボタンをリセット

    let baseSubj = subjectName.replace(/\(択一\)|\(選択\)/g, "").trim();
    
    if (TEXTBOOK_PDF_CONFIG[baseSubj] && TEXTBOOK_PDF_CONFIG[baseSubj].chapters[chapterName]) {
        const page = TEXTBOOK_PDF_CONFIG[baseSubj].chapters[chapterName];
        const pdfUrl = TEXTBOOK_PDF_CONFIG[baseSubj].url;
        
        if (pdfUrl.includes("ここに")) return; // URLが未設定の場合は出さない
        
        const btnHtml = `
            <button id="dynamic-pdf-jump-btn" onclick="window.open('${pdfUrl}#page=${page}', '_blank')" class="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-black py-3 rounded-xl border-2 border-blue-200 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                <span>📖</span><span>この項目のテキストを開く (P.${page}〜)</span>
            </button>
        `;
        
        const infoArea = document.getElementById('nb-question-info-area');
        if (infoArea) {
            infoArea.insertAdjacentHTML('beforeend', btnHtml);
        }
    }
}

// 🌟 新規フリーノート作成
function openNewFreeNotebook() {
    isFreeNoteMode = true;
    currentNotebookId = "freenote_" + Date.now(); 
    currentNotebookImageBase64 = null;

    document.getElementById('nb-free-select-area').classList.remove('hidden');
    document.getElementById('nb-free-select-area').classList.add('flex');
    document.getElementById('nb-question-info-area').classList.add('hidden');
    document.getElementById('nb-question-info-area').classList.remove('flex');
    document.getElementById('btn-delete-nb').classList.add('hidden');
    document.getElementById('nb-modal-subtitle').textContent = "フリーノート";

    activeFreeNoteMap = {};
    if (typeof allDatabase !== "undefined" && allDatabase.length > 0) {
        allDatabase.forEach(q => {
            let baseSubj = q._subjectName.replace(/\(択一\)|\(選択\)/g, ""); 
            if (!activeFreeNoteMap[baseSubj]) activeFreeNoteMap[baseSubj] = new Set();
            activeFreeNoteMap[baseSubj].add(q.項目 || "分類なし");
        });
    } else if (typeof freeNoteSubjectMap !== "undefined") {
        activeFreeNoteMap = freeNoteSubjectMap;
    }

    const subjSelect = document.getElementById('nb-free-subject-select');
    subjSelect.innerHTML = "";
    const subjects = Object.keys(activeFreeNoteMap);
    if (subjects.length === 0) {
        subjSelect.innerHTML = '<option value="">(データ読み込み中またはデータなし)</option>';
    } else {
        subjects.forEach(subj => {
            let opt = document.createElement('option');
            opt.value = subj; opt.textContent = subj;
            subjSelect.appendChild(opt);
        });
    }
    
    updateFreeNoteChapterSelect();

    document.getElementById('nb-note-input').innerHTML = "";
    document.getElementById('nb-image-input').value = "";
    document.getElementById('nb-image-preview-box').classList.add('hidden');
    document.getElementById('nb-image-preview').src = "";

    document.getElementById('notebook-modal').classList.remove('hidden');
    document.getElementById('notebook-modal').classList.add('flex');
    initColorPicker(); 
}

function updateFreeNoteChapterSelect() {
    const subj = document.getElementById('nb-free-subject-select').value;
    const chapSelect = document.getElementById('nb-free-chapter-select');
    chapSelect.innerHTML = "";
    
    if(subj && activeFreeNoteMap[subj]) {
        Array.from(activeFreeNoteMap[subj]).forEach(chap => {
            let opt = document.createElement('option');
            opt.value = chap; opt.textContent = chap;
            chapSelect.appendChild(opt);
        });
    } else {
        chapSelect.innerHTML = '<option value="">(選択不可)</option>';
    }
}

// 🌟 問題に紐づくマイノートを開く
function openNotebookForCurrentQuestion() {
    isFreeNoteMode = false;
    const q = currentQuestions[currentIndex];
    if (!q) return;

    currentNotebookId = q._id;
    currentNotebookImageBase64 = null;

    document.getElementById('nb-free-select-area').classList.add('hidden');
    document.getElementById('nb-free-select-area').classList.remove('flex');
    document.getElementById('nb-question-info-area').classList.remove('hidden');
    document.getElementById('nb-question-info-area').classList.add('flex');
    document.getElementById('nb-modal-subtitle').textContent = "個別メモ";

    document.getElementById('nb-badge-subject').textContent = q._subjectName;
    document.getElementById('nb-badge-chapter').textContent = q.項目 || "分類なし";
    document.getElementById('nb-problem-text').innerHTML = (q.問題文 || "").replace(/\n/g, '<br>');
    
    if (q._type === '択一') {
        document.getElementById('nb-answer-text').textContent = (q.正誤 || "").trim() === '〇' ? '〇 正しい' : '✖ 誤り';
    } else {
        document.getElementById('nb-answer-text').innerHTML = `A:${q.正解A} B:${q.正解B}<br>C:${q.正解C} D:${q.正解D} E:${q.正解E}`;
    }

    document.getElementById('nb-article-text').textContent = (q.根拠条文 || "").trim() || "条文なし";
    document.getElementById('nb-explanation-text').innerHTML = (q.解説 || "").trim() || "解説なし";

    // 🌟 PDFジャンプボタンを生成
    insertPdfJumpButton(q._subjectName, q.項目);

    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const existingNote = storedNotes[currentNotebookId];

    const inputArea = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    
    if (existingNote) {
        inputArea.innerHTML = existingNote.text || ""; 
        deleteBtn.classList.remove('hidden');
        if (existingNote.image) {
            currentNotebookImageBase64 = existingNote.image;
            document.getElementById('nb-image-preview').src = currentNotebookImageBase64;
            document.getElementById('nb-image-preview-box').classList.remove('hidden');
            document.getElementById('nb-image-preview-box').classList.add('flex');
        } else {
            document.getElementById('nb-image-preview-box').classList.add('hidden');
            document.getElementById('nb-image-preview-box').classList.remove('flex');
        }
    } else {
        inputArea.innerHTML = "";
        deleteBtn.classList.add('hidden');
        document.getElementById('nb-image-preview-box').classList.add('hidden');
        document.getElementById('nb-image-preview-box').classList.remove('flex');
    }
    
    document.getElementById('nb-image-input').value = "";
    document.getElementById('notebook-modal').classList.remove('hidden');
    document.getElementById('notebook-modal').classList.add('flex');
    initColorPicker();
}

// 🌟 一覧画面からノートを編集
function editNoteFromList(noteId) {
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const note = storedNotes[noteId];
    if(!note) return;

    closeNotebookListModal();

    currentNotebookId = note.id;
    isFreeNoteMode = (note.type === "フリーノート");
    currentNotebookImageBase64 = note.image || null;

    if (isFreeNoteMode) {
        document.getElementById('nb-free-select-area').classList.remove('hidden');
        document.getElementById('nb-free-select-area').classList.add('flex');
        document.getElementById('nb-question-info-area').classList.add('hidden');
        document.getElementById('nb-question-info-area').classList.remove('flex');
        document.getElementById('nb-modal-subtitle').textContent = "フリーノート";

        activeFreeNoteMap = {};
        if (typeof allDatabase !== "undefined" && allDatabase.length > 0) {
            allDatabase.forEach(q => {
                let baseSubj = q._subjectName.replace(/\(択一\)|\(選択\)/g, "");
                if (!activeFreeNoteMap[baseSubj]) activeFreeNoteMap[baseSubj] = new Set();
                activeFreeNoteMap[baseSubj].add(q.項目 || "分類なし");
            });
        }

        const subjSelect = document.getElementById('nb-free-subject-select');
        subjSelect.innerHTML = "";
        const subjects = Object.keys(activeFreeNoteMap);
        if (subjects.length > 0) {
            subjects.forEach(subj => {
                let opt = document.createElement('option');
                opt.value = subj; opt.textContent = subj;
                subjSelect.appendChild(opt);
            });
            subjSelect.value = note.subjectName;
            updateFreeNoteChapterSelect();
            document.getElementById('nb-free-chapter-select').value = note.chapterName;
        }
    } else {
        document.getElementById('nb-free-select-area').classList.add('hidden');
        document.getElementById('nb-free-select-area').classList.remove('flex');
        document.getElementById('nb-question-info-area').classList.remove('hidden');
        document.getElementById('nb-question-info-area').classList.add('flex');
        document.getElementById('nb-modal-subtitle').textContent = "個別メモ";

        document.getElementById('nb-badge-subject').textContent = note.subjectName || "不明";
        document.getElementById('nb-badge-chapter').textContent = note.chapterName || "不明";
        document.getElementById('nb-problem-text').innerHTML = (note.problemText || "").replace(/\n/g, '<br>');
        
        let q = (typeof allDatabase !== "undefined") ? allDatabase.find(q => q._id === note.id) : null;
        if(q) {
            if (q._type === '択一') {
                document.getElementById('nb-answer-text').textContent = (q.正誤 || "").trim() === '〇' ? '〇 正しい' : '✖ 誤り';
            } else {
                document.getElementById('nb-answer-text').innerHTML = `A:${q.正解A} B:${q.正解B}<br>C:${q.正解C} D:${q.正解D} E:${q.正解E}`;
            }
            document.getElementById('nb-article-text').textContent = (q.根拠条文 || "").trim() || "条文なし";
            document.getElementById('nb-explanation-text').innerHTML = (q.解説 || "").trim() || "解説なし";
        } else {
            document.getElementById('nb-answer-text').textContent = "（データ照合中）";
            document.getElementById('nb-article-text').textContent = "";
            document.getElementById('nb-explanation-text').innerHTML = (note.explanationText || "データベースから解説を取得できませんでした。");
        }
        
        // 🌟 PDFジャンプボタンを生成
        insertPdfJumpButton(note.subjectName, note.chapterName);
    }

    const inputArea = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    
    inputArea.innerHTML = note.text || "";
    deleteBtn.classList.remove('hidden');
    
    if (note.image) {
        document.getElementById('nb-image-preview').src = note.image;
        document.getElementById('nb-image-preview-box').classList.remove('hidden');
        document.getElementById('nb-image-preview-box').classList.add('flex');
    } else {
        document.getElementById('nb-image-preview-box').classList.add('hidden');
        document.getElementById('nb-image-preview-box').classList.remove('flex');
    }
    
    document.getElementById('nb-image-input').value = "";
    document.getElementById('notebook-modal').classList.remove('hidden');
    document.getElementById('notebook-modal').classList.add('flex');
    initColorPicker();
}

function formatNotebookText(command) {
    if (command === 'removeFormat') {
        document.execCommand('removeFormat', false, null);
        document.execCommand('hiliteColor', false, 'transparent'); 
        document.execCommand('backColor', false, 'transparent');
    } else if (command === 'highlight') {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('hiliteColor', false, '#fef08a');
        document.execCommand('backColor', false, '#fef08a');
    } else if (command === 'foreColor') {
        const color = document.getElementById('nb-color-picker').value;
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, color);
    } else {
        document.execCommand(command, false, null);
    }
    document.getElementById('nb-note-input').focus();
}

function initColorPicker() {
    const colorPicker = document.getElementById('nb-color-picker');
    const noteInput = document.getElementById('nb-note-input');
    
    colorPicker.replaceWith(colorPicker.cloneNode(true));
    const newColorPicker = document.getElementById('nb-color-picker');
    
    newColorPicker.addEventListener('change', function(e) {
        noteInput.focus();
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, e.target.value);
    });
}

function handleNotebookImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { 
        alert("ファイルサイズが大きすぎます。10MB以下の画像を選択してください。");
        event.target.value = ""; return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1600; const MAX_HEIGHT = 1600;
            let width = img.width; let height = img.height;
            if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
            else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
            
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            currentNotebookImageBase64 = canvas.toDataURL('image/jpeg', 0.6);
            document.getElementById('nb-image-preview').src = currentNotebookImageBase64;
            document.getElementById('nb-image-preview-box').classList.remove('hidden');
            document.getElementById('nb-image-preview-box').classList.add('flex');
            
            const infoArea = document.querySelector('#notebook-modal .overflow-y-auto');
            if(infoArea) infoArea.scrollTop = infoArea.scrollHeight;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeNotebookImage() {
    currentNotebookImageBase64 = null;
    document.getElementById('nb-image-input').value = "";
    document.getElementById('nb-image-preview-box').classList.add('hidden');
    document.getElementById('nb-image-preview-box').classList.remove('flex');
    document.getElementById('nb-image-preview').src = "";
}

// 🌟 保存処理（GASへ送信して容量限界を突破）
async function saveNotebookEntry() {
    const noteHtml = document.getElementById('nb-note-input').innerHTML.trim();
    if (!noteHtml && !currentNotebookImageBase64) {
        alert("メモを入力するか、画像を添付してください。");
        return;
    }

    const saveBtn = document.querySelector('button[onclick="saveNotebookEntry()"]');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = "⏳ 保存・同期中...";
    saveBtn.disabled = true;

    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const existingNote = storedNotes[currentNotebookId] || {};
    
    let newNote = {};
    if (isFreeNoteMode) {
        const subj = document.getElementById('nb-free-subject-select').value;
        const chap = document.getElementById('nb-free-chapter-select').value;
        newNote = {
            ...existingNote,
            id: currentNotebookId,
            type: "フリーノート",
            subjectName: subj,
            chapterName: chap,
            text: noteHtml, 
            image: currentNotebookImageBase64,
            timestamp: new Date().toISOString()
        };
    } else {
        let subj = existingNote.subjectName;
        let chap = existingNote.chapterName;
        let qType = existingNote.type;
        let pText = existingNote.problemText;
        let eText = existingNote.explanationText;

        if (!existingNote.id) {
            const q = currentQuestions[currentIndex];
            if (q) {
                subj = q._subjectName;
                chap = q.項目 || "分類なし";
                qType = q._type;
                pText = q.問題文;
                eText = q.解説;
            }
        }

        newNote = {
            ...existingNote,
            id: currentNotebookId,
            type: qType,
            subjectName: subj,
            chapterName: chap,
            problemText: pText,
            explanationText: eText,
            text: noteHtml,
            image: currentNotebookImageBase64,
            timestamp: new Date().toISOString()
        };
    }

    try {
        // 🌟 GASへ送信してドライブに画像を保存
        if (NOTEBOOK_GAS_URL && !NOTEBOOK_GAS_URL.includes("ここに")) {
            const res = await fetch(NOTEBOOK_GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'save_notebook', ...newNote })
            });
            const data = await res.json();
            if (data.success && data.data.imageUrl) {
                newNote.image = data.data.imageUrl; // 返ってきたドライブURLに差し替え
                currentNotebookImageBase64 = data.data.imageUrl;
            }
        }

        // ローカルを更新
        storedNotes[currentNotebookId] = newNote;
        localStorage.setItem('user_notebooks', JSON.stringify(storedNotes));
        
        closeNotebookModal();
        if (typeof updateNotebookButtonDisplay === "function" && !isFreeNoteMode) updateNotebookButtonDisplay(currentNotebookId);
        if (typeof updateStartScreenNotebookBadge === "function") updateStartScreenNotebookBadge();
        if (typeof generateAiMessage === "function") generateAiMessage("notebook_saved", { textOnly: true });

    } catch (e) {
        alert("保存に失敗しました。通信環境を確認してください。");
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

async function deleteCurrentNotebookEntry() {
    if(!confirm("このノートを完全に削除しますか？")) return;
    
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    if(storedNotes[currentNotebookId]) {
        delete storedNotes[currentNotebookId];
        localStorage.setItem('user_notebooks', JSON.stringify(storedNotes));
    }
    
    // GAS側にも削除を通知
    if (NOTEBOOK_GAS_URL && !NOTEBOOK_GAS_URL.includes("ここに")) {
        try {
            fetch(NOTEBOOK_GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'delete_notebook', id: currentNotebookId }) });
        } catch(e) {}
    }

    closeNotebookModal();
    if (typeof updateNotebookButtonDisplay === "function" && !isFreeNoteMode) updateNotebookButtonDisplay(currentNotebookId);
    if (typeof updateStartScreenNotebookBadge === "function") updateStartScreenNotebookBadge();
}

function closeNotebookModal() {
    document.getElementById('notebook-modal').classList.add('hidden');
    document.getElementById('notebook-modal').classList.remove('flex');
}

function updateNotebookButtonDisplay(q_id) {
    const btnText = document.getElementById('btn-nb-text');
    const btn = document.getElementById('btn-open-notebook');
    if(!btnText || !btn) return;
    
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    if (storedNotes[q_id]) {
        btnText.textContent = "保存済みのマイノートを見る / 編集";
        btn.classList.remove('from-amber-400', 'to-amber-500', 'border-amber-300', 'text-amber-950');
        btn.classList.add('from-indigo-100', 'to-indigo-200', 'border-indigo-300', 'text-indigo-900');
    } else {
        btnText.textContent = "マイノートにメモ・スクショを追加";
        btn.classList.remove('from-indigo-100', 'to-indigo-200', 'border-indigo-300', 'text-indigo-900');
        btn.classList.add('from-amber-400', 'to-amber-500', 'border-amber-300', 'text-amber-950');
    }
}

function updateStartScreenNotebookBadge() {
    const badge = document.getElementById('start-nb-count-badge');
    const nbListCount = document.getElementById('nb-list-count');
    if(!badge) return;
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const count = Object.keys(storedNotes).length;
    badge.textContent = count;
    if(nbListCount) nbListCount.textContent = count + "件";
}

function openNotebookListModal() {
    const container = document.getElementById('nb-list-container');
    container.innerHTML = "";
    
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const notesArray = Object.values(storedNotes);
    
    if (notesArray.length === 0) {
        container.innerHTML = `<div class="text-center p-10 text-slate-400 font-bold">まだ保存されたノートはありません。<br>解説画面の「マイノートに追加」や「新規フリーノート作成」から作ってみましょう！</div>`;
    } else {
        const grouped = {};
        notesArray.forEach(n => {
            const subj = n.subjectName || "その他";
            const chap = n.chapterName || "分類なし";
            if (!grouped[subj]) grouped[subj] = {};
            if (!grouped[subj][chap]) grouped[subj][chap] = [];
            grouped[subj][chap].push(n);
        });
        
        let html = "";
        for (let subj in grouped) {
            html += `<h4 class="text-lg md:text-xl font-black text-white bg-indigo-800 px-4 py-2 rounded-xl mt-4 shadow-sm">${subj}</h4>`;
            for (let chap in grouped[subj]) {
                html += `<div class="ml-2 md:ml-4 mt-3 border-l-4 border-indigo-200 pl-3 md:pl-4 flex flex-col gap-3">`;
                html += `<h5 class="text-sm md:text-lg font-bold text-slate-700">${chap}</h5>`;
                
                grouped[subj][chap].forEach(note => {
                    const date = new Date(note.timestamp).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    const isFree = (note.type === "フリーノート");
                    const typeBadge = isFree ? 
                        `<span class="bg-amber-100 text-amber-800 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded border border-amber-300">フリーノート</span>` :
                        `<span class="bg-pink-100 text-pink-800 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded border border-pink-300">問題連携 (${note.type})</span>`;
                    
                    html += `
                        <div onclick="editNoteFromList('${note.id}')" class="bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all relative cursor-pointer active:scale-[0.99]">
                            <button onclick="event.stopPropagation(); deleteNoteFromList('${note.id}')" class="absolute top-3 right-3 text-slate-300 hover:text-red-500 font-bold p-1 transition-colors z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-slate-100" title="削除">✕</button>
                            <div class="flex items-center gap-2 mb-2 pr-10">
                                ${typeBadge}
                                <span class="text-[10px] md:text-xs text-slate-400 font-bold">${date}</span>
                                <span class="text-[10px] md:text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 ml-auto font-black shadow-sm">✏️ 編集</span>
                            </div>`;
                            
                    if (!isFree && note.problemText) {
                        html += `<p class="text-xs md:text-sm text-slate-500 font-medium mb-3 line-clamp-2 italic border-l-2 border-slate-200 pl-2 pointer-events-none">${note.problemText}</p>`;
                    }
                    
                    if (note.text) {
                        html += `<div class="text-sm md:text-base text-slate-800 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-3 pointer-events-none">${note.text}</div>`;
                    }
                    if (note.image) {
                        html += `<img src="${note.image}" class="max-h-48 md:max-h-64 rounded-lg object-contain shadow-sm border border-slate-200 cursor-pointer relative z-10 mt-2" onclick="event.stopPropagation(); window.open('${note.image}', '_blank')">`;
                    }
                    html += `</div>`;
                });
                html += `</div>`;
            }
        }
        container.innerHTML = html;
    }
    
    document.getElementById('notebook-list-modal').classList.remove('hidden');
    document.getElementById('notebook-list-modal').classList.add('flex');
}

function closeNotebookListModal() {
    document.getElementById('notebook-list-modal').classList.add('hidden');
    document.getElementById('notebook-list-modal').classList.remove('flex');
}

function deleteNoteFromList(noteId) {
    if(!confirm("このノートを削除しますか？")) return;
    
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    if(storedNotes[noteId]) {
        delete storedNotes[noteId];
        localStorage.setItem('user_notebooks', JSON.stringify(storedNotes));
    }
    
    if (NOTEBOOK_GAS_URL && !NOTEBOOK_GAS_URL.includes("ここに")) {
        try {
            fetch(NOTEBOOK_GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'delete_notebook', id: noteId }) });
        } catch(e) {}
    }
    
    updateStartScreenNotebookBadge();
    openNotebookListModal(); 
}