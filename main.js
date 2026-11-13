// main.js
const GAS_URL = "https://script.google.com/a/macros/sr-nakao.com/s/AKfycbyHu72D7p9XrmynRKYbt_4HOfhJ47D3xEdv-SgqTWS1iSrxWo6KuhZnzTbMvitQ7r0_Eg/exec";

const SUBJECTS = [
    { id: "rouki", type: "択一", name: "労働基準法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?output=csv" },
    { id: "anei", type: "択一", name: "安全衛生法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=340566361&single=true&output=csv" },
    { id: "kounen", type: "択一", name: "厚生年金保険法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=485008277&single=true&output=csv" },
    { id: "kenpo", type: "択一", name: "健康保険法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=1543277211&single=true&output=csv" },
    { id: "rouki_s", type: "選択", name: "労働基準法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=743168881&single=true&output=csv" },
    { id: "anei_s", type: "選択", name: "安全衛生法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=2064794651&single=true&output=csv" },
    { id: "kenpo_s", type: "選択", name: "健康保険法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=1172602320&single=true&output=csv" },
    { id: "kounen_s", type: "選択", name: "厚生年金保険法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=268551140&single=true&output=csv" }
];

const CATEGORY_MANUAL_MAP = {
    "労働憲章": "1 労働基準法の基本理念", "使用者の定義": "1 労働基準法の基本理念", "基本理念": "1 労働基準法の基本理念",
    "労働契約の締結": "2 労働契約", "労働契約の終了": "2 労働契約", "労働契約等": "2 労働契約",
    "賃金の支払": "3 賃金、賃金の支払の5原則", "賃金": "3 賃金、賃金の支払の5原則",
    "休憩、休日": "4 労働時間、休憩、休日",
    "変形労働時間": "5 労働時間、変形労働時間制",
    "時間外・休日": "6 時間外・休日労働、割増賃金", "時間外労働": "6 時間外・休日労働、割増賃金",
    "みなし労働時間": "労働時間の計算等",
    "年次有給休暇": "8 年次有給休暇",
    "年少者": "9 年少者、妊産婦等", "妊産婦": "9 年少者、妊産婦等",
    "就業規則": "就業規則、監督等その他",
    "選択式": "雑則等", "雑則": "雑則等",
    "非常時払": "非常時払、休業手当、平均賃金等",
    "労使協定": "11 労使協定",
    "総則": "1 総則等",
    "全産業の安全衛生": "1 安全衛生管理体制等", "委員会": "1 安全衛生管理体制等", "安全衛生管理体制": "1 安全衛生管理体制等",
    "機械等に関する": "2 機械等及び危険・有害物に関する規制", "危険物及び有害物": "2 機械等及び危険・有害物に関する規制", "機械等及び危険": "2 機械等及び危険・有害物に関する規制",
    "危険又は健康障害": "3 労働者の就業管理・健康管理等