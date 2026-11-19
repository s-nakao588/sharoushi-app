/* =========================================================
   📓 マイノート・フリーノート管理モジュール (GAS同期＆GitHub PDF連携版)
   ========================================================= */

// 🌟 マイノート用GASのウェブアプリURL
const NOTEBOOK_GAS_URL = "https://script.google.com/macros/s/AKfycbyXgXlK8FpQZqqvvu7dxS4htbPlB9FJeJySls4GM0ZZlDrlvKCy4QXiXUV6OdrrveA5/exec";

// 🌟 各科目のテキストPDFと、項目ごとの「ファイル名」および「開始ページ」の自動振り分け辞書
const TEXTBOOK_PDF_CONFIG = {
    "労働基準法": {
        "chapters": {
            "1 労働基準法の基本理念": { page: 8, file: "rouki.pdf" },
            "2 労働契約": { page: 20, file: "rouki.pdf" },
            "3 賃金、賃金の支払の5原則": { page: 37, file: "rouki.pdf" },
            "4 労働時間、休憩、休日": { page: 49, file: "rouki.pdf" },
            "5 労働時間、変形労働時間制": { page: 60, file: "rouki.pdf" },
            "6 時間外・休日労働、割増賃金": { page: 70, file: "rouki.pdf" },
            "労働時間の計算等": { page: 83, file: "rouki.pdf" },
            "8 年次有給休暇": { page: 89, file: "rouki.pdf" },
            "9 年少者、妊産婦等": { page: 97, file: "rouki.pdf" },
            "就業規則、監督等その他": { page: 108, file: "rouki.pdf" },
            "雑則等": { page: 112, file: "rouki.pdf" }
        }
    },
    "安全衛生法": {
        "chapters": {
            "1 総則等": { page: 128, file: "anei.pdf" },
            "1 安全衛生管理体制等": { page: 131, file: "anei.pdf" },
            "2 機械等及び危険・有害物に関する規制": { page: 159, file: "anei.pdf" },
            "3 労働者の就業管理・健康管理等": { page: 178, file: "anei.pdf" }
        }
    },
    "健康保険法": {
        "chapters": {
            "1 保険者・適用事業所等": { page: 8, file: "kennkou1.pdf" },
            "2 被保険者・被扶養者": { page: 20, file: "kennkou1.pdf" },
            "3 報酬・標準報酬月額等": { page: 47, file: "kennkou1.pdf" },
            "届出・通知等": { page: 22, file: "kennkou1.pdf" },
            "保険医療機関等・療養担当者": { page: 41, file: "kennkou1.pdf" },
            "4 保険給付 1 (療養の給付等)": { page: 62, file: "kennkou1.pdf" },
            "5 保険給付 2 (現金給付・資格喪失後の給付等)": { page: 87, file: "kennkou1.pdf" },
            "費用の負担・保険料等": { page: 103, file: "kennkou2.pdf" },
            "日雇特例・保健福祉事業": { page: 122, file: "kennkou2.pdf" },
            "時効・不服申立て・雑則等": { page: 137, file: "kennkou2.pdf" }
        }
    },
    "厚生年金保険法": {
        "chapters": {
            "1 総則・適用事業所等": { page: 284, file: "kousei1.pdf" },
            "2 被保険者・被保険者期間等": { page: 289, file: "kousei1.pdf" },
            "3 標準報酬等": { page: 307, file: "kousei1.pdf" },
            "6 老齢厚生年金": { page: 314, file: "kousei1.pdf" },
            "7 障害厚生年金・障害手当金": { page: 345, file: "kousei1.pdf" },
            "8 遺族厚生年金・脱退一時金": { page: 357, file: "kousei1.pdf" },
            "9 年金分割の特例": { page: 372, file: "kousei2.pdf" },
            "4 給付通則等": { page: 379, file: "kousei2.pdf" },
            "5 費用の負担・保険料等": { page: 390, file: "kousei2.pdf" },
            "10 不服申立て・雑則等": { page: 390, file: "kousei2.pdf" }
        }
    }
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

// 🌟 PDFジャンプボタンとページ数入力欄を動的にHTMLへ挿入する関数
function insertPdfJumpButton(subjectName, chapterName, savedPage = null) {
    const existingArea = document.getElementById('dynamic-pdf-area');
    if (existingArea) existingArea.remove(); // 過去のものをリセット

    let baseSubj = subjectName.replace(/\(択一\)|\(選択\)/g, "").trim();
    
    // 設定がない場合は表示しない
    if (!TEXTBOOK_PDF_CONFIG[baseSubj]) return;
    
    const chapConfig = TEXTBOOK_PDF_CONFIG[baseSubj].chapters[chapterName];
    if (!chapConfig) return; // 項目設定がない場合は表示しない
    
    let defaultPage = chapConfig.page;
    const pdfUrl = `https://s-nakao588.github.io/sharoushi-app/${chapConfig.file}`;
    
    // 保存済みのページ指定があれば優先、なければデフォルトの章開始ページ
    let displayPage = savedPage || defaultPage;
    
    const html = `
        <div id="dynamic-pdf-area" class="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <label class="text-xs md:text-sm font-black text-blue-800">📖 参照ページ:</label>
                <input type="number" id="nb-page-input" value="${displayPage}" class="w-16 md:w-20 p-1 border-2 border-blue-300 rounded text-center font-bold text-blue-900 focus:outline-none focus:border-blue-500">
                <span class="text-[10px] md:text-xs text-blue-600 font-bold">※好きな数字に変更して保存できます</span>
            </div>
            <button onclick="openPdfPage('${pdfUrl}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 md:py-3 rounded-lg shadow active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                <span>テキストの該当ページを開く</span>
            </button>
        </div>
    `;
    
    const infoArea = document.getElementById('nb-question-info-area');
    if (infoArea) {
        infoArea.insertAdjacentHTML('beforeend', html);
    }
}

// 🌟 PDFを別タブで開く（ページ指定つき）
function openPdfPage(baseUrl) {
    const pageInput = document.getElementById('nb-page-input');
    let page = pageInput ? pageInput.value : "";
    let finalUrl = baseUrl;
    if (page) {
        finalUrl += `#page=${page}`; // PDFビューア用のページ指定パラメータ
    }
    window.open(finalUrl, '_blank');
}

// 🌟 隠しタグからページ番号を抽出して本文から消す処理
function extractSavedPageAndCleanHtml(rawHtml) {
    let savedPage = null;
    let cleanHtml = rawHtml;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;
    const hiddenTag = tempDiv.querySelector('#hidden-page-data');
    
    if (hiddenTag) {
        savedPage = hiddenTag.getAttribute('data-page');
        hiddenTag.remove();
        cleanHtml = tempDiv.innerHTML.trim();
    }
    return { savedPage, cleanHtml };
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

    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const existingNote = storedNotes[currentNotebookId];

    const inputArea = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    
    let savedPage = null;
    if (existingNote) {
        // 🌟 隠しタグからページ番号を抽出
        const extracted = extractSavedPageAndCleanHtml(existingNote.text || "");
        savedPage = extracted.savedPage;
        inputArea.innerHTML = extracted.cleanHtml; 
        
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
    
    // 🌟 PDFジャンプボタンとページ数入力欄を生成（抽出したページ番号を渡す）
    insertPdfJumpButton(q._subjectName, q.項目, savedPage);

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
    }

    const inputArea = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    
    // 🌟 隠しタグからページ番号を抽出
    const extracted = extractSavedPageAndCleanHtml(note.text || "");
    const savedPage = extracted.savedPage;
    inputArea.innerHTML = extracted.cleanHtml; 
    
    deleteBtn.classList.remove('hidden');
    
    if (note.image) {
        document.getElementById('nb-image-preview').src = note.image;
        document.getElementById('nb-image-preview-box').classList.remove('hidden');
        document.getElementById('nb-image-preview-box').classList.add('flex');
    } else {
        document.getElementById('nb-image-preview-box').classList.add('hidden');
        document.getElementById('nb-image-preview-box').classList.remove('flex');
    }
    
    // 🌟 PDFジャンプボタンを生成（抽出したページ番号を渡す）
    if (!isFreeNoteMode) {
        insertPdfJumpButton(note.subjectName, note.chapterName, savedPage);
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

// 🌟 保存処理（ページ番号を隠しタグとして埋め込み、GASへ送信）
async function saveNotebookEntry() {
    let noteHtml = document.getElementById('nb-note-input').innerHTML.trim();
    if (!noteHtml && !currentNotebookImageBase64) {
        alert("メモを入力するか、画像を添付してください。");
        return;
    }

    // 🌟 入力されたページ番号を取得して隠しタグとして結合
    let pageNum = "";
    const pageInput = document.getElementById('nb-page-input');
    if (pageInput) {
        pageNum = pageInput.value;
    }
    // 古い隠しタグがあれば除去しておく
    noteHtml = noteHtml.replace(/<div id="hidden-page-data".*?<\/div>/g, '');
    if (pageNum) {
        noteHtml += `<div id="hidden-page-data" data-page="${pageNum}" style="display:none;"></div>`;
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
                        // 🌟 一覧画面では隠しタグを取り除いて表示
                        const cleanHtml = extractSavedPageAndCleanHtml(note.text).cleanHtml;
                        html += `<div class="text-sm md:text-base text-slate-800 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-3 pointer-events-none">${cleanHtml}</div>`;
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