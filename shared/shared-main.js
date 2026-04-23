// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// Firebase config - configured
let firebaseConfigured = false;
let db = null;
let auth = null;
let currentUser = null;
let gasUrl = null;

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA7PM_NoN67kUAzyzssXpppMh924PEWOGU",
  authDomain: "math-rpg-1eebc.firebaseapp.com",
  databaseURL: "https://math-rpg-1eebc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "math-rpg-1eebc",
  storageBucket: "math-rpg-1eebc.firebasestorage.app",
  messagingSenderId: "838577745797",
  appId: "1:838577745797:web:1a04cd3c51715f16285eec",
  measurementId: "G-0KE6H18XGQ"
};

try {
  firebase.initializeApp(FIREBASE_CONFIG);
  auth = firebase.auth();
  db = firebase.database();
  firebaseConfigured = true;
  console.log('Firebase connected!');
  document.getElementById('firebase-status').style.display = 'block';
  document.getElementById('firebase-status').textContent = '在線';
  document.getElementById('firebase-status').className = 'online';
} catch(e) {
  console.log('Firebase init error - offline mode', e);
  document.getElementById('firebase-status').style.display = 'block';
  document.getElementById('firebase-status').textContent = '離線';
  document.getElementById('firebase-status').className = 'offline';
}

// ============================================================
// QUESTIONS - Phase 1a (original 19) + Phase 1b (40 imported) = 59 total
// ============================================================
const QUESTIONS_ORIGINAL = [
{id:'alg01',topic:'代數',difficulty:1,question:'已知 $b = 3 + a^2$,求當 $a = -6$ 時 $b$ 的值',options:{A:'$39',B:'$-39',C:'$33',D:'$-33$'},answer:'A'},
{id:'alg02',topic:'代數',difficulty:1,question:'以代數式表示 $x$ 的平方與 $y$ 之積',options:{A:'$x^2y$',B:'$x^2+y$',C:'$x^3-y$',D:'$x^3y$'},answer:'A'},
{id:'alg03',topic:'代數',difficulty:1,question:'計算 $\\frac{5}{8} + 0.65$ 的值',options:{A:'1.275',B:'0.775',C:'1.175',D:'0.675'},answer:'A'},
{id:'alg04',topic:'代數',difficulty:1,question:'化簡 $7r - 8 - 4r + 3$',options:{A:'$3r - 5$',B:'$3r - 11$',C:'$11r - 5$',D:'$11r - 11$'},answer:'A'},
{id:'alg05',topic:'代數',difficulty:1,question:'解方程 $5x + 3 = 8$',options:{A:'$x = 1$',B:'$x = 5$',C:'$x = 11$',D:'$x = -1$'},answer:'A'},
{id:'alg06',topic:'代數',difficulty:2,question:'計算 $\\frac{(+6) + (-8)}{(-2)}$ 的值',options:{A:'-8',B:'-4',C:'1',D:'4'},answer:'C'},
{id:'alg07',topic:'代數',difficulty:2,question:'$-11 + 5 - 1$ 的值為',options:{A:'-7',B:'-5',C:'7',D:'-13'},answer:'A'},
{id:'alg08',topic:'代數',difficulty:2,question:'$(+23) - (-19)$ 的值為',options:{A:'-42',B:'42',C:'-4',D:'4'},answer:'B'},
{id:'geo01',topic:'幾何',difficulty:1,question:'已知直角三角形的兩直角邊為 3 和 4,求斜邊',options:{A:'5',B:'6',C:'7',D:'12'},answer:'A'},
{id:'geo02',topic:'幾何',difficulty:1,question:'圓形的半徑為 7,其面積為',options:{A:'$14\\pi$',B:'$49\\pi$',C:'$7\\pi$',D:'$28\\pi$'},answer:'B'},
{id:'geo03',topic:'幾何',difficulty:1,question:'正方形的邊長為 5,周界為',options:{A:'15',B:'20',C:'25',D:'10'},answer:'B'},
{id:'geo04',topic:'幾何',difficulty:2,question:'三角形的內角和為',options:{A:'90°',B:'180°',C:'270°',D:'360°'},answer:'B'},
{id:'geo05',topic:'幾何',difficulty:2,question:'長方形的長為 8,闊為 3,面積為',options:{A:'11',B:'22',C:'24',D:'8'},answer:'C'},
{id:'stat01',topic:'統計',difficulty:1,question:'下列哪個是平均數的公式?',options:{A:'$\\bar{x}=\\frac{\\SUM x}{n}$',B:'$\\bar{x}=\\SUM x \\cdot n$',C:'$\\bar{x}=\\frac{n}{\\SUM x}$',D:'$\\bar{x}=\\SUM x + n$'},answer:'A'},
{id:'stat02',topic:'統計',difficulty:1,question:'數據 2, 4, 6, 8 的平均數為',options:{A:'4',B:'5',C:'6',D:'8'},answer:'B'},
{id:'stat03',topic:'統計',difficulty:2,question:'一組數據 3, 3, 3, 3 的眾數為',options:{A:'0',B:'3',C:'12',D:'無法確定'},answer:'B'},
{id:'stat04',topic:'統計',difficulty:2,question:'數據 1, 2, 3, 4, 5 的中位數為',options:{A:'2',B:'3',C:'4',D:'5'},answer:'B'},
{id:'stat05',topic:'統計',difficulty:1,question:'一副撲克牌有 52 張,抽到紅色的概率為',options:{A:'$\\frac{1}{2}$',B:'$\\frac{1}{4}$',C:'$\\frac{1}{3}$',D:'$\\frac{2}{3}$'},answer:'A'},
];

const QUESTIONS_PHASE1B = [
{id:'imp001',topic:'代數',difficulty:1,question:'$-11 + 5 - 1 =$',options:{A:'$-7$',B:'$3$',C:'$39$',D:'$21$'},answer:'A'},
{id:'imp002',topic:'代數',difficulty:1,question:'$(+23) - (-19) =$',options:{A:'$42$',B:'$43$',C:'$44$',D:'$47$'},answer:'A'},
{id:'imp003',topic:'代數',difficulty:1,question:'$45 \\div (-9) =$',options:{A:'$-5$',B:'$5$',C:'$38$',D:'$5$'},answer:'A'},
{id:'imp004',topic:'代數',difficulty:1,question:'化簡 $7r - 8 - 4r + 3$',options:{A:'$3r-5$',B:'$72$',C:'$41$',D:'$12$'},answer:'A'},
{id:'imp005',topic:'代數',difficulty:1,question:'化簡 $x^6 \\times x^2$',options:{A:'$x^8$',B:'$25$',C:'$26$',D:'$70$'},answer:'A'},
{id:'imp006',topic:'代數',difficulty:1,question:'解方程 $5x + 3 = 8$',options:{A:'$1$',B:'$2$',C:'$3$',D:'$6$'},answer:'A'},
{id:'imp007',topic:'代數',difficulty:2,question:'化簡 $\\frac{(+6)+(-8)}{(-2)}$',options:{A:'$1$',B:'$2$',C:'$3$',D:'$6$'},answer:'A'},
{id:'imp008',topic:'代數',difficulty:1,question:'化簡 $x^{10} \\cdot x^3$',options:{A:'$x^13$',B:'$83$',C:'$2$',D:'$68$'},answer:'A'},
{id:'imp009',topic:'代數',difficulty:2,question:'化簡 $(6a+2b)-(8a-5b)$',options:{A:'$-2a+7b$',B:'$40$',C:'$93$',D:'$95$'},answer:'A'},
{id:'imp010',topic:'代數',difficulty:2,question:'已知 $b=3+a^2$,若 $a=-6$,求 $b$',options:{A:'$39$',B:'$40$',C:'$41$',D:'$44$'},answer:'A'},
{id:'imp011',topic:'代數',difficulty:2,question:'已知 $x=9y-13$,若 $y=-2$,求 $x$',options:{A:'$-31$',B:'$50$',C:'$19$',D:'$22$'},answer:'A'},
{id:'imp012',topic:'代數',difficulty:2,question:'化簡 $x^2+3x-(2x^2-5x)$',options:{A:'$-x^2+8x$',B:'$68$',C:'$42$',D:'$75$'},answer:'A'},
{id:'imp013',topic:'代數',difficulty:1,question:'求 12 和 18 的最小公倍數',options:{A:'$36$',B:'$37$',C:'$38$',D:'$41$'},answer:'A'},
{id:'imp014',topic:'統計',difficulty:1,question:'把 $\\frac{3}{20}$ 化為百分數',options:{A:'$15%$',B:'$20%$',C:'$25%$',D:'$10%$'},answer:'A'},
{id:'imp015',topic:'統計',difficulty:1,question:'寫出 $A(5,-8)$ 的 $y$ 坐標',options:{A:'$-8$',B:'$2$',C:'$11$',D:'$34$'},answer:'A'},
{id:'imp016',topic:'代數',difficulty:2,question:'計算 $\\frac{5}{8}+0.65$ 的值',options:{A:'$1.275$',B:'$2.27$',C:'$3.27$',D:'$6.28$'},answer:'A'},
{id:'imp017',topic:'代數',difficulty:1,question:'以代數式表示 $x$ 的平方與 $y$ 之積',options:{A:'$x^2y$',B:'$x^2+y$',C:'$x^3-y$',D:'$x^3y$'},answer:'A'},
{id:'imp018',topic:'代數',difficulty:2,question:'展開 $(x+3)(x-5)$',options:{A:'$x^2-2x-15$',B:'$35$',C:'$5$',D:'$91$'},answer:'A'},
{id:'imp019',topic:'代數',difficulty:1,question:'展開 $8(3a-b)$',options:{A:'$24a-8b$',B:'$7$',C:'$44$',D:'$53$'},answer:'A'},
{id:'imp020',topic:'代數',difficulty:1,question:'解方程 $15-2x=7$',options:{A:'$4$',B:'$5$',C:'$6$',D:'$9$'},answer:'A'},
{id:'imp021',topic:'代數',difficulty:2,question:'解方程 $9+2x=18-x$',options:{A:'$3$',B:'$4$',C:'$5$',D:'$8$'},answer:'A'},
{id:'imp022',topic:'代數',difficulty:2,question:'解方程 $7-3x=-8$',options:{A:'$5$',B:'$6$',C:'$7$',D:'$10$'},answer:'A'},
{id:'imp023',topic:'幾何',difficulty:1,question:'三角形的內角和為',options:{A:'$180°$',B:'$62$',C:'$30$',D:'$12$'},answer:'A'},
{id:'imp024',topic:'幾何',difficulty:1,question:'直角三角形兩直角邊為 3 和 4,斜邊為',options:{A:'$5$',B:'$6$',C:'$7$',D:'$10$'},answer:'A'},
{id:'imp025',topic:'幾何',difficulty:1,question:'圓的半徑為 7,面積為',options:{A:'$49\\pi$',B:'$98\\pi$',C:'$24\\pi$',D:'$54\\pi$'},answer:'A'},
{id:'imp026',topic:'幾何',difficulty:1,question:'正方形邊長為 5,周界為',options:{A:'$20$',B:'$21$',C:'$22$',D:'$25$'},answer:'A'},
{id:'imp027',topic:'幾何',difficulty:1,question:'長方形長為 8 闊為 3,面積為',options:{A:'$24$',B:'$25$',C:'$26$',D:'$29$'},answer:'A'},
{id:'imp028',topic:'統計',difficulty:1,question:'一副撲克牌有 52 張,抽到紅色的概率為',options:{A:'$\\frac{1}{2}$',B:'$\\frac{1}{4}$',C:'$\\frac{1}{3}$',D:'$\\frac{2}{3}$'},answer:'A'},
{id:'imp029',topic:'統計',difficulty:1,question:'數據 2, 4, 6, 8 的平均數為',options:{A:'$5$',B:'$6$',C:'$7$',D:'$10$'},answer:'A'},
{id:'imp030',topic:'統計',difficulty:1,question:'數據 1, 2, 3, 4, 5 的中位數為',options:{A:'$3$',B:'$4$',C:'$5$',D:'$8$'},answer:'A'},
{id:'imp031',topic:'統計',difficulty:1,question:'數據 3, 3, 3, 3 的眾數為',options:{A:'$3$',B:'$4$',C:'$5$',D:'$8$'},answer:'A'},
{id:'imp032',topic:'代數',difficulty:2,question:'寫出 50 的質因數連乘式',options:{A:'$2\\times5^2$',B:'$73$',C:'$63$',D:'$42$'},answer:'A'},
{id:'imp033',topic:'統計',difficulty:2,question:'某學校有 60%學生是初中生,初中生中 45%是男生,求隨機選出一個學生的概率',options:{A:'$0.27$',B:'$1.27$',C:'$2.27$',D:'$5.27$'},answer:'A'},
{id:'imp034',topic:'代數',difficulty:3,question:'小敏把$120000存入銀行,年利率 2.4%,每月複利,1年後可得利息(準確至最接近的元)',options:{A:'$2912$',B:'$2913$',C:'$2914$',D:'$2917$'},answer:'A'},
{id:'imp035',topic:'代數',difficulty:3,question:'若 $(x-5)+x-3 \\equiv Ax^2+Bx+C$,求 $B^2-A^2$',options:{A:'$5$',B:'$6$',C:'$7$',D:'$10$'},answer:'A'},
{id:'imp036',topic:'代數',difficulty:2,question:'求直線 $5x+9y-1=0$ 的 x 截距',options:{A:'$\\frac{1}{5}$',B:'$83$',C:'$13$',D:'$47$'},answer:'A'},
{id:'imp037',topic:'代數',difficulty:3,question:'cos$(90°-A)$·cos$(-A)$/sin$(360°-A)$ =',options:{A:'$-cotA$',B:'$27$',C:'$97$',D:'$85$'},answer:'A'},
{id:'imp038',topic:'代數',difficulty:2,question:'求方程 $2x^2-6-3x=0$ 的判別式',options:{A:'$57$',B:'$58$',C:'$59$',D:'$62$'},answer:'A'},
{id:'imp039',topic:'代數',difficulty:2,question:'解方程 $8x^3=\\frac{1}{216}$',options:{A:'$\\frac{1}{2}$',B:'$11$',C:'$4$',D:'$8$'},answer:'A'},
{id:'imp040',topic:'代數',difficulty:3,question:'若 $y$ 隨 $x^2$ 正變,$x$ 增加 15%,$y$ 增加多少',options:{A:'$32.25%$',B:'$37%$',C:'$42%$',D:'$27%$'},answer:'A'},
];

// Combined: all questions
const ALL_QUESTIONS = [...QUESTIONS_ORIGINAL, ...QUESTIONS_PHASE1B];
console.log(`Total questions loaded: ${ALL_QUESTIONS.length}`);

// Phase 2 new questions (12 rooms, new topics)
const QUESTIONS_PHASE2 = [
  // 概率 (1 existing + 4 new)
  {id:'prob01',topic:'概率',difficulty:1,question:'擲一枚硬幣，出現正面既概率係',options:{A:'$\frac{1}{3}$',B:'$\frac{1}{2}$',C:'$\frac{2}{3}$',D:'1'},answer:'B'},
  {id:'prob02',topic:'概率',difficulty:1,question:'袋中有 3 個紅球、2 個藍球，隨機拎一個，拎到紅球既概率係',options:{A:'$\frac{2}{5}$',B:'$\frac{3}{5}$',C:'$\frac{1}{2}$',D:'$\frac{3}{2}$'},answer:'B'},
  {id:'prob03',topic:'概率',difficulty:2,question:'擲兩枚硬幣，至少有一個係反面既概率係',options:{A:'$\frac{1}{4}$',B:'$\frac{1}{2}$',C:'$\frac{3}{4}$',D:'$\frac{1}{3}$'},answer:'C'},
  {id:'prob04',topic:'概率',difficulty:2,question:'擲一枚骰仔，擲到 3 或 5 既概率係',options:{A:'$\frac{1}{6}$',B:'$\frac{1}{3}$',C:'$\frac{1}{2}$',D:'$\frac{2}{3}$'},answer:'B'},
  // 函數 (1 existing + 4 new)
  {id:'func01',topic:'函數',difficulty:1,question:'若 $f(x)=3x+2$, 求 $f(4)$',options:{A:'14',B:'12',C:'10',D:'8'},answer:'A'},
  {id:'func02',topic:'函數',difficulty:2,question:'若 $g(x)=x^2-1$, 求 $g(-3)$',options:{A:'8',B:'6',C:'10',D:'12'},answer:'A'},
  {id:'func03',topic:'函數',difficulty:2,question:'函數 $y=2x-5$ 當 $x=0$ 時，$y$ 等於',options:{A:'5',B:'-5',C:'2',D:'-2'},answer:'B'},
  {id:'func04',topic:'函數',difficulty:3,question:'若 $f(x)=x^2+3x$, 求 $f(2)-f(1)$',options:{A:'6',B:'7',C:'8',D:'9'},answer:'A'},
  // 方程 (1 existing + 4 new)
  {id:'eq01',topic:'方程',difficulty:1,question:'解方程 $2x+6=14$',options:{A:'$x=4$',B:'$x=5$',C:'$x=3$',D:'$x=2$'},answer:'A'},
  {id:'eq02',topic:'方程',difficulty:2,question:'解方程 $3x-5=16$',options:{A:'$x=7$',B:'$x=6$',C:'$x=5$',D:'$x=8$'},answer:'A'},
  {id:'eq03',topic:'方程',difficulty:2,question:'解方程 $5x+3=2x+15$',options:{A:'$x=4$',B:'$x=3$',C:'$x=5$',D:'$x=2$'},answer:'A'},
  {id:'eq04',topic:'方程',difficulty:2,question:'若 $4(x-1)=12$, 求 $x$',options:{A:'$x=4$',B:'$x=3$',C:'$x=5$',D:'$x=2$'},answer:'A'},
  // 面積 (1 existing + 4 new)
  {id:'area01',topic:'面積',difficulty:1,question:'長方形長 8cm，闊 5cm，求面積',options:{A:'40 cm²',B:'26 cm²',C:'13 cm²',D:'20 cm²'},answer:'A'},
  {id:'area02',topic:'面積',difficulty:1,question:'正方形邊長 7cm，求面積',options:{A:'49 cm²',B:'28 cm²',C:'14 cm²',D:'21 cm²'},answer:'A'},
  {id:'area03',topic:'面積',difficulty:2,question:'長方形面積 36 cm²，長 9cm，闊幾多？',options:{A:'4cm',B:'5cm',C:'6cm',D:'3cm'},answer:'A'},
  {id:'area04',topic:'面積',difficulty:2,question:'三角形底 10cm，高 6cm，求面積',options:{A:'30 cm²',B:'60 cm²',C:'15 cm²',D:'45 cm²'},answer:'A'},
  // 坐標 (1 existing + 4 new)
  {id:'coord01',topic:'坐標',difficulty:1,question:'點 $(3,4)$ 在第幾象限？',options:{A:'第一象限',B:'第二象限',C:'第三象限',D:'第四象限'},answer:'A'},
  {id:'coord02',topic:'坐標',difficulty:2,question:'點 $(2,-5)$ 的 $y$ 坐標係',options:{A:'2',B:'-5',C:'5',D:'-2'},answer:'B'},
  {id:'coord03',topic:'坐標',difficulty:2,question:'兩點 $(1,2)$ 同 $(1,8)$ 之間既距離係',options:{A:'6',B:'7',C:'8',D:'9'},answer:'A'},
  {id:'coord04',topic:'坐標',difficulty:2,question:'點 $(3,0)$ 位於 $x$ 軸上嗎？',options:{A:'是',B:'否',C:'不能確定',D:'以上皆非'},answer:'A'},
  // 比率 (1 existing + 4 new)
  {id:'ratio01',topic:'比率',difficulty:1,question:'比例 $3:4 = 6:x$ 中 $x$ 既值係',options:{A:'8',B:'6',C:'4',D:'12'},answer:'A'},
  {id:'ratio02',topic:'比率',difficulty:2,question:'若 $a:b=5:3$，且 $a=15$，求 $b$',options:{A:'9',B:'12',C:'6',D:'10'},answer:'A'},
  {id:'ratio03',topic:'比率',difficulty:2,question:'男：女 = 4：5，全班 36 人，女生有幾多人？',options:{A:'20',B:'16',C:'15',D:'18'},answer:'A'},
  {id:'ratio04',topic:'比率',difficulty:2,question:'若 $x:y=2:3$，且 $x+y=25$，求 $x$',options:{A:'10',B:'8',C:'12',D:'15'},answer:'A'},
  // 數列 (1 existing + 4 new)
  {id:'seq01',topic:'數列',difficulty:1,question:'數列 2,5,8,11,... 第5項係',options:{A:'14',B:'15',C:'17',D:'13'},answer:'A'},
  {id:'seq02',topic:'數列',difficulty:2,question:'等差數列 3,7,11,... 第10項',options:{A:'39',B:'40',C:'41',D:'42'},answer:'A'},
  {id:'seq03',topic:'數列',difficulty:2,question:'等比數列 2,6,18,... 第4項係',options:{A:'54',B:'36',C:'72',D:'108'},answer:'A'},
  {id:'seq04',topic:'數列',difficulty:2,question:'數列 1,4,9,16,... 第6項係',options:{A:'36',B:'25',C:'49',D:'30'},answer:'A'},
  // 百分率 (1 existing + 4 new)
  {id:'pct01',topic:'百分率',difficulty:1,question:'$25\%$ 等於',options:{A:'$\frac{1}{4}$',B:'$\frac{1}{3}$',C:'$\frac{1}{2}$',D:'$\frac{2}{5}$'},answer:'A'},
  {id:'pct02',topic:'百分率',difficulty:2,question:'$80$ 既 $20\%$ 係幾多？',options:{A:'16',B:'20',C:'12',D:'8'},answer:'A'},
  {id:'pct03',topic:'百分率',difficulty:2,question:'若 $150$ 係 $x\%$ 的 $75$，求 $x$',options:{A:'50',B:'40',C:'60',D:'75'},answer:'A'},
  {id:'pct04',topic:'百分率',difficulty:2,question:'$200$ 既 $15\%$ 係',options:{A:'30',B:'20',C:'15',D:'25'},answer:'A'},
  // 近似值 (1 existing + 4 new)
  {id:'approx01',topic:'近似值',difficulty:1,question:'將 $3.14159$ 近似至小數點後兩位',options:{A:'3.14',B:'3.15',C:'3.16',D:'3.14'},answer:'A'},
  {id:'approx02',topic:'近似值',difficulty:2,question:'將 $4.567$ 近似至小數點後一位',options:{A:'4.6',B:'4.5',C:'4.7',D:'4.57'},answer:'A'},
  {id:'approx03',topic:'近似值',difficulty:2,question:'$12.347$ 四捨五入至小數點後一位',options:{A:'12.3',B:'12.4',C:'12.35',D:'12.0'},answer:'A'},
  {id:'approx04',topic:'近似值',difficulty:2,question:'將 $0.999$ 近似至小數點後兩位',options:{A:'1.00',B:'0.99',C:'1.0',D:'0.90'},answer:'A'},
];

// Merge Phase 2 questions
ALL_QUESTIONS.push(...QUESTIONS_PHASE2);
console.log(`Total questions after Phase 2: ${ALL_QUESTIONS.length}`);

// ============================================================
// PHASE 4 - OCR IMPORTED QUESTIONS (S1 + S3 papers)
// ============================================================
const QUESTIONS_PHASE4 = [
  // S1 Term3 P2 - only questions with 4 options and valid answers
  {id:'p4s1q01',topic:'代數',difficulty:1,question:'計算 $\frac{5}{8} + 0.65$ 的值',options:{A:'40/100',B:'51/40',C:'173/113',D:'160'},answer:'B'},
  {id:'p4s1q02',topic:'代數',difficulty:2,question:'計算 $\frac{(+6) + (-8)}{(-2)}$ 的值',options:{A:'-8',B:'-4',C:'1',D:'4'},answer:'C'},
  {id:'p4s1q03',topic:'代數',difficulty:1,question:'以代數式表示 $x$ 的平方與 $y$ 之積',options:{A:'$x^2y$',B:'$x^2+y$',C:'$x^3-y$',D:'$x^3y$'},answer:'A'},
  {id:'p4s1q04',topic:'代數',difficulty:2,question:'已知 $b = 3 + a^2$,求當 $a = -6$ 時 $b$ 的值',options:{A:'-39',B:'-33',C:'33',D:'39'},answer:'D'},
  {id:'p4s1q07',topic:'代數',difficulty:1,question:'化簡 $x^{10} \cdot x^3$',options:{A:'$x^{13}$',B:'$x^{30}$',C:'$2x^{13}$',D:'$2x^{30}$'},answer:'A'},
  {id:'p4s1q08',topic:'代數',difficulty:2,question:'化簡 $(6a + 2b) - (8a - 5b)$',options:{A:'$-2a+7b$',B:'$2a-3b$',C:'$2a+7b$',D:'$-2a-3b$'},answer:'A'},
  {id:'p4s1q09',topic:'代數',difficulty:2,question:'展開 $(x + 3)(x - 5)$',options:{A:'$x^2-2x-15$',B:'$x^2+7x-15$',C:'$x^2-15$',D:'$2x-2$'},answer:'A'},
  {id:'p4s1q10',topic:'代數',difficulty:1,question:'解方程 $15 - 2x = 7$',options:{A:'$x=-11$',B:'$x=-4$',C:'$x=4$',D:'$x=11$'},answer:'C'},
  {id:'p4s1q11',topic:'代數',difficulty:2,question:'解方程 $5x + 22 = 2x - 8$',options:{A:'$x=-10$',B:'$x=-2$',C:'$x=2$',D:'$x=10$'},answer:'A'},
  {id:'p4s1q14',topic:'代數',difficulty:1,question:'小盛原有 $250 零用錢，他繳交了歌唱比賽的報名費後餘下 $160。求報名費',options:{A:'$90',B:'$80',C:'$70',D:'$60'},answer:'A'},
  {id:'p4s1q15',topic:'代數',difficulty:2,question:'小倩上月的總支出是 $1200，本月的總支出為 $960。求小倩所花支出的百分變化',options:{A:'增加20%',B:'減少20%',C:'增加25%',D:'減少25%'},answer:'B'},
  {id:'p4s1q16',topic:'代數',difficulty:2,question:'小晞以 $576 購買了一套玩偶並以 $900 將該套玩偶賣出。求小晞的盈利百分率',options:{A:'56.25%',B:'64%',C:'虧蝕36%',D:'虧蝕43.75%'},answer:'A'},
  {id:'p4s1q17',topic:'代數',difficulty:2,question:'小祺和3個好朋友一同去吃燒肉。四人同行可享八折優惠。他們四人共需多少錢？',options:{A:'$59',B:'$94.4',C:'$283.2',D:'$377.6'},answer:'D'},
  {id:'p4s1q19',topic:'幾何',difficulty:1,question:'求 $(3, -4)$ 與 $(3, 5)$ 兩點之間的距離',options:{A:'0單位',B:'1單位',C:'6單位',D:'9單位'},answer:'D'},
  {id:'p4s1q20',topic:'幾何',difficulty:2,question:'右圖中，$A(-2, 3)$ 向右平移 3 單位至 $A$。$A$ 的坐標是',options:{A:'(-2,6)',B:'(-2,0)',C:'(1,3)',D:'(-5,3)'},answer:'C'},
  {id:'p4s1q35',topic:'統計',difficulty:2,question:'某學校有60%的學生是初中生。當中45%的初中生及65%的高中生為男生。隨機選出一個學生是男生的概率為',options:{A:'0.27',B:'1.27',C:'2.27',D:'5.27'},answer:'A'},
  {id:'p4s1q36',topic:'代數',difficulty:2,question:'某玩具原本的售價為325元，減價後減少了20%。該玩具以新售價出售，售價為多少元？',options:{A:'$200',B:'$250',C:'$260',D:'$338'},answer:'C'},
  // S3 Term3 P2 - only questions with 4 options and valid answers
  {id:'p4s3q01',topic:'代數',difficulty:3,question:'化簡 $(ab)^2 \cdot (ab)^3$',options:{A:'$a^2b^3$',B:'$b^2a^3$',C:'$a^2b^6$',D:'$ab^6$'},answer:'A'},
  {id:'p4s3q02',topic:'代數',difficulty:2,question:'因式分解 $x^2 - 5xy - 6y^2$',options:{A:'$(x+y)(x-6y)$',B:'$(x+2y)(x+3y)$',C:'$(x-y)(x+6y)$',D:'$(x-2y)(x-3y)$'},answer:'A'},
  {id:'p4s3q03',topic:'代數',difficulty:2,question:'解聯立方程 $\begin{cases} x-5y=13 \\ 3x-2y=13 \end{cases}$',options:{A:'$x=3, y=2$',B:'$x=3, y=-2$',C:'$x=-2, y=3$',D:'$x=-2, y=-3$'},answer:'B'},
  {id:'p4s3q04',topic:'代數',difficulty:2,question:'化簡 $(h^2-4h+3) - (5-2h^2+6h)$',options:{A:'$3h^2-10h-2$',B:'$3h^2+2h-2$',C:'$-h-2$',D:'$-h^2-10h-2$'},answer:'A'},
  {id:'p4s3q05',topic:'代數',difficulty:2,question:'小譚製作一份精讀筆記的成本為$25。該筆記標價較成本高20%。若該筆記以其標價八折發售，售價為多少？',options:{A:'$24',B:'$25',C:'$26',D:'$37.5'},answer:'A'},
  {id:'p4s3q06',topic:'代數',difficulty:3,question:'小敏把$120000存入銀行1年，並年利率為2.4%，每月以複利計算。求1年後她得到的利息',options:{A:'$240',B:'$2912',C:'$32189',D:'$39507'},answer:'B'},
  {id:'p4s3q07',topic:'代數',difficulty:3,question:'不等式 $-3x < 9$ 的解為',options:{A:'$x > -3$',B:'$x < -3$',C:'$x > 3$',D:'$x < 3$'},answer:'B'},
  {id:'p4s3q08',topic:'幾何',difficulty:2,question:'圖中，$ABCD$ 為一個平行四邊形。$E$ 是 $AD$ 上的一點，使 $AE = AB$。若 $\angle ADC = 102^\circ$，求 $\angle AEB$',options:{A:'$39^\circ$',B:'$51^\circ$',C:'$78^\circ$',D:'$102^\circ$'},answer:'B'},
  {id:'p4s3q09',topic:'幾何',difficulty:2,question:'求圖中 $x$ 的值（直角三角形，斜邊8）',options:{A:'$4$',B:'$4\sqrt{2}$',C:'$4\sqrt{3}$',D:'$8\sqrt{3}$'},answer:'C'},
  {id:'p4s3q10',topic:'幾何',difficulty:2,question:'圖中為一個半徑為5cm的半球體。求半球體的曲面面積，答案須準確至三位有效數字',options:{A:'$314$ cm²',B:'$262$ cm²',C:'$236$ cm²',D:'$157$ cm²'},answer:'D'},
  {id:'p4s3q11',topic:'幾何',difficulty:2,question:'一個實心直立角錐的底是邊長為12cm的正方形。若角錐的體積是864cm³。求角錐的高',options:{A:'$2$ cm',B:'$6$ cm',C:'$12$ cm',D:'$18$ cm'},answer:'D'},
  {id:'p4s3q12',topic:'幾何',difficulty:2,question:'圖中，圓錐的半徑和斜高分別為5cm及13cm。求該圓錐的總表面面積',options:{A:'$65\pi$ cm²',B:'$85\pi$ cm²',C:'$90\pi$ cm²',D:'$100\pi$ cm²'},answer:'C'},
  {id:'p4s3q14',topic:'統計',difficulty:2,question:'某次考試12天的平均考試時間是165分鐘。已知首8天的平均考試時間是180分鐘，則後4天的平均考試時間為',options:{A:'$135$ 分鐘',B:'$170$ 分鐘',C:'$171$ 分鐘',D:'$180$ 分鐘'},answer:'A'},
  {id:'p4s3q16',topic:'幾何',difficulty:3,question:'求圖中線段 $PQ$ 的長度，$P(-3,-2)$',options:{A:'11 單位',B:'17 單位',C:'37 單位',D:'$\sqrt{149}$ 單位'},answer:'D'},
  {id:'p4s3q17',topic:'代數',difficulty:2,question:'下圖顯示四條直線 $L_1、L_2$ 和 $L_3$ 的斜率分別是 $m_1、m_2$ 和 $m_3$。以下何者正確？',options:{A:'$m_1 < m_2 < m_3$',B:'$m_2 < m_3 < m_1$',C:'$m_1 < m_3 < m_2$',D:'$m_3 < m_2 < m_1$'},answer:'B'},
  {id:'p4s3q18',topic:'代數',difficulty:2,question:'圖中，直線 $L_1$ 和 $L_2$ 互相平行。$L_1$ 的 $x$ 軸截距和 $y$ 軸截距分別是 $-10$ 和 $-5$。已知 $L_2$ 通過原點，求 $L_2$ 的斜率',options:{A:'$2$',B:'$-2$',C:'$3$',D:'$-3$'},answer:'C'},
  {id:'p4s3q19',topic:'概率',difficulty:1,question:'中三某班有30名學生，其中有18名男學生。老師要從該班隨機選出一名代表。求選出一名男學生的概率',options:{A:'$\frac{1}{3}$',B:'$\frac{2}{3}$',C:'$\frac{2}{5}$',D:'$\frac{3}{5}$'},answer:'D'},
  {id:'p4s3q20',topic:'代數',difficulty:2,question:'多名班代表將分為3組，當中有 $n$ 名會分配至紅組、6名會分配至藍組及9名會分配至綠組。紅、藍、綠組的人數比為 $n:6:9$。若總人數為20，求 $n$ 的值',options:{A:'$5$',B:'$6$',C:'$9$',D:'$10$'},answer:'D'},
  {id:'p4s3q21',topic:'概率',difficulty:2,question:'某箱中有四張分別記有數字1、2、3和4的紙卡。從該箱中隨機同時抽出兩張紙卡。抽出兩張紙卡的數字之和為5的概率為',options:{A:'$\frac{1}{6}$',B:'$\frac{1}{4}$',C:'$\frac{1}{3}$',D:'$\frac{1}{2}$'},answer:'A'},
  {id:'p4s3q23',topic:'代數',difficulty:2,question:'某袋中有一個紅球、一個綠球和一個藍球。紅球的重量是860g，而綠球的重量比藍球輕50g。三個球的總重量為2670g。求藍球的重量',options:{A:'$1330$ g',B:'$1410$ g',C:'$1460$ g',D:'$1490$ g'},answer:'B'},
  {id:'p4s3q24',topic:'幾何',difficulty:3,question:'圖中，$PQRS$ 是一個梯形，其中 $PS // QR$。若 $\angle PQR = \alpha$ 和 $\angle SRQ = \beta$，則 $SR$ =',options:{A:'$\frac{x \sin \alpha}{\sin \beta}$',B:'$\frac{x \sin \beta}{\sin \alpha}$',C:'$x \sin \alpha \sin \beta$',D:'$\frac{x}{\sin \alpha \sin \beta}$'},answer:'A'},
  {id:'p4s3q25',topic:'幾何',difficulty:3,question:'圖中的平截頭體是由一個高和底半徑分別是8cm和12cm的直立圓錐切去上方的部分而成。若平截頭體的體積為$378\pi$ cm³，求上方切去的圓錐的高',options:{A:'$288\pi$ cm³',B:'$378\pi$ cm³',C:'$384\pi$ cm³',D:'$450\pi$ cm³'},answer:'B'},
  {id:'p4s3q26',topic:'幾何',difficulty:3,question:'兩個球體的表面面積之和是 $544\pi$ cm²。較小的球體的半徑與較大的球體的半徑之比是3:5。求較小球體的體積',options:{A:'$136\pi$ cm³',B:'$256\pi$ cm³',C:'$3136\pi$ cm³',D:'$6664\pi$ cm³'},answer:'C'},
  {id:'p4s3q27',topic:'幾何',difficulty:3,question:'設 $O$ 為原點。若點 $P$ 及點 $Q$ 的坐標分別為 $(44, 46)$ 及 $(67, 0)$，求 $\triangle OPQ$ 的垂心的坐標',options:{A:'$(22, 23)$',B:'$(44, 22)$',C:'$(44, 23)$',D:'$(44, 46)$'},answer:'B'},
  {id:'p4s3q28',topic:'幾何',difficulty:3,question:'$A$、$B$ 和 $M$ 三點的坐標分別是 $(-18, 3)$、$(-k, 6k)$ 和 $(-14, 9)$，其中 $k$ 是一個常數。若 $M$ 是 $AB$ 的中點，求 $k$',options:{A:'$2:5$',B:'$2:9$',C:'$4:1$',D:'$4:5$'},answer:'A'},
  {id:'p4s3q30',topic:'概率',difficulty:2,question:'小權獲得一次輪盤抽獎機會。輪盤有3種顏色，綠色佔$180^\circ$。求轉到藍色的概率',options:{A:'$40$',B:'$50$',C:'$60$',D:'$70$'},answer:'C'},
  {id:'p4s3q22',topic:'代數',difficulty:2,question:'(4n)(16^3n) = 64^n, 求n的值',options:{A:'1',B:'4',C:'64n',D:'256n'},answer:'D'},
];

// Merge Phase 4 questions
ALL_QUESTIONS.push(...QUESTIONS_PHASE4);
console.log(`Total questions after Phase 4: ${ALL_QUESTIONS.length}`);


// ============================================================
// CARD SYSTEM (Phase 1c)
// ============================================================
const CARDS = [
  // 普通卡 (Common) - 60% drop rate
  {id:'c01',name:'計算入門',icon:'🧮',type:'passive',rarity:'common',effect:'計算題經驗+5%',stat:'algebra_exp',value:5},
  {id:'c02',name:'幾何初心',icon:'📐',type:'passive',rarity:'common',effect:'幾何題經驗+5%',stat:'geo_exp',value:5},
  {id:'c03',name:'統計入門',icon:'📊',type:'passive',rarity:'common',effect:'統計題經驗+5%',stat:'stat_exp',value:5},
  {id:'c04',name:'數字敏感',icon:'🔢',type:'passive',rarity:'common',effect:'心算正確率+3%',stat:'accuracy',value:3},
  {id:'c05',name:'勤奮學生',icon:'📖',type:'passive',rarity:'common',effect:'每日答題上限+5',stat:'daily_limit',value:5},
  {id:'c06',name:'專心聽講',icon:'👂',type:'passive',rarity:'common',effect:'課堂題經驗+5%',stat:'class_exp',value:5},
  {id:'c07',name:'勇於挑戰',icon:'⚔️',type:'passive',rarity:'common',effect:'挑戰題經驗+5%',stat:'challenge_exp',value:5},
  {id:'c08',name:'邏輯思考',icon:'🧩',type:'passive',rarity:'common',effect:'推理題經驗+5%',stat:'logic_exp',value:5},
  {id:'c09',name:'空間想像',icon:'🧊',type:'passive',rarity:'common',effect:'立體幾何經驗+5%',stat:'3d_exp',value:5},
  {id:'c10',name:'速度之星',icon:'⚡',type:'passive',rarity:'common',effect:'答題時間-1秒',stat:'speed',value:1},
  {id:'c11',name:'耐心計算',icon:'🧮',type:'passive',rarity:'common',effect:'繁複計算正確率+5%',stat:'calc_accuracy',value:5},
  {id:'c12',name:'審題高手',icon:'🔍',type:'passive',rarity:'common',effect:'首次答題正確率+5%',stat:'first_accuracy',value:5},
  {id:'c13',name:'敢於創新',icon:'💡',type:'passive',rarity:'common',effect:'開放題額外獎勵',stat:'bonus_exp',value:5},
  {id:'c14',name:'應用初探',icon:'🌍',type:'passive',rarity:'common',effect:'應用題經驗+5%',stat:'applied_exp',value:5},
  {id:'c15',name:'代數起步',icon:'📝',type:'passive',rarity:'common',effect:'代數題經驗+5%',stat:'algebra_exp',value:5},
  {id:'c16',name:'概率初哥',icon:'🎲',type:'passive',rarity:'common',effect:'概率題經驗+5%',stat:'prob_exp',value:5},
  {id:'c17',name:'函數基礎',icon:'📈',type:'passive',rarity:'common',effect:'函數題經驗+5%',stat:'func_exp',value:5},
  {id:'c18',name:'面積計算',icon:'⬜',type:'passive',rarity:'common',effect:'面積題經驗+5%',stat:'area_exp',value:5},
  {id:'c19',name:'方程求解',icon:'🔑',type:'passive',rarity:'common',effect:'方程題經驗+5%',stat:'eq_exp',value:5},
  {id:'c20',name:'圖表解讀',icon:'📉',type:'passive',rarity:'common',effect:'圖表題經驗+5%',stat:'chart_exp',value:5},

  // 稀有卡 (Rare) - 30% drop rate
  {id:'r01',name:'計算高手',icon:'🧮',type:'passive',rarity:'rare',effect:'計算題經驗+15%',stat:'algebra_exp',value:15},
  {id:'r02',name:'幾何愛好者',icon:'📐',type:'passive',rarity:'rare',effect:'幾何題經驗+15%',stat:'geo_exp',value:15},
  {id:'r03',name:'統計分析師',icon:'📊',type:'passive',rarity:'rare',effect:'統計題經驗+15%',stat:'stat_exp',value:15},
  {id:'r04',name:'雙倍專注',icon:'🎯',type:'skill',rarity:'rare',effect:'每日首次2x經驗(1次)',stat:'double_exp',value:1},
  {id:'r05',name:'連勝之心',icon:'🔥',type:'passive',rarity:'rare',effect:'連勝加成+10%',stat:'streak_bonus',value:10},
  {id:'r06',name:'暴擊大師',icon:'💥',type:'passive',rarity:'rare',effect:'暴擊率+5%',stat:'crit_rate',value:5},
  {id:'r07',name:'幸運加成',icon:'🍀',type:'passive',rarity:'rare',effect:'卡牌掉落率+10%',stat:'card_drop',value:10},
  {id:'r08',name:'組隊之心',icon:'🤝',type:'passive',rarity:'rare',effect:'組隊經驗+10%',stat:'team_exp',value:10},
  {id:'r09',name:'速度專家',icon:'⚡',type:'passive',rarity:'rare',effect:'答題時間-3秒',stat:'speed',value:3},
  {id:'r10',name:'精確無誤',icon:'✅',type:'passive',rarity:'rare',effect:'計算題正確率+10%',stat:'calc_accuracy',value:10},
  {id:'r11',name:'立體幾何師',icon:'🧊',type:'passive',rarity:'rare',effect:'立體幾何+15%',stat:'3d_exp',value:15},
  {id:'r12',name:'概率專家',icon:'🎲',type:'passive',rarity:'rare',effect:'概率題+15%',stat:'prob_exp',value:15},
  {id:'r13',name:'應用大師',icon:'🌍',type:'passive',rarity:'rare',effect:'應用題+15%',stat:'applied_exp',value:15},
  {id:'r14',name:'解題高手',icon:'🧩',type:'passive',rarity:'rare',effect:'疑難題+10%',stat:'hard_exp',value:10},
  {id:'r15',name:'學習加速',icon:'🚀',type:'passive',rarity:'rare',effect:'升級經驗-5%',stat:'exp_reduce',value:5},
  {id:'r16',name:'傳承之書',icon:'📚',type:'passive',rarity:'rare',effect:'老師指導加成+20%',stat:'teacher_boost',value:20},
  {id:'r17',name:'早起鳥',icon:'🐦',type:'passive',rarity:'rare',effect:'早上答題經驗+10%',stat:'morning_exp',value:10},
  {id:'r18',name:'夜貓子',icon:'🦉',type:'passive',rarity:'rare',effect:'晚上答題經驗+10%',stat:'night_exp',value:10},
  {id:'r19',name:'週末戰士',icon:'⚔️',type:'passive',rarity:'rare',effect:'週末經驗+15%',stat:'weekend_exp',value:15},
  {id:'r20',name:'數學精算師',icon:'🔢',type:'passive',rarity:'rare',effect:'所有計算+12%',stat:'all_calc',value:12},

  // 傳說卡 (Legendary) - 10% drop rate
  {id:'l01',name:'數學大師',icon:'👑',type:'passive',rarity:'legendary',effect:'全科目經驗+30%',stat:'all_exp',value:30},
  {id:'l02',name:'全能學者',icon:'🎓',type:'passive',rarity:'legendary',effect:'所有題型經驗+20%',stat:'all_type_exp',value:20},
  {id:'l03',name:'永不放棄',icon:'💪',type:'passive',rarity:'legendary',effect:'答錯不扣HP(每日3次)',stat:'no_hp_loss',value:3},
  {id:'l04',name:'透視之眼',icon:'👁️',type:'skill',rarity:'legendary',effect:'答題前顯示提示',stat:'show_hint',value:1},
  {id:'l05',name:'時間管理者',icon:'⏰',type:'passive',rarity:'legendary',effect:'限時挑戰時間+30秒',stat:'time_bonus',value:30},
  {id:'l06',name:'成就獵人',icon:'🏅',type:'passive',rarity:'legendary',effect:'成就點數+50%',stat:'achieve_pts',value:50},
  {id:'l07',name:'全勤獎',icon:'🏆',type:'passive',rarity:'legendary',effect:'連續登入獎勵+20%',stat:'login_bonus',value:20},
  {id:'l08',name:'卡牌之王',icon:'🃏',type:'passive',rarity:'legendary',effect:'卡牌掉落率+20%',stat:'card_drop',value:20},
  {id:'l09',name:'连胜传说',icon:'🔥',type:'passive',rarity:'legendary',effect:'連勝加成+25%',stat:'streak_bonus',value:25},
  {id:'l10',name:'完美主義',icon:'💎',type:'passive',rarity:'legendary',effect:'全部屬性+10%',stat:'all_stats',value:10},
];

// ============================================================
// BOSS SYSTEM (Phase 4)
// ============================================================
const BOSSES = [
  {id:'alg_boss',name:'代數魔王',icon:'🧮',topic:'代數',hp:5,reward:{xp:200,cards:3},minLevel:5,question_count:5},
  {id:'geo_boss',name:'幾何龍王',icon:'🐉',topic:'幾何',hp:5,reward:{xp:200,cards:3},minLevel:8,question_count:5},
  {id:'stat_boss',name:'統計惡魔',icon:'👹',topic:'統計',hp:5,reward:{xp:300,cards:5},minLevel:10,question_count:5},
  {id:'final_boss',name:'數學終極BOSS',icon:'💀',topic:null,hp:10,reward:{xp:1000,cards:10},minLevel:15,question_count:10},
];

// ============================================================
// DAILY CHALLENGE QUESTIONS (Phase 4 - seeded by date)
// ============================================================
// 50 questions for daily challenge (mix of all topics)
const DAILY_CHALLENGE_QUESTIONS = [
  {id:'dc001',topic:'代數',difficulty:1,question:'化簡 $7r - 8 - 4r + 3$',options:{A:'$3r-5$',B:'$3r-11$',C:'$11r-5$',D:'$11r-11$'},answer:'A'},
  {id:'dc002',topic:'代數',difficulty:2,question:'$(+23) - (-19)$ 的值為',options:{A:'42',B:'-4',C:'4',D:'-42'},answer:'A'},
  {id:'dc003',topic:'幾何',difficulty:1,question:'已知直角三角形的兩直角邊為 3 和 4,求斜邊',options:{A:'5',B:'6',C:'7',D:'12'},answer:'A'},
  {id:'dc004',topic:'統計',difficulty:1,question:'數據 2, 4, 6, 8 的平均數為',options:{A:'5',B:'6',C:'4',D:'8'},answer:'A'},
  {id:'dc005',topic:'代數',difficulty:1,question:'解方程 $5x + 3 = 8$',options:{A:'$x=1$',B:'$x=5$',C:'$x=11$',D:'$x=-1$'},answer:'A'},
  {id:'dc006',topic:'概率',difficulty:1,question:'擲一枚硬幣，出現正面既概率係',options:{A:'$\frac{1}{2}$',B:'$\frac{1}{3}$',C:'$\frac{2}{3}$',D:'1'},answer:'A'},
  {id:'dc007',topic:'函數',difficulty:1,question:'若 $f(x)=3x+2$, 求 $f(4)$',options:{A:'14',B:'12',C:'10',D:'8'},answer:'A'},
  {id:'dc008',topic:'方程',difficulty:1,question:'解方程 $2x+6=14$',options:{A:'$x=4$',B:'$x=5$',C:'$x=3$',D:'$x=2$'},answer:'A'},
  {id:'dc009',topic:'面積',difficulty:1,question:'長方形長 8cm，闊 5cm，求面積',options:{A:'40 cm²',B:'26 cm²',C:'13 cm²',D:'20 cm²'},answer:'A'},
  {id:'dc010',topic:'坐標',difficulty:1,question:'點 $(3,4)$ 在第幾象限？',options:{A:'第一象限',B:'第二象限',C:'第三象限',D:'第四象限'},answer:'A'},
  {id:'dc011',topic:'比率',difficulty:1,question:'比例 $3:4 = 6:x$ 中 $x$ 既值係',options:{A:'8',B:'6',C:'4',D:'12'},answer:'A'},
  {id:'dc012',topic:'數列',difficulty:1,question:'數列 2,5,8,11,... 第5項係',options:{A:'14',B:'15',C:'17',D:'13'},answer:'A'},
  {id:'dc013',topic:'百分率',difficulty:2,question:'$80$ 既 $20%$ 係幾多？',options:{A:'16',B:'20',C:'12',D:'8'},answer:'A'},
  {id:'dc014',topic:'代數',difficulty:1,question:'計算 $\frac{5}{8}+0.65$ 的值',options:{A:'$1.275$',B:'$2.27$',C:'$3.27$',D:'$6.28$'},answer:'A'},
  {id:'dc015',topic:'代數',difficulty:2,question:'化簡 $(6a+2b)-(8a-5b)$',options:{A:'$-2a+7b$',B:'$40$',C:'$93$',D:'$95$'},answer:'A'},
  {id:'dc016',topic:'幾何',difficulty:2,question:'三角形的內角和為',options:{A:'$180°$',B:'90°',C:'270°',D:'360°'},answer:'A'},
  {id:'dc017',topic:'代數',difficulty:2,question:'已知 $b=3+a^2$,若 $a=-6$,求 $b$',options:{A:'$39$',B:'$40$',C:'$41$',D:'$44$'},answer:'A'},
  {id:'dc018',topic:'幾何',difficulty:1,question:'圓的半徑為 7,面積為',options:{A:'$49\pi$',B:'$98\pi$',C:'$24\pi$',D:'$54\pi$'},answer:'A'},
  {id:'dc019',topic:'統計',difficulty:1,question:'一副撲克牌有 52 張,抽到紅色的概率為',options:{A:'$\frac{1}{2}$',B:'$\frac{1}{4}$',C:'$\frac{1}{3}$',D:'$\frac{2}{3}$'},answer:'A'},
  {id:'dc020',topic:'代數',difficulty:2,question:'展開 $(x+3)(x-5)$',options:{A:'$x^2-2x-15$',B:'$35$',C:'$5$',D:'$91$'},answer:'A'},
  {id:'dc021',topic:'概率',difficulty:2,question:'袋中有 3 個紅球、2 個藍球，隨機拎一個，拎到紅球既概率係',options:{A:'$\frac{3}{5}$',B:'$\frac{2}{5}$',C:'$\frac{1}{2}$',D:'$\frac{3}{2}$'},answer:'A'},
  {id:'dc022',topic:'函數',difficulty:2,question:'若 $g(x)=x^2-1$, 求 $g(-3)$',options:{A:'8',B:'6',C:'10',D:'12'},answer:'A'},
  {id:'dc023',topic:'方程',difficulty:2,question:'解方程 $3x-5=16$',options:{A:'$x=7$',B:'$x=6$',C:'$x=5$',D:'$x=8$'},answer:'A'},
  {id:'dc024',topic:'面積',difficulty:2,question:'長方形面積 36 cm²，長 9cm，闊幾多？',options:{A:'4cm',B:'5cm',C:'6cm',D:'3cm'},answer:'A'},
  {id:'dc025',topic:'坐標',difficulty:2,question:'點 $(2,-5)$ 的 $y$ 坐標係',options:{A:'-5',B:'2',C:'5',D:'-2'},answer:'A'},
  {id:'dc026',topic:'比率',difficulty:2,question:'若 $a:b=5:3$，且 $a=15$，求 $b$',options:{A:'9',B:'12',C:'6',D:'10'},answer:'A'},
  {id:'dc027',topic:'數列',difficulty:2,question:'等差數列 3,7,11,... 第10項',options:{A:'39',B:'40',C:'41',D:'42'},answer:'A'},
  {id:'dc028',topic:'百分率',difficulty:2,question:'$200$ 既 $15%$ 係',options:{A:'30',B:'20',C:'15',D:'25'},answer:'A'},
  {id:'dc029',topic:'代數',difficulty:2,question:'解方程 $9+2x=18-x$',options:{A:'$3$',B:'$4$',C:'$5$',D:'$8$'},answer:'A'},
  {id:'dc030',topic:'幾何',difficulty:1,question:'正方形邊長為 5,周界為',options:{A:'$20$',B:'$21$',C:'$22$',D:'$25$'},answer:'A'},
  {id:'dc031',topic:'代數',difficulty:1,question:'化簡 $x^6 \times x^2$',options:{A:'$x^8$',B:'$25$',C:'$26$',D:'$70$'},answer:'A'},
  {id:'dc032',topic:'代數',difficulty:2,question:'解方程 $7-3x=-8$',options:{A:'$5$',B:'$6$',C:'$7$',D:'$10$'},answer:'A'},
  {id:'dc033',topic:'函數',difficulty:2,question:'函數 $y=2x-5$ 當 $x=0$ 時，$y$ 等於',options:{A:'-5',B:'5',C:'2',D:'-2'},answer:'A'},
  {id:'dc034',topic:'統計',difficulty:2,question:'數據 1, 2, 3, 4, 5 的中位數為',options:{A:'$3$',B:'$4$',C:'$5$',D:'$8$'},answer:'A'},
  {id:'dc035',topic:'概率',difficulty:2,question:'擲一枚骰仔，擲到 3 或 5 既概率係',options:{A:'$\frac{1}{3}$',B:'$\frac{1}{6}$',C:'$\frac{1}{2}$',D:'$\frac{2}{3}$'},answer:'A'},
  {id:'dc036',topic:'代數',difficulty:2,question:'已知 $x=9y-13$,若 $y=-2$,求 $x$',options:{A:'$-31$',B:'$50$',C:'$19$',D:'$22$'},answer:'A'},
  {id:'dc037',topic:'幾何',difficulty:2,question:'三角形底 10cm，高 6cm，求面積',options:{A:'30 cm²',B:'60 cm²',C:'15 cm²',D:'45 cm²'},answer:'A'},
  {id:'dc038',topic:'比率',difficulty:2,question:'男：女 = 4：5，全班 36 人，女生有幾多人？',options:{A:'20',B:'16',C:'15',D:'18'},answer:'A'},
  {id:'dc039',topic:'數列',difficulty:2,question:'等比數列 2,6,18,... 第4項係',options:{A:'54',B:'36',C:'72',D:'108'},answer:'A'},
  {id:'dc040',topic:'統計',difficulty:2,question:'數據 3, 3, 3, 3 的眾數為',options:{A:'$3$',B:'$4$',C:'$5$',D:'$8$'},answer:'A'},
  {id:'dc041',topic:'代數',difficulty:2,question:'化簡 $x^{10} \cdot x^3$',options:{A:'$x^13$',B:'$83$',C:'$2$',D:'$68$'},answer:'A'},
  {id:'dc042',topic:'代數',difficulty:2,question:'寫出 50 的質因數連乘式',options:{A:'$2\times5^2$',B:'$73$',C:'$63$',D:'$42$'},answer:'A'},
  {id:'dc043',topic:'代數',difficulty:2,question:'展開 $8(3a-b)$',options:{A:'$24a-8b$',B:'$7$',C:'$44$',D:'$53$'},answer:'A'},
  {id:'dc044',topic:'代數',difficulty:2,question:'化簡 $x^2+3x-(2x^2-5x)$',options:{A:'$-x^2+8x$',B:'$68$',C:'$42$',D:'$75$'},answer:'A'},
  {id:'dc045',topic:'概率',difficulty:2,question:'擲兩枚硬幣，至少有一個係反面既概率係',options:{A:'$\frac{3}{4}$',B:'$\frac{1}{4}$',C:'$\frac{1}{2}$',D:'$\frac{1}{3}$'},answer:'A'},
  {id:'dc046',topic:'函數',difficulty:3,question:'若 $f(x)=x^2+3x$, 求 $f(2)-f(1)$',options:{A:'6',B:'7',C:'8',D:'9'},answer:'A'},
  {id:'dc047',topic:'坐標',difficulty:2,question:'兩點 $(1,2)$ 同 $(1,8)$ 之間既距離係',options:{A:'6',B:'7',C:'8',D:'9'},answer:'A'},
  {id:'dc048',topic:'面積',difficulty:1,question:'正方形邊長 7cm，求面積',options:{A:'49 cm²',B:'28 cm²',C:'14 cm²',D:'21 cm²'},answer:'A'},
  {id:'dc049',topic:'代數',difficulty:2,question:'解方程 $15-2x=7$',options:{A:'$4$',B:'$5$',C:'$6$',D:'$9$'},answer:'A'},
  {id:'dc050',topic:'代數',difficulty:2,question:'化簡 $\frac{(+6)+(-8)}{(-2)}$',options:{A:'$1$',B:'$2$',C:'$3$',D:'$6$'},answer:'A'},
];

// ============================================================
// ACHIEVEMENT SYSTEM (Phase 2 + Phase 4 new)
// ============================================================
const ACHIEVEMENTS=[
  {id:'first_correct',name:'答對一道',desc:'首次答對題目',icon:'✅',reward:20,cond:(gs)=>gs.correctAnswers>=1},
  {id:'correct_10',name:'答題新秀',desc:'答對10道題目',icon:'📖',reward:50,cond:(gs)=>gs.correctAnswers>=10},
  {id:'correct_50',name:'答題高手',desc:'答對50道題目',icon:'📚',reward:100,cond:(gs)=>gs.correctAnswers>=50},
  {id:'correct_100',name:'答題大師',desc:'答對100道題目',icon:'🏆',reward:200,cond:(gs)=>gs.correctAnswers>=100},
  {id:'streak_3',name:'連勝初哥',desc:'達成3連勝',icon:'🔥',reward:30,cond:(gs)=>gs.maxStreak>=3},
  {id:'streak_5',name:'連勝達人',desc:'達成5連勝',icon:'🔥',reward:50,cond:(gs)=>gs.maxStreak>=5},
  {id:'streak_10',name:'連勝大師',desc:'達成10連勝',icon:'🔥',reward:100,cond:(gs)=>gs.maxStreak>=10},
  {id:'level_5',name:'小試牛刀',desc:'達到5級',icon:'⬆️',reward:50,cond:(gs)=>gs.level>=5},
  {id:'level_10',name:'升級達人',desc:'達到10級',icon:'⬆️',reward:100,cond:(gs)=>gs.level>=10},
  {id:'level_20',name:'數學大師',desc:'達到20級',icon:'👑',reward:300,cond:(gs)=>gs.level>=20},
  {id:'first_card',name:'收集第一張',desc:'獲得第一張卡牌',icon:'🃏',reward:30,cond:(gs)=>(gs.cards||[]).length>=1},
  {id:'cards_5',name:'卡牌收藏家',desc:'收集5張卡牌',icon:'🃏',reward:50,cond:(gs)=>(gs.cards||[]).length>=5},
  {id:'cards_20',name:'卡牌達人',desc:'收集20張卡牌',icon:'🃏',reward:100,cond:(gs)=>(gs.cards||[]).length>=20},
  {id:'visit_3',name:'探索者',desc:'進入3個不同教室',icon:'🗺️',reward:30,cond:(gs)=>(gs.roomsVisited||[]).length>=3},
  {id:'visit_6',name:'房間探險家',desc:'進入6個不同教室',icon:'🗺️',reward:60,cond:(gs)=>(gs.roomsVisited||[]).length>=6},
  {id:'visit_all',name:'全科探索',desc:'進入所有教室',icon:'🗺️',reward:200,cond:(gs)=>(gs.roomsVisited||[]).length>=12},
  {id:'first_daily',name:'任務達人',desc:'完成第一個每日任務',icon:'📋',reward:30,cond:(gs)=>gs.completedDailyTasks>=1},
  {id:'hp_full',name:'精力充沛',desc:'HP回滿',icon:'❤',reward:10,cond:(gs)=>gs.hp>=gs.maxHp},
  {id:'first_room',name:'初次探索',desc:'進入第一個教室',icon:'🚪',reward:20,cond:(gs)=>(gs.roomsVisited||[]).length>=1},
  {id:'legendary_card',name:'傳說獵人',desc:'獲得第一張傳說卡',icon:'⭐',reward:100,cond:(gs)=>(gs.cards||[]).some(id=>id&&id.startsWith('l'))},
  // Phase 3 - Arena achievements
  {id:'arena_first',name:'初試鋒芒',desc:'完成第一次競技場',icon:'⚔️',reward:50,cond:(gs)=>gs.arenaParticipated>=1},
  {id:'arena_5',name:'競技場常客',desc:'完成5次競技場',icon:'⚔️',reward:100,cond:(gs)=>gs.arenaParticipated>=5},
  {id:'arena_perfect',name:'完美演出',desc:'競技場5題全對',icon:'💎',reward:200,cond:(gs)=>gs.arenaPerfect>=1},
  {id:'arena_top10',name:'前十名',desc:'競技場排名前10',icon:'🏅',reward:150,cond:(gs)=>gs.arenaTop10>=1},
  // Phase 3 - Social achievements
  {id:'add_friend',name:'交新朋友',desc:'添加一位好友',icon:'🤝',reward:30,cond:(gs)=>(gs.friends||[]).length>=1},
  {id:'add_5_friends',name:'人脈廣泛',desc:'添加5位好友',icon:'🤝',reward:80,cond:(gs)=>(gs.friends||[]).length>=5},
  {id:'share_code',name:'分享者',desc:'分享你的邀請碼',icon:'📤',reward:20,cond:(gs)=>gs.sharedCode>=1},
  // Phase 3 - Hardship achievements
  {id:'wrong_10',name:'失敗乃成功之母',desc:'答錯10道題目',icon:'😅',reward:50,cond:(gs)=>gs.wrongAnswers>=10},
  {id:'hp_critical',name:'生死邊緣',desc:'HP低於20%仍然答對',icon:'😵',reward:50,cond:(gs)=>gs.hpLowCorrect>=1},
  {id:'no_hp_lost',name:'針灸無損',desc:'連續20題不失HP',icon:'🛡️',reward:100,cond:(gs)=>gs.hpNoLossStreak>=20},
  // Phase 3 - Time achievements
  {id:'speed_30s',name:'速度之星',desc:'30秒內完成答題',icon:'⏱️',reward:40,cond:(gs)=>gs.speedAnswers>=1},
  {id:'morning_learn',name:'晨型人',desc:'早上7點前完成題目',icon:'🌅',reward:30,cond:(gs)=>gs.morningAnswers>=1},
  // Phase 3 - Room-specific achievements
  {id:'visit_alg',name:'代數大師',desc:'完成代數房所有題目',icon:'📐',reward:40,cond:(gs)=>(gs.roomCorrect||{})['alg']>=5},
  {id:'visit_geo',name:'幾何高手',desc:'完成幾何房所有題目',icon:'📐',reward:40,cond:(gs)=>(gs.roomCorrect||{})['geo']>=5},
  {id:'visit_stat',name:'統計專家',desc:'完成統計房所有題目',icon:'📊',reward:40,cond:(gs)=>(gs.roomCorrect||{})['stat']>=5},
  {id:'visit_prob',name:'概率達人',desc:'完成概率房所有題目',icon:'🎲',reward:40,cond:(gs)=>(gs.roomCorrect||{})['prob']>=5},
  {id:'visit_func',name:'函數高手',desc:'完成函數房所有題目',icon:'📈',reward:40,cond:(gs)=>(gs.roomCorrect||{})['func']>=5},
  {id:'visit_eq',name:'方程專家',desc:'完成方程房所有題目',icon:'⚖️',reward:40,cond:(gs)=>(gs.roomCorrect||{})['eq']>=5},
  {id:'visit_area',name:'面積測量師',desc:'完成面積房所有題目',icon:'📏',reward:40,cond:(gs)=>(gs.roomCorrect||{})['area']>=5},
  {id:'visit_coord',name:'坐標探索者',desc:'完成坐標房所有題目',icon:'📍',reward:40,cond:(gs)=>(gs.roomCorrect||{})['coord']>=5},
  {id:'visit_ratio',name:'比率分析師',desc:'完成比率房所有題目',icon:'⚖️',reward:40,cond:(gs)=>(gs.roomCorrect||{})['ratio']>=5},
  {id:'visit_seq',name:'數列解碼師',desc:'完成數列房所有題目',icon:'🔢',reward:40,cond:(gs)=>(gs.roomCorrect||{})['seq']>=5},
  {id:'visit_pct',name:'百分法師',desc:'完成百分法房所有題目',icon:'📉',reward:40,cond:(gs)=>(gs.roomCorrect||{})['pct']>=5},
  {id:'visit_approx',name:'近似值大師',desc:'完成近似房所有題目',icon:'📏',reward:40,cond:(gs)=>(gs.roomCorrect||{})['approx']>=5},
  {id:'visit_arena',name:'競技場傳說',desc:'完成競技場',icon:'🏆',reward:50,cond:(gs)=>gs.arenaParticipated>=1},
  // Phase 4 - Boss achievements
  {id:'boss_first',name:'初戰告捷',desc:'擊敗第一個Boss',icon:'⚔️',reward:100,cond:(gs)=>gs.bossesDefeated>=1},
  {id:'boss_all',name:'Boss終結者',desc:'擊敗所有Boss',icon:'💀',reward:500,cond:(gs)=>gs.bossesDefeated>=4},
  // Phase 4 - Daily challenge
  {id:'daily_first',name:'每日挑戰者',desc:'完成第一次每日挑戰',icon:'🌟',reward:50,cond:(gs)=>gs.dailyChallengeStreak>=1},
  {id:'daily_streak_7',name:'每日堅持者',desc:'連續7天完成每日挑戰',icon:'📅',reward:200,cond:(gs)=>gs.dailyChallengeStreak>=7},
  // Phase 4 - Question count
  {id:'q_200',name:'答題機器',desc:'答對200道題',icon:'🤖',reward:150,cond:(gs)=>gs.correctAnswers>=200},
  {id:'q_500',name:'數學狂人',desc:'答對500道題',icon:'🏅',reward:300,cond:(gs)=>gs.correctAnswers>=500},
  // Phase 4 - Streak
  {id:'streak_20',name:'傳說連勝',desc:'達成20連勝',icon:'🔥',reward:200,cond:(gs)=>gs.maxStreak>=20},
  // Phase 4 - Level
  {id:'level_30',name:'數學院士',desc:'達到30級',icon:'🎓',reward:500,cond:(gs)=>gs.level>=30},
  // Phase 4 - Boss special
  {id:'boss_perfect',name:'完美Boss戰',desc:'Boss戰全程滿血',icon:'💎',reward:300,cond:(gs)=>gs.bossPerfect>=1},
  // Phase 4 - Cards
  {id:'cards_50',name:'集齊50張',desc:'收集所有50張卡牌',icon:'🃏',reward:500,cond:(gs)=>gs.cards.length>=50},
];

function hasAchievement(id){return Array.isArray(gameState.unlockedAchievements)&&gameState.unlockedAchievements.includes(id)}

function checkAchievements(){
  if(!Array.isArray(gameState.unlockedAchievements))gameState.unlockedAchievements=[];
  ACHIEVEMENTS.forEach(a=>{
    if(!hasAchievement(a.id)){
      try{if(a.cond(gameState)){
        gameState.unlockedAchievements.push(a.id);
        showAchievementToast(a);
        addXP(a.reward);
        saveState();
      }}catch(e){}
    }
  });
}

function showAchievementToast(a){
  const toast=document.getElementById('achievement-toast');
  if(!toast)return;
  toast.innerHTML='<span class="ach-icon">'+a.icon+'</span><div><div class="ach-name">🏆 '+a.name+'</div><div class="ach-desc">'+a.desc+' +'+a.reward+'XP</div></div>';
  toast.classList.add('show');
  sfxAchievement&&sfxAchievement();
  setTimeout(()=>toast.classList.remove('show'),4000);
}

function sfxAchievement(){try{playTone(523,.1,'sine',.2);setTimeout(()=>playTone(659,.1,'sine',.2),120);setTimeout(()=>playTone(784,.1,'sine',.2),240);setTimeout(()=>playTone(1047,.3,'sine',.25),360);}catch(e){}}

function checkRoomVisit(roomId){
  if(!Array.isArray(gameState.roomsVisited))gameState.roomsVisited=[];
  if(!gameState.roomsVisited.includes(roomId)){
    gameState.roomsVisited.push(roomId);
    saveState();
    checkAchievements();
  }
}


// ============================================================
// GAME STATE
// ============================================================
const TILE = 48;
const MAP_COLS = 16;
const MAP_ROWS = 12;

let arenaState = {active:false,score:0,questions:[],startTime:null,streak:0,timerInterval:null,totalTime:180};

let gameState = {
  hp: 100, maxHp:100,xp:0,level:1,questionsAnswered:0,correctAnswers:0,streak:0,maxStreak:0,
  dailyCorrect:0,dailyTasks:{correct5:false,correct10:false,streak3:false},
  lastDailyReset:null,
  cards:[], // array of card ids owned
  unlockedAchievements:[],
  roomsVisited:[],
  completedDailyTasks:0,
  // Phase 3 new fields
  arenaParticipated:0,
  arenaPerfect:0,
  arenaTop10:0,
  arenaScores:[], // {score, date, rank}
  wrongAnswers:0,
  hpLowCorrect:0,
  hpNoLossStreak:0,
  speedAnswers:0,
  morningAnswers:0,
  roomCorrect:{}, // {roomId: count}
  friendCode:'', // e.g. 'ABC123'
  friends:[], // array of friend UIDs/names
  sharedCode:0,
  // Phase 4 - Boss battle fields
  bossesDefeated:0,
  bossPerfect:0,
  bossCooldowns:{}, // {bossId: timestamp}
  bossDefeatedSet:[], // array of boss ids that have been defeated
  // Phase 4 - Daily challenge fields
  lastDailyChallenge:'', // date string
  dailyChallengeCompleted:false,
  dailyChallengeStreak:0,
  // Phase 5 - Dynamic difficulty
  currentDifficulty:1, // 1=easy, 2=medium, 3=hard
  consecutiveCorrect:0,
  consecutiveWrong:0,
  // Phase 5 - Daily login reward
  loginStreak:0,
  lastLoginDate:'',
  // Phase 5 - Credits
  credits:0,
  // Phase 5 - Tutorial
  tutorialDone:false,
  // P5 - Selected avatar (1-4)
  selectedAvatar:1,
};
let dailyTasksState = {
  tasks:[
    {id:'correct5',name:'答對5題',desc:'答對5道題目',target:5,reward:50,current:0,rewarded:false},
    {id:'correct10',name:'答對10題',desc:'答對10道題目',target:10,reward:100,current:0,rewarded:false},
    {id:'streak3',name:'連勝3題',desc:'連續答對3道題目',target:3,reward:75,current:0,rewarded:false},
  ]
};

// ============================================================
// FIREBASE HELPERS
// ============================================================
function getPlayerRef(uid){return db.ref('players/'+uid)}
function getLeaderboardRef(){return db.ref('leaderboard')}
function getOnlineRef(uid){return db.ref('online/'+uid)}

function syncToFirebase(){
  if(!firebaseConfigured||!currentUser)return;
  // Full state sync - cards, achievements, all progress
  const updates={
    level:gameState.level,xp:gameState.xp,hp:gameState.hp,maxHp:gameState.maxHp,
    questionsAnswered:gameState.questionsAnswered,correctAnswers:gameState.correctAnswers,
    wrongAnswers:gameState.wrongAnswers||0,
    streak:gameState.streak,maxStreak:gameState.maxStreak,
    dailyCorrect:gameState.dailyCorrect,dailyStreak:gameState.dailyStreak||0,
    completedDailyTasks:gameState.completedDailyTasks||0,
    cards:gameState.cards||[],
    unlockedAchievements:gameState.unlockedAchievements||[],
    roomsVisited:gameState.roomsVisited||[],
    arenaParticipated:gameState.arenaParticipated||0,
    arenaPerfect:gameState.arenaPerfect||0,
    friendCode:gameState.friendCode||'',
    // Phase 4
    bossesDefeated:gameState.bossesDefeated||0,
    bossPerfect:gameState.bossPerfect||0,
    bossDefeatedSet:gameState.bossDefeatedSet||[],
    lastDailyChallenge:gameState.lastDailyChallenge||'',
    dailyChallengeCompleted:gameState.dailyChallengeCompleted||false,
    dailyChallengeStreak:gameState.dailyChallengeStreak||0,
    // Phase 5
    currentDifficulty:gameState.currentDifficulty||1,
    credits:gameState.credits||0,
    loginStreak:gameState.loginStreak||0,
    tutorialDone:gameState.tutorialDone||false,
    lastPlayed:Date.now()
  };
  getPlayerRef(currentUser.uid).update(updates);
  getLeaderboardRef().child(currentUser.uid).update({
    name:currentUser.displayName||currentUser.email||'Player',
    email:currentUser.email||'',
    level:gameState.level,xp:gameState.xp,lastPlayed:Date.now()
  });
}

function loadFromFirebase(uid){
  return getPlayerRef(uid).once('value').then(snap=>{
    if(snap.exists()){
      const d=snap.val();
      // Merge Firebase data, keep local arrays if Firebase is empty
      if(d.cards&&Array.isArray(d.cards)&&d.cards.length>0)gameState.cards=d.cards;
      if(d.unlockedAchievements&&Array.isArray(d.unlockedAchievements))gameState.unlockedAchievements=d.unlockedAchievements;
      if(d.roomsVisited&&Array.isArray(d.roomsVisited))gameState.roomsVisited=d.roomsVisited;
      // Numeric fields - take max to avoid losing progress
      ['level','xp','hp','maxHp','questionsAnswered','correctAnswers','wrongAnswers',
       'streak','maxStreak','dailyCorrect','dailyStreak','completedDailyTasks',
       'arenaParticipated','arenaPerfect','bossesDefeated','bossPerfect','dailyChallengeStreak',
       'credits','loginStreak','currentDifficulty'].forEach(k=>{
        if(d[k]!==undefined)gameState[k]=Math.max(gameState[k]||0,d[k]);
      });
      if(d.friendCode)gameState.friendCode=d.friendCode;
      if(d.lastDailyChallenge)gameState.lastDailyChallenge=d.lastDailyChallenge;
      if(d.dailyChallengeCompleted!==undefined)gameState.dailyChallengeCompleted=d.dailyChallengeCompleted;
      if(d.bossDefeatedSet&&Array.isArray(d.bossDefeatedSet))gameState.bossDefeatedSet=d.bossDefeatedSet;
      if(d.tutorialDone!==undefined)gameState.tutorialDone=d.tutorialDone;
      saveState();
      updateHUD();
      console.log('Loaded from Firebase: Lv'+gameState.level+', '+gameState.cards.length+' cards');
    }
  });
}

let batchQueue=[];
let lastSyncTime=0;
const SYNC_INTERVAL=30000; // 30 seconds

function queueAnswer(questionId,isCorrect,difficulty){
  batchQueue.push({questionId,isCorrect,difficulty,timestamp:Date.now()});
  const now=Date.now();
  if(now-lastSyncTime>SYNC_INTERVAL){flushBatch();lastSyncTime=now;}
}

function flushBatch(){
  if(!currentUser||batchQueue.length===0)return;
  const payload={uid:currentUser.uid,name:currentUser.displayName||'Player',
    ...gameState,answers:batchQueue.slice(-20),timestamp:Date.now()};
  // Send to GAS if configured
  if(gasUrl){
    fetch(gasUrl,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'sync',...payload})}).catch(()=>{});
  }
  batchQueue=[];
}

function syncOnlineStatus(){
  if(!firebaseConfigured||!currentUser)return;
  const onRef=getOnlineRef(currentUser.uid);
  onRef.set({name:currentUser.displayName||'Player',lastSeen:Date.now()});
  onRef.onDisconnect().remove();
}

// ============================================================
// GAS (Google Apps Script) HELPERS
// ============================================================
function submitToGAS(answerData){
  if(!gasUrl)return;
  fetch(gasUrl,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action:'submitAnswer',uid:currentUser?.uid,...answerData})}).catch(()=>{});
}

// ============================================================
// AUTHENTICATION
// ============================================================
