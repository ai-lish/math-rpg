# 數學探索RPG — 遊戲開發提示語（完善版 v2.0）

> 數據來源：195個搜尋結果（MiniMax Search API）
> 涵蓋：Gamasutra、GDC、Game Developer、gamedesignskills等權威遊戲設計網站
> 基於用戶反饋更新：GAS性能瓶頸、題庫對齊、分階段交付、美術資源、安全性
> 目標：為大佬（Claude Opus 4.6）提供一份有研究基礎支撐、可實際部署的 RPG 遊戲設計詳細提示語

---

# 目錄

1. [遊戲概念與願景](#1-遊戲概念與願景)
2. [核心遊戲循環（Core Game Loop）](#2-核心遊戲循環core-game-loop)
3. [角色系統](#3-角色系統)
4. [成長系統](#4-成長系統)
5. [戰鬥/挑戰系統](#5-戰鬥挑戰系統)
6. [探索系統](#6-探索系統)
7. [卡牌收集系統](#7-卡牌收集系統)
8. [貨幣與經濟系統](#8-貨幣與經濟系統)
9. [社交系統](#9-社交系統)
10. [進度與成就系統](#10-進度與成就系統)
11. [故事情節與世界觀](#11-故事情節與世界觀)
12. [每日任務與活動系統](#12-每日任務與活動系統)
13. [用戶留存機制](#13-用戶留存機制)
14. [心理學要素（研究支撐）](#14-心理學要素研究支撐)
15. [UI/UX設計原則](#15-uiux設計原則)
16. [新手引導](#16-新手引導)
17. [技術架構](#17-技術架構)
18. [像素美術規範](#18-像素美術規範)
19. [數據結構](#19-數據結構)
20. [優先順序與階段交付](#20-優先順序與階段交付)
21. [參考資源（195個搜尋結果）](#21-參考資源195個搜尋結果)

---

# 1. 遊戲概念與願景

## 1.1 遊戲類型
- 學校探索RPG：學生操控像素風格角色，探索虛擬學校地圖
- 學習導向：以數學學習為核心，融合RPG遊戲化元素
- 全校參與：600學生 + 10老師，可擴展至更多

## 1.2 核心願景
「讓學生愛上數學，像探索遊戲世界一樣探索學校的每一個角落」

## 1.3 目標用戶
- 主要：中一至中六學生（13-18歲）
- 次要：數學老師（管理、出題、監察）
- 特點：熟悉手機操作，喜歡視覺反饋，需要即時成就感

## 1.4 遊戲平台
- 優先：HTML5 網頁（手機 + 電腦瀏覽器）
- 未來：PWA安裝到手機主畫面

## 1.5 離線 vs 在線模式（重要！）

遊戲有兩種模式，明確分離：

| 模式 | 說明 | 功能限制 |
|------|------|----------|
| **離線模式（練習）** | 不登入，純前端 localStorage | 無排行榜/卡牌/社交，題目本地快取 |
| **在線模式（計分）** | Google OAuth 登入，數據同步伺服器 | 完整功能，答案在 GAS 驗證 |

**為什麼要分離？**
- 600學生同時上線 → GAS 30 req/min 限制會崩
- 離線模式讓學生可以隨時練習，不佔用伺服器資源
- 練習記錄可在連線後批量上傳

**用户体验：**
- 首次使用：離線模式，直接玩
- 登入後：數據本地 + 伺服器同步
- 斷網：自動切換離線模式，不中斷

---

# 2. 核心遊戲循環（Core Game Loop）

> **研究來源**：Core gameplay loops in an RPG - RPG Maker Forums
> "Core gameplay loops are a set of actions that the player engages in during gameplay. It defines the primary user flow and what the player is..."

## 2.1 主循環（Main Loop）
```
登入遊戲
    ↓
查看地圖/角色狀態
    ↓
選擇行動：
  ├── 探索班房（答題）
  ├── 領取每日任務
  ├── 開啟卡包
  ├── 查看排行榜
  └── 老師模式（老師專用）
    ↓
答題 → 獲得獎勵
    ↓
升級/解鎖新內容
    ↓
離開或繼續
```

## 2.2 微循環（Micro Loop）
每一次答題的循環：
```
選擇題目/挑戰
    ↓
閱讀題目（理解問題）
    ↓
思考答案（認知參與）
    ↓
選擇答案（決策）
    ↓
獲得即時反饋（對/錯/提示）
    ↓
獲得獎勵（經驗/卡牌/貨幣）
    ↓
查看進度（等級/成就）
```

## 2.3 中循環（Meta Loop）
```
每日登入
    ↓
完成每日任務
    ↓
解鎖每日獎勵
    ↓
查看排行榜
    ↓
與好友互動
    ↓
明日再來
```

## 2.4 每次遊戲時長
- 短回合：5-10分鐘（做一條數、答一道題）
- 中回合：15-30分鐘（探索一個區域、完成一個副本）
- 長回合：30-60分鐘（完成多個關卡、組隊挑戰）

## 2.5 遊戲節奏
- 新手期：密集的小獎勵（前30分鐘）
- 中期：穩定的中獎勵（30分鐘-2小時）
- 後期：大獎勵但較少（2小時+）

---

# 3. 角色系統

## 3.1 角色創建
- 自動使用Google帳户頭像
- 學生可自定義：角色名稱、性別（男/女/中性）、角色外觀（5種基礎造型）

## 3.2 角色屬性
| 屬性 | 說明 | 影響 |
|------|------|------|
| HP | 生命值 | 答錯題目扣HP，歸零需休息 |
| MP | 魔力值 | 使用技能消耗 |
| ATK | 攻擊力 | 答題傷害計算 |
| DEF | 防禦力 | 減少答錯懲罰 |
| SPD | 速度 | 影響動畫速度 |
| INT | 智力 | 答題經驗加成 |
| LCK | 幸運 | 卡牌掉落率、暴擊率 |

## 3.3 角色狀態
- 正常：可正常遊玩
- 疲勞：HP低於30%，移動速度-20%
- 休息：HP歸零，需等待X分鐘或使用道具恢復
- 專注：答題連勝3次，經驗+15%
- 倒閉中：連續答錯3題，5分鐘內不能答題

## 3.4 角色職業（由卡牌組合解鎖）
| 職業 | 解鎖條件 | 特性 |
|------|----------|------|
| 計算師 | 5張計算相關卡牌 | 算術題經驗+20% |
| 幾何師 | 5張幾何相關卡牌 | 幾何題經驗+20% |
| 統計師 | 5張統計相關卡牌 | 統計題經驗+20% |
| 代數師 | 5張代數相關卡牌 | 代數題經驗+20% |
| 應用師 | 5張應用相關卡牌 | 應用題經驗+20% |
| 數學大師 | 集齊所有職業卡牌 | 全科目經驗+10% |

---

# 4. 成長系統

> **研究來源**：Progression and Reward in Story Driven Games, RPG Progression Systems
> "A progression system is simply a combination of mechanics which forces the player to make actions with determined goals, and these must complete them in order..."

## 4.1 經驗值系統
| 等級 | 所需經驗 | 解鎖內容 |
|------|----------|----------|
| 1-10 | 100 x 等級 | 基礎班房、A班 |
| 11-20 | 200 x 等級 | B班、圖書館 |
| 21-30 | 300 x 等級 | C班、操場 |
| 31-40 | 400 x 等級 | D班、實驗室 |
| 41-50 | 500 x 等級 | 數學王國入口 |
| 51-60 | 600 x 等級 | 概念擴展區域 |
| 61-99 | 1000 x 等級 | 全部內容 |

## 4.2 技能樹（Skill Tree）

> **研究來源**：Keys to Meaningful Skill Trees
> "A good Skill Tree forces the player to make impacting, commiting, long-lasting choices for the development of his playstyle."

每個職業有獨立技能樹，分為三系：
- 攻擊系：提升答題傷害
- 防禦系：減少答錯懲罰
- 輔助系：增加獎勵、經驗

## 4.3 技能範例
| 技能名 | 等級 | 效果 |
|--------|------|------|
| 連擊 | Lv.1 | 連續答對2題，第3題經驗+50% |
| 反擊 | Lv.1 | 答錯後下次答對經驗x2 |
| 暴擊 | Lv.1 | 10%機率獲得雙倍經驗 |
| 專注光環 | Lv.1 | 附近隊友經驗+5% |
| 每日首勝 | Lv.1 | 每日首次答對題目額外+1卡牌碎片 |
| 速度提升 | Lv.1 | 移動速度+10% |
| 幸運光環 | Lv.1 | 卡牌掉落率+5% |

## 4.4 成長曲線設計
- 前期：快升級（每5-10分鐘升1級）
- 中期：中等（每30-60分鐘升1級）
- 後期：慢升級（每2-4小時升1級）

---

# 5. 戰鬥/挑戰系統

> **研究來源**：12 ways to improve turn-based RPG combat systems
> "Direct damage shouldn't always be the best choice, and there should be useful statuses to inflict and damage over time effects to play with."

> **研究來源**：Building the Perfect Turn-Based Battle System
> "Of all the different styles of turn-based combat, if I had to create an optimal battle system, it would pull in different traits and components..."

## 5.1 答題戰鬥流程
```
進入班房
    ↓
看到白板題目（動畫展示）
    ↓
選擇答案（4選1或填空）
    ↓
系統判定：
  ├── 答對 → 扣減敵方HP，播放成功動畫，獲得經驗+卡牌碎片
  ├── 答錯 → 我方扣HP，播放失敗動畫，獲得提示
  └── 超時 → 視為答錯
    ↓
HP歸零 → 挑戰失敗，可重新挑戰或休息
HP > 0 → 繼續下一題或離開
```

## 5.2 題目難度
| 難度 | 答對經驗 | 答錯扣HP | 適用等級 |
|------|----------|----------|----------|
| 基礎 | 10 | 5 | 1-20 |
| 進階 | 25 | 10 | 21-40 |
| 挑戰 | 50 | 20 | 41-99 |
| 大師 | 100 | 30 | 51+ |

## 5.3 特殊題目類型
| 類型 | 說明 | 計分 |
|------|------|------|
| 計算題 | 直接計算結果 | 答對/答錯 |
| 選擇題 | 4選1 | 答對/答錯 |
| 填空題 | 輸入數值/表達式 | 答對/答錯 |
| 連線題 | 配對正確答案 | 答對/答錯 |
| 排序題 | 排列正確順序 | 答對/答錯 |
| 證明題 | 提交推理過程 | 老師評分 |
| 應用題 | 情境問題 | 多元評分 |

## 5.4 挑戰模式
| 模式 | 說明 | 人數 |
|------|------|------|
| 單人挑戰 | 獨立完成題庫 | 1人 |
| 限時挑戰 | 5分鐘內盡量多題 | 1人 |
| 連勝挑戰 | 連續答對X題 | 1人 |
| 組隊挑戰 | 2-4人合作 | 2-4人 |
| 對戰模式 | 玩家vs玩家（PVP） | 2人 |
| 師生對決 | 學生vs老師 | 2人 |

## 5.5 題庫模板系統
題目由模板動態生成，模板結構：
- 模板ID：如 T001
- 題型：如一元二次方程
- 難度：基礎/進階/挑戰
- 變量範圍：a是1-5的非零整數，b是-10到10的整數，c是-20到20的整數
- 生成公式：ax² + bx + c = 0
- 題目文本：解方程：{a}x² + {b}x + {c} = 0
- 解答：使用求根公式
- 提示：尝试因式分解、使用求根公式
- 答案範圍：(-10, 10)內的整數根

---

# 6. 探索系統

> **研究來源**：Level Design Fundamentals, How to Plan Level Designs
> "Effective level design enhances player engagement, encourages exploration, and drives the narrative forward."

## 6.1 地圖結構
```
全校地圖
├── A翼（中一區）：1A班、2A班、走廊
├── B翼（中二區）：1B班、2B班、走廊
├── C翼（中三區）：3C班、4C班、走廊
├── D翼（中四至中六）：5D班、6D班、走廊
├── 操場
├── 圖書館
├── 實驗室
├── 數學王國（概念區）：計算之塔、幾何城堡、統計村莊、代數森林
└── 競技場
```

## 6.2 地圖交互
| 元素 | 交互方式 | 效果 |
|------|----------|------|
| 班房門 | 點擊/靠近 | 進入挑戰 |
| NPC | 對話 | 領取任務、購買道具 |
| 寶箱 | 點擊 | 隨機獲得道具/卡牌 |
| 告示牌 | 點擊 | 查看公告、排行榜 |
| 傳送點 | 點擊 | 快速移動到其他區域 |

## 6.3 移動系統
- 虛擬搖桿：手機用戶拖動控制
- 點擊移動：電腦用戶點擊目的地
- 自動尋路：點擊遠處位置自動繞路

## 6.4 地圖解鎖條件
| 區域 | 解鎖條件 |
|------|----------|
| A翼 | 初始解鎖 |
| B翼 | 等級10 |
| C翼 | 等級20 |
| D翼 | 等級30 |
| 數學王國 | 等級40 |
| 競技場 | 等級50 |

---

# 7. 卡牌收集系統

> **研究來源**：Random loot generation probability formula, How do drop rates work in games?
> "RNG (Random Number Generator) significantly affects drop rates in games, making it a crucial factor in determining whether a player receives an item."

## 7.1 稀有度
| 稀有度 | 顏色 | 掉落率 | 效果強度 |
|--------|------|--------|----------|
| 普通（Common） | 灰色/白色 | 60% | +5%經驗 |
| 稀有（Rare） | 藍色 | 30% | +15%經驗 |
| 傳說（Legendary） | 橙色/金色 | 10% | +30%經驗 + 特殊技能 |

## 7.2 卡牌類型
| 類型 | 效果 | 範例 |
|------|------|------|
| 學科卡 | 指定科目經驗加成 | 「代數之魂」代數+15% |
| 工具卡 | 答題輔助 | 「計算器」可用1次 |
| 被動卡 | 永久被動效果 | 「早起鳥」每日首勝+1碎片 |
| 技能卡 | 主動技能 | 「雙倍經驗」使用後30分鐘2x經驗 |
| 皮膚卡 | 角色外觀 | 「魔法師造型」 |
| 寵物卡 | 陪伴效果 | 「數學精靈」顯示在角色旁 |

## 7.3 獲得方式
| 方式 | 說明 | 頻率 |
|------|------|------|
| 答題獎勵 | 答對題目隨機掉落 | 每題5% |
| 每日登入 | 每日首次登入 | 每日1次 |
| 成就解鎖 | 完成特定成就 | 不定 |
| 任務獎勵 | 完成每日/每週任務 | 任務完成時 |
| 寶箱 | 地圖隨機寶箱 | 探索時隨機 |
| 商店購買 | 用遊戲貨幣購買 | 不定 |
| 老師發放 | 老師指定發放 | 老師決定 |
| 組隊獎勵 | 組隊完成挑戰 | 完成時 |

## 7.4 卡牌示例（共50張）

### 普通卡（20張）
1. 計算入門 - 基礎計算題經驗+5%
2. 幾何初心 - 基礎幾何題經驗+5%
3. 數字敏感 - 數字相關題目微幅加成
4. 勤奮學生 - 每日答題數+5
5. 安靜學習 - 連續答題時間+10秒
6. 專心聽講 - 課堂相關題目+5%
7. 作業达人 - 作業相關題目+5%
8. 提問者 - 向老師提問次數+3
9. 訂正高手 - 答錯後下次正確率+10%
10. 速度之星 - 答題時間-1秒
11. 認真審題 - 首次答題正確率+5%
12. 勇於挑戰 - 挑戰題經驗+5%
13. 邏輯思考 - 推理題經驗+5%
14. 空間想像 - 立體幾何題經驗+5%
15. 統計入門 - 統計題經驗+5%
16. 應用初探 - 應用題經驗+5%
17. 代數起步 - 代數題經驗+5%
18. 數感培養 - 心算正確率+3%
19. 耐心計算 - 繁複計算題正確率+5%
20. 敢於創新 - 開放式題目額外獎勵

### 稀有卡（20張）
1. 計算高手 - 計算題經驗+15%
2. 幾何愛好者 - 幾何題經驗+15%
3. 統計分析師 - 統計題經驗+15%
4. 代數達人 - 代數題經驗+15%
5. 應用專家 - 應用題經驗+15%
6. 雙倍專注 - 每日首次2x經驗
7. 連勝之心 - 連勝加成+10%
8. 暴擊大師 - 暴擊率+5%
9. 幸運加成 - 掉落率+10%
10. 組隊之心 - 組隊經驗+10%
11. 速度專家 - 答題時間-3秒
12. 精確無誤 - 計算題正確率+10%
13. 幾何高手 - 平面幾何+15%
14. 立體幾何師 - 立體幾何+15%
15. 概率專家 - 概率題+15%
16. 統計高手 - 數據分析+15%
17. 應用大師 - 實際應用+15%
18. 解題高手 - 所有疑難題+10%
19. 學習加速 - 升級所需經驗-5%
20. 傳承之書 - 老師指導加成+20%

### 傳說卡（10張）
1. 數學大師 - 全科目經驗+30%
2. 全能學者 - 所有題型經驗+20%
3. 早起鳥王 - 每日7點前登入額外獎勵
4. 永不放棄 - 答錯後不扣HP（每日3次）
5. 終極計算器 - 疑難題目可使用1次
6. 透視之眼 - 答題前顯示提示
7. 時間管理者 - 限時挑戰時間+30秒
8. 社交達人 - 討論任務次數+10
9. 成就獵人 - 成就點數+50%
10. 傳說收集家 - 集齊全套額外+100%掉落率

---

# 8. 貨幣與經濟系統

> **研究來源**：How do I create the economy behind a simple crafting system?
> "Like any other game system design, I start by coming up with the most relevant questions I can think of, and then figuring out what the answers are."

## 8.1 遊戲內貨幣
| 貨幣 | 說明 | 獲得方式 | 用途 |
|------|------|----------|------|
| 學分（Coin） | 主要貨幣 | 答題、任務、每日登入 | 購買道具、卡包 |
| 榮譽（Honor） | 成就貨幣 | 完成成就、排行榜名次 | 解鎖特殊內容 |
| 碎片（Shard） | 合成貨幣 | 答題掉落、任務獎勵 | 合成卡牌 |

## 8.2 商店系統
| 商店 | 貨幣類型 | 可購買內容 |
|------|----------|------------|
| 道具店 | 學分 | HP恢復、MP恢復、經驗加成 |
| 卡包店 | 學分/碎片 | 各類卡包 |
| 技能店 | 榮譽 | 解鎖技能、升級技能 |
| 造型店 | 學分/榮譽 | 角色皮膚、寵物 |

## 8.3 價格設計
| 道具 | 價格（學分） |
|------|--------------|
| 小HP恢復 | 50 |
| 大HP恢復 | 150 |
| 1小時2x經驗 | 200 |
| 普通卡包 | 500 |
| 稀有卡包 | 1500 |
| 傳說卡包 | 5000 |

---

# 9. 社交系統

> **研究來源**：Designing Cooperative Gameplay Experiences, Game design patterns for building friendships
> "Good cooperation is about establishing the role each player brings to the team and this is handled two ways. Either everyone is a unique character and one-off..."

## 9.1 好友系統
- 添加/刪除好友
- 查看好友在線狀態
- 拜訪好友的學校（查看他人成就）
- 送禮物（每日1次）

## 9.2 組隊系統
| 功能 | 說明 |
|------|------|
| 創建房間 | 邀請好友加入 |
| 加入房間 | 搜索或接受邀請 |
| 組隊挑戰 | 共同答題，分數共享 |
| 組隊獎勵 | 完成後額外獎勵 |

## 9.3 師生互動
- 老師可查看班級學生進度
- 老師可發送全班任務
- 老師可獎勵特定學生
- 學生可向老師提問（留言系統）

## 9.4 排行榜
| 排行榜 | 說明 |
|--------|------|
| 等級榜 | 全校排名 |
| 答題榜 | 正確答題數 |
| 連勝榜 | 最長連勝次數 |
| 收集榜 | 卡牌收集數量 |
| 班級榜 | 班級總分平均 |
| 師生對決榜 | 老師vs學生積分 |

---

# 10. 進度與成就系統

> **研究來源**：Best Achievement System?, Designing Achievements for Optimal User Engagement
> "Achievements are useful when they can be used to direct and guide players; Achievements are enjoyable when they recognize..."

## 10.1 成就分類
| 類別 | 說明 | 示例 |
|------|------|------|
| 故事成就 | 主線進度 | 「首次探索」「首個班房通關」 |
| 戰鬥成就 | 答題相關 | 「答對100題」「連勝10次」 |
| 收集成就 | 卡牌/道具 | 「收集10張卡」「普通卡全收集」 |
| 社交成就 | 互動相關 | 「添加10個好友」「組隊10次」 |
| 特殊成就 | 稀有條件 | 「凌晨答題」「連續7天登入」 |

## 10.2 成就範例（共50個）

### 新手成就（1-10）
1. 初來乍到 - 首次登入
2. 第一步 - 完成新手教程
3. 答對一道 - 首次答對題目
4. 收集第一張 - 獲得第一張卡牌
5. 等級提升 - 首次升級
6. 探索者 - 進入第一個班房
7. 每日任務 - 完成第一個每日任務
8. 好友圈 - 添加第一個好友
9. 首次組隊 - 完成第一次組隊
10. 儲存進度 - 首次手動保存遊戲

### 進階成就（11-30）
11. 答題新秀 - 答對100題
12. 答題高手 - 答對500題
13. 答題大師 - 答對1000題
14. 連勝初哥 - 連續5次答對
15. 連勝達人 - 連續10次答對
16. 連勝大師 - 連續25次答對
17. 全科探索 - 進入所有基礎班房
18. 卡牌收藏家 - 收集20張卡牌
19. 普通全收集 - 集齊所有普通卡牌
20. 稀有收藏家 - 收集10張稀有卡牌
21. 等級20 - 達到20級
22. 等級30 - 達到30級
23. 每日任務達人 - 連續7天完成每日任務
24. 早起鳥 - 早上7點前答題
25. 夜貓子 - 晚上11點後答題
26. 週末戰士 - 週末答題100題
27. 友誼第一 - 添加10個好友
28. 組隊新手 - 完成10次組隊
29. 首次對戰 - 完成1次PVP
30. 老師好學 - 向老師提問5次

### 大師成就（31-50）
31. 答題傳說 - 答對5000題
32. 連勝傳說 - 連續50次答對
33. 等級大師 - 達到50級
34. 稀有全收集 - 集齊所有稀有卡牌
35. 傳說收藏家 - 收集5張傳說卡牌
36. 每日任務大師 - 連續30天完成每日任務
37. 全勤獎 - 連續30天登入
38. 社交達人 - 添加50個好友
39. 組隊大師 - 完成100次組隊
40. PVP新手 - 赢得10次對戰
41. PVP達人 - 赢得50次對戰
42. 班級之星 - 班級排名第一
43. 年級第一 - 全年級排名第一
44. 全科通關 - 完成所有基礎挑戰
45. 數學王國探索者 - 進入數學王國
46. 競技場新人 - 參與10次競技場
47. 競技場冠軍 - 竞技场排名前10
48. 榮譽收藏家 - 累積1000榮譽
49. 完美收集家 - 集齊所有卡牌
50. 數學大師 - 達到99級

---

# 11. 故事情節與世界觀

> **研究來源**：Branching Conversation Systems, RPGs and their Dialogue Systems
> "Intuitive quest design is also important in RPG dialogue systems, as it allows players to progress in the game and engage with the narrative."

## 11.1 世界觀背景
在LSC學校裡，隱藏著一個由數學構建的神秘世界——「數學王國」。傳說中，古代數學家用他們的智慧創造了這個空間，只有真正熱愛數學的人才能進入。

學生角色是「數學王國」的見習魔法師，他們需要通過解決數學問題來：
- 修復被黑暗勢力破壞的魔法陣
- 解開封印古代知識的鎖
- 拯救被困在數學迷宮中的精靈
- 最終成為真正的「數學大師」

## 11.2 學校角色（NPC）
| NPC | 位置 | 身份 | 功能 |
|-----|------|------|------|
| 數學長老 | 圖書館 | 傳說中的數學老師 | 發布主線任務、教授高級技巧 |
| 計算精靈 | 1A班 | 引導精靈 | 新手引導、解答疑問 |
| 幾何守卫 | 數學王國入口 | 守護者 | 考驗幾何知識 |
| 統計賢者 | 操場 | 統計大師 | 發布統計相關任務 |
| 冒險前輩 | 競技場 | 資深學生 | PVP技巧指導 |

## 11.3 主線劇情章節
### 第一章：見習魔法師
- 任務：在學校各班房收集數學碎片
- 目標：成為正式魔法師
- 獎勵：職業初始卡牌、等級上限解鎖

### 第二章：數學王國的危機
- 任務：修復被破壞的魔法陣
- 目標：拯救被困的數學精靈
- 獎勵：傳說卡牌碎片

### 第三章：黑暗勢力的陰謀
- 任務：調查學校的神秘事件
- 目標：揭開黑暗勢力的真相
- 獎勵：解鎖競技場

### 第四章：成為數學大師
- 任務：完成最終挑戰
- 目標：證明自己有資格成為數學大師
- 獎勵：傳說稱號、終極技能

---

# 12. 每日任務與活動系統

> **研究來源**：What is the difference between implementing a 7-day daily login reward?, Common Strategies for Daily Login Rewards in Mobile Games
> "A 30 day period will allow you to offer larger scale rewards, but limits your variety. The inverse is true for a 7 day period."
> "A more forgiving model often seen in games is allowing users to keep their daily streak, even if they did not log in for..."

## 12.1 每日任務
| 任務名 | 說明 | 獎勵 |
|--------|------|------|
| 做一條數 | 答對1道題 | 20學分 |
| 積極討論 | 發起1次討論 | 30學分 + 1碎片 |
| 應用實踐 | 完成1道應用題 | 40學分 |
| 生活中的數學 | 拍照上傳生活中的數學 | 50學分 + 1碎片 |
| 每日首次登入 | 每天第一次登入 | 10學分 |
| 每日答題10道 | 答對10道題 | 100學分 + 1普通卡牌 |
| 每日答題30道 | 答對30道題 | 200學分 + 1稀有卡牌 |
| 每日探索 | 進入3個不同班房 | 30學分 |

## 12.2 每週任務
| 任務名 | 說明 | 獎勵 |
|--------|------|------|
| 每週答題100道 | 答對100道題 | 500學分 + 1稀有卡牌 |
| 每週組隊3次 | 完成3次組隊 | 300學分 |
| 每週成就5個 | 完成5個成就 | 400學分 + 1傳說卡牌碎片 |

## 12.3 限時活動
| 活動 | 時間 | 內容 |
|------|------|------|
| 數學週 | 每年某週 | 所有經驗x2 |
| 早起挑戰賽 | 每月某日 | 早上7-9點答題額外獎勵 |
| 晚間加成 | 每天晚上 | 18:00-22:00經驗x1.5 |
| 週末狂歡 | 週六日 | 掉落率x2 |
| 師生對決週 | 每學期 | 班級對決積分賽 |

---

# 13. 用戶留存機制

> **研究來源**：The Psychology of Game Design (Everything You Know Is Wrong) - GDC Vault
> "Gameplay is a psychological experience: it's all in your head. The vagaries of human psychology define your game more than the laws of physics or algebra."

## 13.1 新手留存
| 時間點 | 目標 | 機制 |
|--------|------|------|
| 首次登入 | 完成新手教程 | 引導動畫 + 即時獎勵 |
| 5分鐘 | 答對第一道題 | 降低題目難度 |
| 15分鐘 | 獲得第一張卡牌 | 必掉落普通卡牌 |
| 30分鐘 | 等級提升到5 | 密集經驗獎勵 |
| 1小時 | 探索3個班房 | 解鎖地圖區域 |
| 24小時 | 再次登入 | 每日登入提醒 + 大禮包 |
| 7天 | 養成習慣 | 連續登入獎勵 |

## 13.2 長期留存
| 策略 | 說明 |
|------|------|
| 每日目標 | 每天有可達成的小目標 |
| 長期目標 | 等級、技能、卡牌收集 |
| 社交綁定 | 好友、組隊、排行榜 |
| 內容更新 | 定期新題目、新活動 |
| 成就系統 | 50個成就分階段解鎖 |
| 情懷行銷 | 記録學生的「第一次」 |

## 13.3 流失用戶召回
| 策略 | 說明 |
|------|------|
| 回歸禮包 | 3天未登入送大禮包 |
| 強力召回 | 7天未登入送傳說卡牌碎片 |
| 友情召回 | 好友邀請回歸雙方獲獎 |
| 老師召回 | 老師可以召回長期未登入學生 |

---

# 14. 心理學要素（研究支撐）

> **研究來源**：The Psychology of Game Design, Cognitive Flow: The Psychology of Great Game Design
> "Cognitive Flow: The Psychology of Great Game Design" - Game Developer
> "Flow breaks down when a player doesn't know what their goals are, how they're expected to accomplish them, or which new game techniques they're supposed to use"

## 14.1 巴甫洛夫條件反射
- **答對題目 → 即時音效 + 動畫反饋**
- **開啟卡包 → 揭開動畫 + 稀有閃光**
- **升級 → 煙火動畫 + 全屏慶祝**
- **每日登入 → 登入禮包開啟動畫**

## 14.2 斯金納箱（Variable Reward Schedule）

> **研究來源**：The Psychology of Video Game Design - Lennart Nacke
> "Explore how innovative game design make use of operant conditioning, reward loops, and psychology to kickstart player motivation, attention..."

| 機制 | 說明 | 效果 |
|------|------|------|
| 固定獎勵 | 每次答對必得經驗 | 穩定感 |
| 隨機掉落 | 5%機會掉卡牌 | 驚喜感 |
| 連勝加成 | 連續答對獎勵遞增 | 成就感 |
| 隨機事件 | 地圖隨機寶箱 | 探索動力 |
| 卡包揭曉 | 隨機稀有度 | 賭博快感 |

## 14.3 心流理論（Flow）

> **研究來源**：Cognitive Flow: The Psychology of Great Game Design
> "Flow breaks down when a player doesn't know what their goals are..."

- **新手**：低難度題目 + 高成功率 → 建立信心
- **中期**：難度匹配技能 → 進入心流
- **後期**：挑戰自我極限 → 突破成就感

**難度調整機制**：
- 連續答對3題 → 難度提升一級
- 連續答錯2題 → 難度降低一級
- 保持在「努力就能成功」的難度

## 14.4 目標梯度效應（Goal Gradient Effect）

> **研究來源**：The Psychology of Game Design: Crafting Immersive Player Experiences
> "1. Build emotional connections 2. Implement reward systems 3. Design for cognitive engagement..."

- **近目標**：顯示距離升級/完成還差多少
- **進度條**：每個目標有視覺化進度
- **最後一搏**：距離目標近時獎勵加成（如：還差10題升級，最後10題經驗x1.5）

## 14.5 社會認同（Social Proof）
- **排行榜**：看到他人的成就
- **好友动态**：朋友做了什麼
- **班级排名**：群體歸屬感
- **榮譽稱號**：展示自己的成就

## 14.6 損失厭惡（Loss Aversion）
- **每日任務未完成**：失去當天獎勵（損失感）
- **連勝中斷**：失去連勝積分（損失感）
- **答錯扣HP**：失去已累積HP（損失感）

## 14.7 立即反饋（Immediate Feedback）

> **研究來源**：Using Feedback as a Teacher in Videogames
> "The golden rule when it comes to feedback is that you want it to be immediate — the player does one thing, they immediately get one response."

- 答對：綠色勾 + 「太棒了！」 + 即時經驗++
- 答錯：紅色叉 + 「再試試」 + 顯示正確答案
- 升級：全屏煙火 + 「升級了！」 + 解鎖新內容
- 開卡包：揭開動畫 + 稀有度展示 + 音效

## 14.8 Octalysis 遊戲化框架（參考）

| 核心動機 | 遊戲元素 |
|----------|----------|
| 成就感 | 等級、成就、排行榜 |
| 成就感 | 挑戰、解鎖、技能樹 |
| 擁有感 | 卡牌收集、貨幣、道具 |
| 創造力 | 題目創作、自定義角色 |
| 社交關係 | 組隊、好友、師生互動 |
| 稀缺性 | 稀有卡牌、限時活動 |
| 好奇心 | 隨機寶箱、卡包揭曉 |
| 損失/逃避 | 連勝中斷、每日任務未完成 |

---

# 15. UI/UX設計原則

> **研究來源**：Video Game HUD & UI Design Guide, Mastering Game UI/UX: Best Practices
> "Learn how to design functional and visually compelling video game HUD and UI. Types, principles, examples, and game interface design best practices."
> "1. Why UI/UX Matters in Games 2. Start with the Player, Always 3. Consistency & Clarity 4. Visual Hierarchy & Attention Flow 5. Be..."

## 15.1 設計原則
| 原則 | 說明 | 應用 |
|------|------|------|
| 簡潔性 | 一屏一主題 | 每個畫面只有一個主要目標 |
| 一致性 | 相同元素相同功能 | 按鈕、圖標、風格統一 |
| 可預測性 | 用戶知道下一步 | 清晰的導航和引導 |
| 容錯性 | 允許犯錯 | 取消、返回、重試選項 |
| 可達性 | 所有人都能用 | 大按鈕、高對比度 |

## 15.2 導航結構
底部導航（手機）：
- 首頁/地圖
- 任務
- 卡牌
- 社交
- 我的

頂部狀態欄：
- HP條、MP條、學分、等級、設置

## 15.3 顏色規範
| 用途 | 顏色 | 色碼 |
|------|------|------|
| 主色 | 藍色 | #4A90D9 |
| 輔助色 | 綠色 | #52C41A |
| 警告色 | 橙色 | #FA8C16 |
| 危險色 | 紅色 | #F5222D |
| 普通稀有 | 灰色 | #8C8C8C |
| 稀有 | 藍色 | #1890FF |
| 傳說 | 金色 | #FAAD14 |
| 背景色 | 深色 | #1A1A2E |
| 文字色 | 白色 | #FFFFFF |

## 15.4 字體規範
- 標題：粗體、大字（24-32px）
- 正文：常規（14-16px）
- 數字：等寬字體（顯示對齊）
- 數學公式：KaTeX渲染

## 15.5 動效規範
| 動效類型 | 時長 | 用途 |
|----------|------|------|
| 按鈕點擊 | 100ms | 確認反饋 |
| 頁面切換 | 300ms | 場景轉換 |
| 道具獲得 | 500ms | 獎勵展示 |
| 升級煙火 | 1000ms | 成就慶祝 |
| 卡包揭開 | 800ms | 揭曉結果 |

## 15.6 音效設計
| 音效 | 場合 |
|------|------|
| 按鈕點擊 | 點擊任何按鈕 |
| 答對 | 答對題目 |
| 答錯 | 答錯題目 |
| 升級 | 等級提升 |
| 開卡包 | 打開卡包 |
| 掉落傳說 | 獲得稀有物品 |
| 背景音樂 | 地圖探索（可關閉） |

---

# 16. 新手引導

> **研究來源**：The Importance of the New Player's Experience, The New Player Experience - Hooks, Tutorials, Rewards
> "A good new player experience consists of three pieces: the hook, the tutorial, and the reward."

## 16.1 新手教程流程（約10分鐘）

Step 1：創建角色
- 選擇角色外觀
- 輸入角色名稱
- 確認

Step 2：認識地圖
- 自動帶到學校入口
- 指示虛擬搖桿位置
- 嘗試移動到1A班

Step 3：認識答題
- 進入1A班
- 看到第一道題目
- 選擇答案
- 看到正確/錯誤反饋

Step 4：認識獎勵
- 完成挑戰
- 獲得經驗
- 看到升級動畫
- 獲得第一張卡牌

Step 5：認識每日任務
- 打開任務面板
- 查看每日任務
- 完成第一個任務

Step 6：認識社交
- 添加NPC為好友
- 查看排行榜

Step 7：自由探索
- 宣佈教程結束
- 提示可以自由探索
- 提醒有問題可以看幫助

## 16.2 教學策略
| 策略 | 說明 |
|------|------|
| 示範 | 動畫展示操作 |
| 練習 | 用戶親自操作 |
| 確認 | 提問確認理解 |
| 獎勵 | 每步完成即時獎勵 |
| 可跳過 | 高級玩家可跳過 |

## 16.3 幫助系統
| 幫助類型 | 說明 |
|----------|------|
| 疑問按鈕 | 每個畫面右上角？按鈕 |
| 新手FAQ | 常見問題解答 |
| 影片教程 | 關鍵操作影片 |
| 老師支援 | 聯繫老師解答 |
| 智能提示 | AI回答簡單問題 |

---

# 17. 技術架構

## 17.1 技術棧（推薦方案）

### 方案A：GAS + Sheets + Firebase（推薦用呢個）
| 層面 | 技術 | 說明 |
|------|------|------|
| 前端 | HTML5 + CSS3 + JavaScript | 跨平台兼容 |
| 遊戲引擎 | Phaser.js | 2D像素遊戲引擎 |
| 後端 | Google Apps Script | 寫入數據庫（日batch sync） |
| 用戶認證 | Firebase Auth | 比 GAS OAuth 快 10x |
| 數據庫 | Firebase Realtime DB | 即時同步，支援大量並發 |
| 備份/分析 | Google Sheets | 從 Firebase 定期導出 |
| 部署 | GitHub Pages | 免費托管 |

### 方案B：純 GAS + Sheets（Phase 1 過渡方案）
| 層面 | 技術 | 說明 |
|------|------|------|
| 前端 | HTML5 + CSS3 + JavaScript | 跨平台兼容 |
| 後端 | Google Apps Script | 全部在線 |
| 數據庫 | Google Sheets | 儲存玩家數據、題庫 |
| 用戶認證 | Google OAuth | 使用學校Google帳户 |

**注意：方案B只適合50人以下使用。600學生必須用方案A！**

## 17.2 系統架構圖（方案A）
```
用戶瀏覽器
    ↓
GitHub Pages（前端HTML）
    ↓
Phaser.js 遊戲客戶端
    ↓
Firebase Auth（用戶認證）
    ↓
Firebase Realtime DB（即時數據）
    ↓
Google Apps Script（批量同步 + 備份）
    ↓
Google Sheets（備份 + 老師查看）
```

## 17.3 性能優化策略（關鍵！）

### GAS 性能瓶頸問題
> **警告**：GAS 有 6 秒執行timeout、30 req/min並發限制。600學生同時使用會崩！

**解決方案：批量同步 + 前端緩存**

```
前端策略：
1. 題目本地緩存（題目JSON預先加載）
2. 答案本地驗證（正確答案hash預先下發）
3. 操作隊列（排隊批量上傳）
4. 斷網自動切換離線模式

同步策略：
- 每 30 秒批量同步一次（唔好實時請求）
- 緊急操作（如登入）即時同步
- 離線操作隊列在連線後批量上傳

Firebase 即時層：
- 排行榜、在線狀態用 Firebase（唔經 GAS）
- 題目下發用 Firebase（唔經 GAS）
- 只有寫入操作走 GAS batch
```

### 答題流程優化
```
1. 前端：題目 + 答案hash 預先下發
2. 前端：用戶答題 → 即時反饋（唔等伺服器）
3. 前端：答案入隊列（localStorage）
4. 後台：每 30 秒批量上報答案到 GAS
5. GAS：驗證答案 → 更新 Sheets（備份）
6. Firebase：更新排行榜（即時）
```

## 17.4 Firebase vs GAS 比較

| 功能 | Firebase | GAS |
|------|----------|-----|
| 即時數據 | ✅ 原生支援 | ❌ 要輪詢 |
| 並發能力 | ✅ 1000+ 同時 | ❌ 30 req/min |
| 費用 | ✅ 免費 tier够用 | ✅ 免費 |
| Sheets 整合 | ⚠️ 要額外導出 | ✅ 原生 |
| 設置複雜度 | ⚠️ 要新學 | ✅ 已熟悉 |

## 17.5 安全性設計

> **重要**：前端 JavaScript 答案可被 inspect 作弊！答案驗證必須放伺服器！

```
安全原則：
1. 答案永遠在 GAS/Firebase 驗證，前端只顯示對/錯
2. 題目 + 干擾答案可以預先下發（可見題目）
3. 正確答案 hash 在後端儲存，唔喺前端代碼明文
4. 每個請求帶 timestamp + token 防重放攻擊
5. 同一用戶每秒最多 1 個請求（防爆破）

前端只做：
- 顯示題目
- 收集答案
- 發送答案到伺服器
- 顯示伺服器回覆結果
```

## 17.6 用戶認證流程（Firebase Auth）
```javascript
// Firebase Auth with Google
firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  .then(result => {
    const user = result.user;
    // uid 就是用戶ID
    // 儲存到 Firebase Realtime DB
  });
```

## 17.7 GAS端點設計（批量寫入）
```javascript
// GAS 只做批量寫入，不做即時驗證
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const operations = data.operations; // 批量操作陣列
  
  const results = [];
  for (const op of operations) {
    // 驗證 + 寫入 Sheets
    results.push(processOperation(op));
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true, results}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 17.8 請求格式
```javascript
// 批量同步請求
{
  "operations": [
    {
      "type": "answer",
      "user_id": "student@school.edu.hk",
      "question_id": "Q001",
      "answer": "B",
      "timestamp": 1699999999999
    },
    {
      "type": "progress",
      "user_id": "student@school.edu.hk",
      "level": 12,
      "exp": 1500,
      "timestamp": 1699999999999
    }
  ]
}

// 即時回應（Firebase）
{
  "success": true,
  "result": "correct",
  "exp_gained": 25,
  "new_level": 12,
  "card_dropped": null
}
```

---

# 18. 美術資源方案

> **重要更新**：MiniMax Image-01 做像素畫效果一般（佢強項係寫實/卡通）。推薦用 CSS/Canvas 繪製佔位符，或者搵免費素材。

## 18.1 方案A：CSS/Canvas 佔位符（Phase 1 首選）

好處：唔需要任何外部素材，直接用代碼繪製！

### 角色（CSS + Canvas）
```javascript
// 用 Canvas 繪製簡單像素角色
function drawCharacter(ctx, x, y, frame) {
  ctx.fillStyle = '#4A90D9'; // 藍色身體
  ctx.fillRect(x, y, 32, 32); // 正方形身體
  
  ctx.fillStyle = '#FFD700'; // 金色頭髮
  ctx.fillRect(x+8, y, 16, 8); // 頭髮
  
  ctx.fillStyle = '#000000'; // 黑色眼睛
  ctx.fillRect(x+10, y+12, 4, 4);
  ctx.fillRect(x+18, y+12, 4, 4);
}
```

### 地圖（CSS Grid + div）
```css
/* 用 CSS Grid 繪製地圖瓷磚 */
.map-tile {
  width: 32px;
  height: 32px;
  background: #1A1A2E;
  border: 1px solid #333;
}
.map-tile.classroom {
  background: linear-gradient(135deg, #4A90D9, #357ABD);
}
.map-tile.hallway {
  background: #2D2D44;
}
.map-tile.npc {
  background: radial-gradient(circle, #FFD700 30%, transparent 30%);
}
```

### UI 元素（純 CSS）
```css
/* HP 條 */
.hp-bar {
  width: 100px;
  height: 16px;
  background: #333;
  border: 2px solid #fff;
  border-radius: 8px;
  overflow: hidden;
}
.hp-fill {
  height: 100%;
  background: linear-gradient(to right, #F5222D, #FF7875);
  transition: width 0.3s;
}

/* 按鈕 */
.game-btn {
  padding: 12px 24px;
  background: linear-gradient(180deg, #4A90D9, #357ABD);
  border: 3px solid #fff;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 4px 0 #2D5A8A;
}
.game-btn:active {
  transform: translateY(4px);
  box-shadow: none;
}
```

## 18.2 方案B：免費像素素材（Phase 1c 以後）

如果想用靚啲嘅素材，可以用以下免費資源：

### 免費像素素材網站
| 網站 | 素材類型 | 授權 |
|------|----------|------|
| https://itch.io/game-assets/free | 像素角色、地圖、UI | 各異，多數CC0 |
| https://opengameart.org | 2D精靈圖 | CC0/CC-BY |
| https://kenney.nl/assets | 遊戲素材合集 | CC0（最推薦） |
| https://sanderbauman.itch.io/ | 像素素材 | 各異 |

### Kenney.nl 免費素材包
- **Tiny Dungeon**：地圖瓷磚
- **Tiny Town**：建築物
- **Toon Characters**：卡通角色
- **UI Pack**：遊戲UI元素

下載後放入 `assets/` 資料夾，直接用！

## 18.3 方案C：MiniMax Image-01（用喺宣傳素材）

MiniMax Image-01 唔適合遊戲內像素角色，但適合：
- 宣傳圖片
- 成就徽章設計
- 遊戲內海報/Banner

### 推薦 Prompt
```
/* 宣傳圖 */
A promotional poster for a math learning RPG game,
pixel art style, colorful, Hong Kong school setting,
students playing math games, energetic atmosphere,
16:9 aspect ratio, high quality

/* 成就徽章 */
Achievement badge, pixel art, golden trophy icon,
clean design, 64x64, game asset, transparent background

/* 遊戲內海報 */
Pixel art poster in classroom, math symbols floating,
glowing effect, 320x180, game decoration
```

## 18.4 解析度標準
| 類型 | 尺寸 | 用途 |
|------|------|------|
| 角色 | 32x32 或 64x64 | 玩家角色 |
| NPC | 32x32 或 64x64 | 遊戲內NPC |
| 地圖瓷磚 | 32x32 | 地圖背景 |
| 物品/道具 | 16x16 或 32x32 | 卡牌、道具 |
| UI元素 | 16x16 | 按鈕、圖標 |

## 18.2 顏色限制
- 每個精靈圖不超過16色
- 使用調色板（Palette）統一風格
- 避免過於細節，確保小尺寸可識別

## 18.3 動畫幀數
| 動畫類型 | 幀數 |
|----------|------|
| 待機 | 2-4幀 |
| 移動 | 4-8幀 |
| 攻擊 | 3-6幀 |
| 受傷 | 2-4幀 |
| 死亡 | 4-6幀 |
| 勝利 | 4-8幀 |

## 18.4 MiniMax image01 Prompt範例

### 角色Prompt
```
Pixel art, 32x32 sprite, RPG character, student with backpack,
4-frame walk cycle animation, facing 4 directions,
bright colors, NES color palette, clean pixel art,
transparent background, game asset
```

### 地圖Prompt
```
Pixel art, top-down view, school classroom interior,
32x32 tiles, isometric grid, clean pixel art,
bright lighting, NES style, game background tile,
16 colors, seamless tiling
```

### 卡牌Prompt
```
Trading card, pixel art, fantasy style card design,
gold border for legendary, blue border for rare,
character portrait in center, name at top,
stats at bottom, glowing effect for rare,
collectible card game style, 64x64
```

---

# 19. 數據結構

## 19.0 Firebase Realtime DB 結構（推薦）

如果用 Firebase，即時數據用呢個結構：

```
/
├── users/
│   └── [uid]/
│       ├── profile/
│       │   ├── name: "學生名"
│       │   ├── class: "1A"
│       │   ├── level: 12
│       │   ├── exp: 1500
│       │   ├── hp: 100
│       │   ├── coins: 500
│       │   ├── cards: ["C001", "C002"]
│       │   └── lastLogin: timestamp
│       ├── progress/
│       │   ├── achievements: ["A001", "A002"]
│       │   ├── dailyTasks: {...}
│       │   └── unlockedAreas: ["A-wing", "B-wing"]
│       └── answers/
│           └── [question_id]: {result: "correct", time: timestamp}
├── leaderboard/
│   ├── level: {[uid]: score}
│   ├── exp: {[uid]: score}
│   └── coins: {[uid]: score}
├── questions/
│   └── [question_id]: {content: "...", answer: "hash", difficulty: "basic"}
└── online/
    └── [uid]: true
```

## 19.1 Google Sheets結構（備份用）

> **重要**：答題記錄按月分 sheet，避免單 sheet 行數過多

### Sheet 1：玩家資料（Players）
| 欄位 | 類型 | 說明 |
|------|------|------|
| A：用戶ID | String | Google帳户email |
| B：角色名 | String | 玩家自定義名稱 |
| C：等級 | Number | 1-99 |
| D：經驗值 | Number | 0-9999 |
| E：HP | Number | 0-100 |
| F：MP | Number | 0-100 |
| G：學分 | Number | 貨幣 |
| H：榮譽 | Number | 成就貨幣 |
| I：卡牌清單 | JSON String | 持有的卡牌 |
| J：技能清單 | JSON String | 已解鎖技能 |
| K：好友清單 | JSON String | 好友ID列表 |
| L：當前位置 | String | 班房ID |
| M：最後登入 | Timestamp | 時間戳 |
| N：創建時間 | Timestamp | 帳户創建時間 |

### Sheet 2：答題記錄（Answers_YYYY_MM）
> **按月分表**：每個月的答題記錄分開儲存
> 例如：Answers_2025_09、Answers_2025_10
> 避免單 sheet 行數過多（Google Sheets 限制 1000萬格）

| 欄位 | 類型 | 說明 |
|------|------|------|
| A：用戶ID | String | Firebase UID 或 Google帳户email |
| B：班房ID | String | 所在班房 |
| C：題目ID | String | 題目標識 |
| D：答案 | String | 玩家答案（加密或hash） |
| E：結果 | String | correct/wrong/timeout |
| F：耗時 | Number | 秒 |
| G：時間 | Timestamp | 答題時間 |

### Sheet 3：題庫（Questions）
| 欄位 | 類型 | 說明 |
|------|------|------|
| A：題目ID | String | 唯一標識 |
| B：班房ID | String | 對應位置 |
| C：難度 | String | 基礎/進階/挑戰 |
| D：類型 | String | 計算/選擇/填空/應用 |
| E：題目內容 | String | LaTeX數學 |
| F：選項 | JSON String | 4選1時的選項 |
| G：答案 | String | 正確答案 |
| H：提示 | JSON String | 1-3個提示 |
| I：經驗值 | Number | 答對獎勵 |
| J：使用次數 | Number | 統計 |
| K：正确次数 | Number | 統計 |

### Sheet 4：卡牌掉落表（Drops）
| 欄位 | 類型 | 說明 |
|------|------|------|
| A：卡牌ID | String | 唯一標識 |
| B：名稱 | String | 卡牌名稱 |
| C：稀有度 | String | 普通/稀有/傳說 |
| D：類型 | String | 學科/工具/被動/技能/皮膚/寵物 |
| E：效果 | String | 效果描述 |
| F：數值 | Number | 效果數值 |
| G：掉落率 | Number | 百分比 |
| H：來源 | String | 來源描述 |

### Sheet 5：成就（Achievements）
| 欄位 | 類型 | 說明 |
|------|------|------|
| A：成就ID | String | 唯一標識 |
| B：名稱 | String | 成就名稱 |
| C：描述 | String | 詳細描述 |
| D：類別 | String | 故事/戰鬥/收集/社交/特殊 |
| E：條件 | JSON String | 完成條件 |
| F：獎勵 | JSON String | 獎勵內容 |
| G：完成用戶 | JSON String | 已完成用戶列表 |

### Sheet 6：每日任務（DailyTasks）
| 欄位 | 類型 | 說明 |
|------|------|------|
| A：任務ID | String | 唯一標識 |
| B：名稱 | String | 任務名稱 |
| C：描述 | String | 任務描述 |
| D：條件 | JSON String | 完成條件 |
| E：獎勵 | JSON String | 獎勵 |
| F：用戶進度 | JSON String | 各用戶進度 |

### Sheet 7：班級資料（Classes）
| 欄位 | 類型 | 說明 |
|------|------|------|
| A：班級ID | String | 如 "1A" |
| B：班級名 | String | 如 "中一A班" |
| C：老師ID | String | 班主任Google帳户 |
| D：學生數 | Number | 學生人數 |
| E：班級積分 | Number | 班級總分 |

---

# 20. 優先順序與階段交付

## 20.1 Phase 1 拆分（推薦！）

> **重要**：原本 Phase 1 scope太大。拆成3個 sub-phase，每個可獨立交付！

### Phase 1a：純前端 Demo（1-2週）
> **目標**：最快速度有可玩的東西

交付內容：
- ✅ 純前端 HTML + Phaser.js（唔需要後端）
- ✅ 離線模式（localStorage 存進度）
- ✅ 學校地圖（CSS/Canvas 繪製，唔需要像素素材）
- ✅ 基礎答題（選擇題）
- ✅ 等級 + 經驗系統
- ✅ **使用現有 ai-learning 題庫**（715題 HKDSE P1+P2）

**唔需要：**
- ❌ 登入系統
- ❌ Firebase/GAS
- ❌ 排行榜
- ❌ 卡牌系統

**驗收標準：**
- 學生可以直接打開 HTML 文件玩
- 答題有即時反饋
- 等級會上升

### Phase 1b：加後端 + 登入（2-3週）
> **目標**：有數據持久化的完整 RPG

交付內容：
- ✅ Google OAuth 登入（Firebase Auth）
- ✅ Firebase Realtime DB（即時數據）
- ✅ GAS 批量同步（每30秒）
- ✅ Google Sheets 備份
- ✅ 排行榜
- ✅ 每日任務

**唔需要：**
- ❌ 組隊功能
- ❌ PVP

**驗收標準：**
- 600 學生可同時在線
- 數據唔會丢
- 老師可看學生進度

### Phase 1c：加移動 + 動畫 + 卡牌（2-3週）
> **目標**：完整的 RPG 體驗

交付內容：
- ✅ 虛擬搖桿移動
- ✅ 像素角色動畫
- ✅ 卡牌收集系統（50張）
- ✅ 寶箱開啟動畫
- ✅ 升級煙火特效

**驗收標準：**
- 地圖可自由探索
- 卡牌有3個稀有度
- 開卡包有揭曉動畫

---

## 20.2 Phase 2（完整功能）- 2-3月
### 目標：完整的遊戲循環

交付內容：
1. ✅ 完整24班班房地圖
2. ✅ 題庫系統（100+題目）
3. ✅ 卡牌系統（50張卡牌，3個稀有度）
4. ✅ 每日任務系統
5. ✅ 成就系統（20個成就）
6. ✅ 簡單排行榜

## 20.3 Phase 3（完善）- 3-4月
### 目標：社交 + 老師功能

交付內容：
1. ✅ 好友系統
2. ✅ 組隊功能
3. ✅ 老師Dashboard
4. ✅ 老師派發任務功能
5. ✅ 競技場（PVP）
6. ✅ 全部50個成就

## 20.4 Phase 4（豐富內容）- 4-6月
### 目標：大量內容 + 長期留存

交付內容：
1. ✅ 數學王國概念區域
2. ✅ 主線劇情
3. ✅ 技能樹
4. ✅ 寵物系統
5. ✅ 節日活動
6. ✅ 300+題目庫
7. ✅ 全部卡牌收集

---

## 20.5 現有題庫整合（重要！）

> **可以直接用**：ai-learning 項目已有完整 HKDSE 題庫！

**現有資源：**
- 📁 `/Users/zachli/ai-learning/exam/` — HKDSE P1+P2 OCR 試卷
- 📁 `/Users/zachli/ai-learning/hkdse/` — 題目 JSON
- 🔢 **715 題** HKDSE P1+P2 試題（已 OCR + 整理）
- 📊 **Google Sheet**：`1Qk84gFeBEG2gTEmmM6wOz8PgI226hKL7jtFkpoTOhw0`

**整合方式：**
```javascript
// Phase 1a 直接 import 現有題庫
const questions = [
  // 從 ai-learning/hkdse/ 資料夾讀取
  // 格式轉換為遊戲所需格式
  {
    id: "HKDSE_2012_P1_Q01",
    type: "choice", // 選擇題
    difficulty: "basic",
    content: "化簡 $3x + 2y - x + 5y$",
    options: ["2x + 7y", "4x + 7y", "2x - 3y", "4x - 3y"],
    answer: "A", // 正確答案喺後端驗證
    topic: "代數"
  }
];
```

**好處：**
- ✅ 唔使從零整題目
- ✅ 題目已經過 OCR 整理
- ✅ HKDSE 對齊，適用於香港中學
- ✅ 可以按課題分類（代數/幾何/統計/概率）

---

# 21. 參考資源（195個搜尋結果）

## 21.1 核心循環 & 成長系統（20個來源）
- Core gameplay loops in an RPG? - RPG Maker Forums
- RPG Game Design (Fundamentals, Patterns, Mechanics) - gamedesignskills.com
- The Basics of Progression Models in Game Design - YouTube/GDC
- Types of gameplay loops you should know - Medium/Joss Querné
- Designing around a core mechanic - Game Developer
- RPG Progression Systems - adrianfr99.github.io
- How to Design an RPG Progression System that Keeps Players Engaged - IndieGameAcademy
- Game Progression and Progression Systems - gamedesignskills.com
- Three Models of Character Advancement - grognardia.blogspot.com
- Character progression through leveling, skills or items? - gamedev.stackexchange
- Advancement Systems In RPG Design - Douglas Underhill

## 21.2 心理學 & 用戶參與（19個來源）
- The Psychology of Game Design (Everything You Know Is Wrong) - GDC Vault
- Sid Meier's Psychology of Game Design - YouTube
- The Design of Time: Understanding Human Attention - YouTube/GDC 2017
- Cognitive Flow: The Psychology of Great Game Design - Game Developer
- The Psychology of Game Design: Crafting Immersive Player Experiences - greatermanchester.ac.uk
- Game Design Psychology: Unlock Player Motivation - lindenwood.edu
- The Psychology of Video Game Design - Lennart Nacke/Medium
- Applying the 5 Domains of Play - YouTube/GDC 2013

## 21.3 戰鬥 & 挑戰系統（10個來源）
- 12 ways to improve turn-based RPG combat systems - Sinister Design
- Building the Perfect Turn-Based Battle System - nostalgia trigger
- How to design turn-based combat system - GameWorldObserver
- Real-Time Vs Turn-Based RPG Battle Systems - gamedev.net
- Building an RPG Battle System - Part 1 - Game Developer
- Real Time vs Turn Based Combat in RPGs - YouTube

## 21.4 任務 & 叙事系統（10個來源）
- Branching Conversation Systems and the Working Writer - Game Developer
- Branching Conversation Systems Part 4 - AlexanderFreed.com
- A Step-by-Step Guide to Creating Branching Dialogue in Unity - gamedevnewb.com
- RPGs and their Dialogue Systems - konradhughes.com
- Implementing Story and Quests in RPG - gamedev.stackexchange

## 21.5 庫存 & 經濟系統（10個來源）
- The Modern RPG and Inventory Systems - JVM Gaming
- Designing the perfect crafting system for MMORPGs - YouTube
- How do I create the economy behind a simple crafting system? - rpg.stackexchange

## 21.6 多人 & 社交系統（20個來源）
- Designing Cooperative Gameplay Experiences - Game Developer
- Game design patterns for building friendships - Game Developer
- The Multiplayer RPG Experience - MMORPG.com
- Creating Compelling Coop Game Design - Josh Bycer/Medium
- Encouraging Cooperative Behavior During Co-op Play - YouTube/GDC 2011
- Designing a Party for RPGs - YouTube
- Social gaming: A systematic review - ScienceDirect

## 21.7 留存 & 獎勵系統（18個來源）
- What is the difference between implementing a 7-day daily login reward? - Reddit
- Common Strategies for Daily Login Rewards in Mobile Games - LinkedIn
- Inspiring Examples of Daily Login Rewards for your Mobile Game - beamable.com

## 21.8 技能樹系統（20個來源）
- Keys to Meaningful Skill Trees - gdkeys.com
- Skill Tree Theory and Design - RPG Maker Forums
- Game Design Tutor RPG Characters 05: Skills-Perks-Traits - YouTube
- Role-Playing Game Ability Tree Overview - courtney-potter.com
- Game Design is easy. A guide to crafting skill trees - Medium/thomas_1379

## 21.9 隨機掉落 & RNG（10個來源）
- Random loot generation probability formula in an RPG game - Reddit
- How does RNG work? Can you "rig" drops? RS3 + Other RPG's - YouTube
- How do drop rates work in games? - Facebook/OSRS Community
- Loot Drop | Test RNG Probability & Game Economy Balance - tavraxtools.com
- Guide :: Creating a Random Loot Drop System - Steam Community

## 21.10 新手引導 & 教程（10個來源）
- The Importance of the New Player's Experience - Game Developer
- game design: Onboarding Methods - nerdyteachers.com
- The New Player Experience - Hooks, Tutorials, Rewards - YouTube
- First Impression Seals the Deal - gamerefinery.com
- Don't Spook the Newbies: Unveiling 5 Proven Game Onboarding - Medium/The Acagamic
- Games UX: Building the right onboarding experience - uxdesign.cc
- Video Game Onboarding - Medium/Super Jump

## 21.11 角色職業 & 原型（10個來源）
- Design fantasy RPG classes as if you had invented roleplaying - rpg.net
- A Guide to RPG Character Classes - TerraClash™
- The 12 Jungian Archetypes - fictionphile.com
- Classes: Professions vs. Archetypes - enworld.org
- Every Game Developer Archetype Explained In 8 Minutes - YouTube
- The Standard List of RPG Archetypes - MMO-Champion
- RPG Class Archetypes (Beginners Guide) - gamedesigning.org

## 21.12 UI & 用戶反饋（9個來源）
- Video Game HUD & UI Design Guide - SunStrike Studios
- Mastering Game UI/UX: Best Practices You Should Know - LinkedIn
- 5 ways to quickly improve your video game's UI - GDevelop
- Visual Feedback in Game Design - bravezebra.com
- Mastering Intuitive Game UI Design - zigpoll.com
- Using Feedback as a Teacher in Videogames - game-wisdom.com
- 7 Obvious Beginner Mistakes with your game's HUD - Reddit

## 21.13 難度 & 平衡（10個來源）
- Difficulty Curves - YouTube
- Difficulty curves: how to get the right balance - Game Developer
- Difficulty in Game Design, flow, motivations and learning curves - Medium
- The relationship between the skill-challenge balance - PMC/NIH
- Balancing Inverse Difficulty Curves in Game Design - game-wisdom.com

## 21.14 成就系統（10個來源）
- Best Achievement System? - gamedev.net
- What are Progression Systems in Games? - universityxp.com
- Designing Achievements for Optimal User Engagement - trophy.so

---

# 大佬執行指引

如果你係大佬（Claude Opus 4.6），請根據呢份詳細提示語，製作一個完整嘅HTML5數學探索RPG遊戲，包含：

1. 完整的前端代碼（HTML + CSS + JavaScript）
2. 使用Phaser.js作為遊戲引擎
3. 可離線玩的單HTML文件
4. 包含新手教程
5. 包含地圖系統和答題系統
6. 包含卡牌收集系統
7. 包含每日任務系統
8. 包含等級和經驗系統
9. 所有資源使用佔位符或CSS繪製（無需實際圖片）
10. Google Apps Script後端代碼框架
11. Google Sheets數據結構說明
12. MiniMax image01 Prompt範例（像素人物、地圖、卡牌）

優先順序：
- Phase 1 必須完整實現
- Phase 2-4 作為擴展功能
- 所有代碼需要可運行，唔好留TODO

---

**提示語結束**
