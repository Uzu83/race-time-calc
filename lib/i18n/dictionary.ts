import type { Locale } from "./locales";

interface Dict {
  meta: {
    siteName: string;
    siteTagline: string;
    siteDescription: string;
  };
  nav: {
    home: string;
    pace: string;
    about: string;
  };
  home: {
    titleA: string;
    titleHighlight: string;
    titleB: string;
    tagline: string;
    featuresHeading: string;
    feat1: string;
    feat2: string;
    feat3: string;
    feat4: string;
    quickHeading: string;
    quickSub: string;
    popularHeading: string;
    relatedHeading: string;
  };
  form: {
    currentDistance: string;
    currentTime: string;
    targetDistance: string;
    timePlaceholder: string;
    pace: string;
    submit: string;
    invalidTime: string;
    unrealistic: string;
    sameDistance: string;
    inputPaceHint: string;
  };
  result: {
    threeModelAvg: string;
    pacePerKm: string;
    threeModelTitle: string;
    rangeLabel: string;
    paceLapTitle: string;
    paceLapNote: string;
    trainingTitle: string;
    trainingNote: string;
    monthly: string;
    weekly: string;
    longRun: string;
    shareTitle: string;
    backCta: string;
    equivalentTitle: string;
    equivalentSub: string;
    trainingPacesTitle: string;
    trainingPacesSub: string;
    racePlanTitle: string;
    racePlanSub: string;
    racePlanEven: string;
    racePlanNegative: string;
    splitKm: string;
    splitTime: string;
    splitCum: string;
    heatTitle: string;
    heatSub: string;
    heatTemp: string;
    heatAdjusted: string;
    heatNote: string;
  };
  share: {
    x: string;
    line: string;
    copy: string;
    copied: string;
  };
  models: {
    riegel: string;
    riegelDesc: string;
    vdot: string;
    vdotDesc: string;
    riegelElite: string;
    riegelEliteDesc: string;
  };
  zones: {
    easy: string;
    easyDesc: string;
    marathon: string;
    marathonDesc: string;
    threshold: string;
    thresholdDesc: string;
    interval: string;
    intervalDesc: string;
    repetition: string;
    repetitionDesc: string;
  };
  subTargets: {
    sub5: string;
    sub4: string;
    "sub3.5": string;
    sub3: string;
    "sub2.5": string;
    halfSub2: string;
    "halfSub1.75": string;
    "halfSub1.5": string;
    inReach: string;
    awayBy: string;
  };
  pace: {
    title: string;
    tagline: string;
    modeDistTime: string;
    modeTimeDistPace: string;
    modePaceDist: string;
    distance: string;
    time: string;
    paceLabel: string;
    perKm: string;
    perMi: string;
    kmh: string;
    mph: string;
    presets: string;
    custom: string;
    customMeters: string;
    showAllUnits: string;
  };
  about: {
    title: string;
    whatHeading: string;
    whatBody: string;
    modelsHeading: string;
    modelsFooter: string;
    cautionHeading: string;
    caution1: string;
    caution2: string;
    caution3: string;
    faqHeading: string;
    faq: { q: string; a: string }[];
  };
  predict: {
    h1: string;
    description: string;
    indexTitle: string;
    indexTagline: string;
    seeFullResult: string;
  };
  footer: {
    disclaimer: string;
    citation: string;
    supportCta: string;
    /** Shown under affiliate CTA when Amazon tag is live (景表法). */
    affiliateDisclosure: string;
  };
  gear: {
    title: string;
    body: string;
    bodyTier: string;
    cta: string;
    ctaTier: string;
    disclosure: string;
  };
  support: {
    title: string;
    body: string;
    cta: string;
  };
  distances: {
    "3k": string;
    "5k": string;
    "10k": string;
    "15k": string;
    half: string;
    "30k": string;
    full: string;
    halfShort: string;
    fullShort: string;
  };
  trainingTier: {
    sub3: { tier: string; comment: string; w1: string; w2: string; w3: string };
    sub35: { tier: string; comment: string; w1: string; w2: string; w3: string };
    sub4: { tier: string; comment: string; w1: string; w2: string; w3: string };
    sub45: { tier: string; comment: string; w1: string; w2: string; w3: string };
    sub5: { tier: string; comment: string; w1: string; w2: string; w3: string };
    finish: { tier: string; comment: string; w1: string; w2: string; w3: string };
  };
}

export const DICT: Record<Locale, Dict> = {
  ja: {
    meta: {
      siteName: "マラソンタイム予測",
      siteTagline: "5K・10K・ハーフからフルマラソンタイムを予測",
      siteDescription:
        "5K・10K・ハーフの記録から、3つの予測モデル (Riegel・VDOT・Riegel-Elite) でフルマラソンタイムを予測。サブ4・サブ3.5・サブ3 達成までの差を可視化。SNSシェア用の結果カードも生成できます。",
    },
    nav: { home: "予測", pace: "ペース計算", about: "ツールについて" },
    home: {
      titleA: "5K・10K・ハーフから",
      titleHighlight: "フルマラソンタイム",
      titleB: "を予測",
      tagline:
        "Riegel・VDOT・Riegel-Elite の3モデル並列予測。サブ4・サブ3.5・サブ3 達成までの差を可視化し、推奨ペース・トレーニングペース (E/M/T/I/R)・月間走行距離も提示します。",
      featuresHeading: "このツールの特徴",
      feat1: "一般ランナー向け補正係数 k=1.14 を Riegel に採用",
      feat2: "3モデル比較で過大／過小予測の偏りを相殺",
      feat3: "結果は URL に埋め込み — シェアしても同じ予測が再現",
      feat4: "VDOT トレーニングペース・5kmスプリット・気温補正に対応",
      quickHeading: "よくある条件で見る",
      quickSub: "タップで結果ページに直行 — 自分の目安と比較してみて。",
      popularHeading: "人気の予測ページ",
      relatedHeading: "関連する予測",
    },
    form: {
      currentDistance: "現在の自己ベスト距離",
      currentTime: "そのタイム (時:分:秒)",
      targetDistance: "予測したい距離",
      timePlaceholder: "0:45:30",
      pace: "推定ペース",
      submit: "予測する",
      invalidTime: "時間の形式が正しくありません (例: 0:45:30 や 45:30)",
      unrealistic: "現実的な範囲のタイムを入力してください",
      sameDistance: "現在の距離と予測したい距離が同じです",
      inputPaceHint: "例: 0:45:30 / 45:30 / 1:30:45",
    },
    result: {
      threeModelAvg: "3モデル平均",
      pacePerKm: "推奨1kmペース",
      threeModelTitle: "3モデル並列表示",
      rangeLabel: "幅",
      paceLapTitle: "推奨1kmラップ",
      paceLapNote:
        "30km 以降は +0.5秒/km/km の自然な減速を含む推奨ラップ。前半を抑えて後半をこの形に近づけると失速しにくい。",
      trainingTitle: "想定トレーニング",
      trainingNote: "相当の脚を作るための目安。",
      monthly: "月間",
      weekly: "週間",
      longRun: "ロング",
      shareTitle: "この予測をシェア",
      backCta: "← 別の条件で予測する",
      equivalentTitle: "全距離での等価予測",
      equivalentSub: "今のあなたの走力で、各距離をどれくらいで走れるかの目安。",
      trainingPacesTitle: "VDOT トレーニングペース",
      trainingPacesSub:
        "Daniels の VDOT 理論から導出した5つのトレーニングゾーン。日々の練習の物差しに。",
      racePlanTitle: "5kmスプリット プラン",
      racePlanSub: "5km ごとのラップ目安。当日のラップタイム計画に。",
      racePlanEven: "イーブン",
      racePlanNegative: "ネガティブスプリット (後半 -1%)",
      splitKm: "区間",
      splitTime: "区間タイム",
      splitCum: "通過",
      heatTitle: "気温補正",
      heatSub:
        "気温が +5°C 上がるとマラソンペースは約 1.6% 落ちる (Daniels 経験則)。当日の予報を入れて目安タイムを再計算。",
      heatTemp: "予想気温",
      heatAdjusted: "補正後 予測タイム",
      heatNote:
        "暑熱順化の度合い・湿度・直射日光で実際の影響は変わります。15°C 超で対策必須、25°C 超でサブ目標は再考推奨。",
    },
    share: {
      x: "𝕏 でシェア",
      line: "LINE でシェア",
      copy: "🔗 リンクをコピー",
      copied: "✓ コピーしました",
    },
    models: {
      riegel: "Riegel (k=1.14)",
      riegelDesc:
        "Peter Riegel (1981) の経験式。一般ランナー向け補正係数 k=1.14 を採用。距離が伸びるほどペース低下を強めに見積もる、保守的な予測。",
      vdot: "VDOT (Daniels)",
      vdotDesc:
        "Jack Daniels の VDOT 理論。最大酸素摂取量と持続時間の関係から導出。トレーニング指標としても使われる定番。",
      riegelElite: "Riegel (k=1.06)",
      riegelEliteDesc:
        "Riegel オリジナルの k=1.06。鍛錬されたランナー (週60km 以上を継続) 向けの楽観値。一般ランナーには甘く出やすいが、目標設定の上限値として機能する。",
    },
    zones: {
      easy: "E (イージー)",
      easyDesc: "会話できるペース。基礎づくり・回復走に。週の大半をこのゾーンで。",
      marathon: "M (マラソン)",
      marathonDesc: "フルマラソン目標ペース。20〜30km 走で慣らす。",
      threshold: "T (閾値)",
      thresholdDesc: "乳酸閾値ペース。20〜60分継続できる強度。テンポ走の物差し。",
      interval: "I (インターバル)",
      intervalDesc: "VO₂max を刺激する強度。1km×5本 や 3〜5分走×複数本で。",
      repetition: "R (レペティション)",
      repetitionDesc: "スピード・ランエコノミー強化。200〜400m を完全休息で繰り返す。",
    },
    subTargets: {
      sub5: "サブ5",
      sub4: "サブ4",
      "sub3.5": "サブ3.5",
      sub3: "サブ3",
      "sub2.5": "サブ2.5",
      halfSub2: "ハーフ サブ2",
      "halfSub1.75": "ハーフ サブ1:45",
      "halfSub1.5": "ハーフ サブ1:30",
      inReach: "を {{delta}} で射程内",
      awayBy: "まであと {{delta}}",
    },
    pace: {
      title: "ペース計算",
      tagline:
        "距離・タイム・ペースのうち2つを入れると、残りを計算。min/km・min/mi・km/h・mph で並列表示。",
      modeDistTime: "距離+タイム → ペース",
      modeTimeDistPace: "ペース+距離 → タイム",
      modePaceDist: "ペース+タイム → 距離",
      distance: "距離",
      time: "タイム",
      paceLabel: "ペース",
      perKm: "/km",
      perMi: "/mi",
      kmh: "km/h",
      mph: "mph",
      presets: "距離プリセット",
      custom: "カスタム距離",
      customMeters: "メートル単位で入力",
      showAllUnits: "すべての単位で表示",
    },
    about: {
      title: "このツールについて",
      whatHeading: "何をするツールか",
      whatBody:
        "5K・10K・ハーフなど短い距離のレース記録を入力すると、フルマラソン (またはお好きな距離) のタイムを 3 つの予測モデルで並列に算出します。結果は URL に埋め込まれるので、シェアしても誰が開いても同じ予測が再現されます。",
      modelsHeading: "使っている予測モデル",
      modelsFooter:
        "3つの予測値を並列表示することで、過大／過小予測の偏りを相殺し、自分の現実値が「保守 ↔ 楽観」のどこにあるかを把握できます。",
      cautionHeading: "注意点",
      caution1: "予測値はあくまで「現在の走力から見た理論値」です。",
      caution2:
        "気象条件 (気温・湿度・風)、コース (高低差)、補給、当日のコンディション、そして本番までのトレーニング状態により実タイムは変動します。",
      caution3:
        "短い距離 (3km 等) からフルへの予測は誤差が大きくなりがち。ハーフの記録があれば最も信頼度が高くなります。",
      faqHeading: "よくある質問",
      faq: [
        {
          q: "Riegel・VDOT・Riegel-Elite の3モデルはどれを信じればいい?",
          a: "3つの平均値が中央値の目安。Riegel (k=1.14) は保守的、Riegel-Elite (k=1.06) は楽観的、VDOT はその中間に来やすい。週60km 以上を継続している鍛錬されたランナーなら Riegel-Elite に寄ります。",
        },
        {
          q: "サブ4・サブ3 を達成するには月何km走ればいい?",
          a: "経験則ですが、サブ4 は月150〜250km、サブ3.5 は月250〜350km、サブ3 は月350km 以上が目安。距離だけでなく、テンポ走と閾値ペースを月数回入れることが鍵。",
        },
        {
          q: "なぜ Cameron 公式ではなく Riegel-Elite を採用しているの?",
          a: "Cameron (1998) の textbook 公式は amateur ランナー (10K 45分相当) に対して非現実的に速い予測を返すため。透明で検証しやすい代替として Riegel オリジナル定数 (k=1.06) を「楽観的上限」として採用しています。",
        },
        {
          q: "気温が高い日の予測はどう見ればいい?",
          a: "Daniels の経験則で +5°C ごとにマラソンペースが約 1.6% 落ちます。結果ページの『気温補正』スライダーで当日予報を入力すれば調整後タイムが見られます。15°C 超で対策必須、25°C 超でサブ目標は再考。",
        },
        {
          q: "URL を共有するだけで同じ予測を再現できるのはなぜ?",
          a: "予測の入力 (距離・タイム・目標距離) を全て URL に埋め込んでいるため。バックエンド・DB なしの完全 stateless 設計なので、同じハッシュ・同じスラッグを開けば誰でも同じ結果が見られます。",
        },
      ],
    },
    predict: {
      h1: "{{from}} {{time}} → {{to}} の予測タイム",
      description:
        "{{from}} を {{time}} で走る人が、{{to}} を何分何秒で走れるか。3モデル平均と各モデル個別予測、推奨ペース・トレーニングメニューまで一括表示。",
      indexTitle: "予測ランディング 一覧",
      indexTagline: "よく検索される距離・タイムの組み合わせ。タップで予測結果ページへ。",
      seeFullResult: "→ 完全な結果ページを見る",
    },
    footer: {
      disclaimer:
        "予測値はあくまで目安です。気象・コース・体調・トレーニング状態により実際のタイムは変動します。",
      citation: "モデル: Peter Riegel (1981) / Jack Daniels VDOT",
      supportCta: "開発を支援する（Ko-fi）",
      // Amazon JP: サイト名入りの所定文言。曖昧な「当サイト」は避ける。
      affiliateDisclosure:
        "Amazonのアソシエイトとして、マラソンタイム予測は適格販売により収入を得ています。",
    },
    gear: {
      title: "予測タイム帯に合うシューズを探す",
      body: "目標タイム帯に合わせたランニングシューズを Amazon で検索します（外部サイト・PR）。",
      bodyTier:
        "{{tier}}の目標に合わせたランニングシューズを Amazon で検索します（外部サイト・PR）。",
      cta: "Amazon でシューズを見る",
      ctaTier: "{{tier}}向けシューズを Amazon で見る",
      disclosure:
        "【PR】Amazonのアソシエイトとして、マラソンタイム予測は適格販売により収入を得ています。リンク先の価格・在庫は Amazon 側の表示に従います。",
    },
    support: {
      title: "役に立ったら、開発を一杯ぶん支えてください",
      // WHY「広告なし」を書かないか: アフィ ON 時にスポンサーリンクと矛盾する（5.6監査 P1）。
      body: "投げ銭は予測ツールの改善費に充てます。",
      cta: "Ko-fi で支援する",
    },
    distances: {
      "3k": "3km",
      "5k": "5km",
      "10k": "10km",
      "15k": "15km",
      half: "ハーフ",
      "30k": "30km",
      full: "フル",
      halfShort: "ハーフ",
      fullShort: "フル",
    },
    trainingTier: {
      sub3: {
        tier: "サブ3 を狙う層",
        comment:
          "速筋＋遅筋のミックスを高水準で要求される領域。距離・強度どちらも妥協せず、回復日も同じ重要度で扱うこと。",
        w1: "週1: 1km×5本 インターバル (M ペース −20〜30秒/km)",
        w2: "週1: 16〜20km テンポ走 (M ペース)",
        w3: "週1: 30〜35km ロング走 (M ペース +20〜30秒/km)",
      },
      sub35: {
        tier: "サブ3.5 を狙う層",
        comment:
          "走力の伸びしろがまだ大きい層。月間距離を 300km 前後で安定させ、テンポ走で閾値を引き上げる時期。",
        w1: "週1: 1km×3〜5本 インターバル",
        w2: "週1: 12〜16km テンポ走",
        w3: "週1: 25〜30km ロング走 (後半 M ペース上げ)",
      },
      sub4: {
        tier: "サブ4 を狙う層",
        comment:
          "週3〜4回の練習で十分到達可能。ロング走で脚を作り、テンポ走で閾値を意識する。怪我リスクが上がる距離帯なので段階的に増やす。",
        w1: "週1: 1km×3本 ペース走 (M ペース −10秒/km)",
        w2: "週1: 8〜12km テンポ走",
        w3: "週1: 22〜28km ロング走 (LSD)",
      },
      sub45: {
        tier: "サブ4.5 を狙う層",
        comment:
          "「20km の壁」を越えられるかが勝負。ロング走で 30km 走を1〜2回経験しておくと当日の不安が大きく減る。",
        w1: "週1: 5km ビルドアップ走",
        w2: "週1: ジョグ 8〜10km (会話できるペース)",
        w3: "週1: 20〜25km ロング走",
      },
      sub5: {
        tier: "サブ5・完走を狙う層",
        comment:
          "ここはとにかく距離を踏むフェーズ。週3回の練習で月100km前後を目標にし、フォームと補給を体に覚え込ませる。",
        w1: "週1: ジョグ 5〜8km",
        w2: "週1: ビルドアップまたは坂道走",
        w3: "週1: 18〜22km ロング走 (歩きを混ぜてOK)",
      },
      finish: {
        tier: "完走を狙う層",
        comment:
          "完走が最大目標。距離に体を慣らすことが最優先で、ペースは「会話できる」を厳守。怪我ゼロで本番を迎える戦略。",
        w1: "週1: ウォーク&ラン 5km",
        w2: "週1: ゆっくりジョグ 6〜8km",
        w3: "週1: 15〜22km ロング走 (歩きOK・補給練習)",
      },
    },
  },
  en: {
    meta: {
      siteName: "Race Time Calculator",
      siteTagline: "Predict your marathon time from a 5K / 10K / Half",
      siteDescription:
        "Predict marathon time from a 5K, 10K or Half result using three parallel models (Riegel · VDOT · Riegel-Elite). See how close you are to Sub-4 / Sub-3:30 / Sub-3, plus VDOT training paces, splits and a sharable result card.",
    },
    nav: { home: "Predict", pace: "Pace Calculator", about: "About" },
    home: {
      titleA: "From a 5K, 10K or Half,",
      titleHighlight: "predict your marathon",
      titleB: "time",
      tagline:
        "Three models in parallel — Riegel, VDOT and Riegel-Elite. See your gap to Sub-4 / Sub-3:30 / Sub-3, recommended pace, VDOT training paces (E/M/T/I/R) and weekly mileage.",
      featuresHeading: "What this tool does",
      feat1: "Riegel uses k=1.14 (general-runner correction)",
      feat2: "Three-model comparison cancels over- and under-prediction bias",
      feat3: "Result is encoded in the URL — share it and the same prediction reappears",
      feat4: "VDOT training paces, 5K splits and heat adjustment included",
      quickHeading: "Common starting points",
      quickSub: "Tap to jump straight to the result and compare against your own.",
      popularHeading: "Popular prediction pages",
      relatedHeading: "Related predictions",
    },
    form: {
      currentDistance: "Current best distance",
      currentTime: "Time at that distance (h:mm:ss)",
      targetDistance: "Predict for",
      timePlaceholder: "0:45:30",
      pace: "Pace",
      submit: "Predict",
      invalidTime: "Time format is invalid (e.g. 0:45:30 or 45:30)",
      unrealistic: "Please enter a realistic time",
      sameDistance: "Current and target distances are the same",
      inputPaceHint: "e.g. 0:45:30 / 45:30 / 1:30:45",
    },
    result: {
      threeModelAvg: "3-model average",
      pacePerKm: "Recommended pace",
      threeModelTitle: "Three models in parallel",
      rangeLabel: "Range",
      paceLapTitle: "Recommended km splits",
      paceLapNote:
        "After 30 km the chart adds +0.5 s/km/km natural fade. Hold back early so the back-half follows this curve.",
      trainingTitle: "Suggested training",
      trainingNote: "Approximate weekly volume to build the legs needed for ",
      monthly: "Monthly",
      weekly: "Weekly",
      longRun: "Long run",
      shareTitle: "Share this prediction",
      backCta: "← Try another input",
      equivalentTitle: "Equivalent times across distances",
      equivalentSub: "What your current fitness is worth at every standard race distance.",
      trainingPacesTitle: "VDOT training paces",
      trainingPacesSub:
        "Five training zones derived from Daniels' VDOT theory. Use them as a yardstick for daily workouts.",
      racePlanTitle: "5K split plan",
      racePlanSub: "Per-5K splits to wear on race day.",
      racePlanEven: "Even",
      racePlanNegative: "Negative split (back half −1%)",
      splitKm: "Segment",
      splitTime: "Split",
      splitCum: "Elapsed",
      heatTitle: "Heat adjustment",
      heatSub:
        "Marathon pace falls roughly 1.6% per +5°C (Daniels). Plug in the forecast to see the realistic time on race day.",
      heatTemp: "Forecast temperature",
      heatAdjusted: "Adjusted prediction",
      heatNote:
        "Heat acclimatization, humidity and sun exposure all change the real impact. Above 15°C plan a coping strategy; above 25°C reconsider sub-goals.",
    },
    share: {
      x: "Share on 𝕏",
      line: "Share on LINE",
      copy: "🔗 Copy link",
      copied: "✓ Copied",
    },
    models: {
      riegel: "Riegel (k=1.14)",
      riegelDesc:
        "Peter Riegel (1981) empirical formula. Uses k=1.14, the general-runner correction — assumes more pace fade as distance grows. The conservative end of the spread.",
      vdot: "VDOT (Daniels)",
      vdotDesc:
        "Jack Daniels' VDOT theory. Derived from VO₂max and sustainable duration. Also the standard yardstick for training prescription.",
      riegelElite: "Riegel (k=1.06)",
      riegelEliteDesc:
        "Riegel's original k=1.06 for highly trained runners (60+ km/week consistently). Tends optimistic for amateurs — treat as the upper bound for goal setting.",
    },
    zones: {
      easy: "E (Easy)",
      easyDesc:
        "Conversational pace. Foundation building and recovery. Spend most of the week here.",
      marathon: "M (Marathon)",
      marathonDesc: "Goal marathon pace. Practice it on 20–30 km long runs.",
      threshold: "T (Threshold)",
      thresholdDesc:
        "Lactate-threshold pace. Sustainable for 20–60 min. The yardstick for tempo runs.",
      interval: "I (Interval)",
      intervalDesc: "VO₂max-stimulating effort. Hit it with 1 km × 5 reps or 3–5 min × multiple.",
      repetition: "R (Repetition)",
      repetitionDesc:
        "Speed and running-economy work. 200–400 m repeats with full recovery between.",
    },
    subTargets: {
      sub5: "Sub-5",
      sub4: "Sub-4",
      "sub3.5": "Sub-3:30",
      sub3: "Sub-3",
      "sub2.5": "Sub-2:30",
      halfSub2: "Half Sub-2",
      "halfSub1.75": "Half Sub-1:45",
      "halfSub1.5": "Half Sub-1:30",
      inReach: "in reach by {{delta}}",
      awayBy: "{{delta}} away from",
    },
    pace: {
      title: "Pace Calculator",
      tagline:
        "Plug in any two of distance, time and pace — the third is computed. min/km, min/mi, km/h and mph shown side-by-side.",
      modeDistTime: "Distance + Time → Pace",
      modeTimeDistPace: "Pace + Distance → Time",
      modePaceDist: "Pace + Time → Distance",
      distance: "Distance",
      time: "Time",
      paceLabel: "Pace",
      perKm: "/km",
      perMi: "/mi",
      kmh: "km/h",
      mph: "mph",
      presets: "Distance presets",
      custom: "Custom distance",
      customMeters: "Enter in meters",
      showAllUnits: "Show all units",
    },
    about: {
      title: "About this tool",
      whatHeading: "What it does",
      whatBody:
        "Plug in a recent race result (5K, 10K, half, etc.) and three parallel models predict your time at the marathon — or any other distance you pick. The result is encoded in the URL, so a shared link reproduces the same prediction for anyone who opens it.",
      modelsHeading: "Models in use",
      modelsFooter:
        "Showing all three side-by-side cancels over- and under-prediction bias and frames where you sit on the conservative ↔ optimistic axis.",
      cautionHeading: "Caveats",
      caution1: "Predictions reflect *current fitness only* — they're a theoretical ceiling.",
      caution2:
        "Weather (heat, humidity, wind), course (elevation), fueling, race-day condition and remaining training all move the actual time.",
      caution3:
        "Predictions from very short distances (e.g. 3 km) to the marathon have larger error. A half-marathon input is the highest-confidence anchor.",
      faqHeading: "Frequently asked",
      faq: [
        {
          q: "Riegel, VDOT, Riegel-Elite — which one should I trust?",
          a: "The 3-model average is the central tendency. Riegel (k=1.14) is conservative, Riegel-Elite (k=1.06) is optimistic, and VDOT usually sits between. Highly trained runners on 60+ km/week skew toward Riegel-Elite.",
        },
        {
          q: "How many km per month do I need for Sub-4 / Sub-3?",
          a: "Rough community benchmarks: Sub-4 ≈ 150–250 km/month, Sub-3:30 ≈ 250–350 km/month, Sub-3 ≈ 350+ km/month. Volume is necessary but not sufficient — tempo and threshold work matters too.",
        },
        {
          q: "Why use Riegel-Elite instead of the Cameron formula?",
          a: "Textbook Cameron (1998) returns unrealistically fast predictions for amateur runners (e.g. ~3:09 marathon from a 45:00 10K). Riegel-Elite (k=1.06) is a transparent, verifiable substitute that fills the same 'optimistic upper bound' role.",
        },
        {
          q: "How should I read the prediction on a hot day?",
          a: "Daniels' rule of thumb: marathon pace falls about 1.6% per +5°C above ~10°C. Use the 'Heat adjustment' slider on the result page with the day's forecast. Above 15°C plan a coping strategy; above 25°C reconsider sub-goals.",
        },
        {
          q: "Why does sharing a URL reproduce the exact same prediction?",
          a: "All inputs (from-distance, time, to-distance) are encoded in the URL itself. There's no backend or database — the URL is the data, so anyone opening the same hash or slug sees the same result.",
        },
      ],
    },
    predict: {
      h1: "Predicted {{to}} time from a {{from}} {{time}}",
      description:
        "If you ran {{from}} in {{time}}, how fast can you finish {{to}}? Sees the 3-model average, individual model predictions, recommended pace and a training plan in one place.",
      indexTitle: "Prediction landings",
      indexTagline: "Common race-distance / time combos. Tap to jump to the prediction.",
      seeFullResult: "→ See the full result page",
    },
    footer: {
      disclaimer:
        "Predictions are estimates only. Weather, course, condition and training will move the actual time.",
      citation: "Models: Peter Riegel (1981) / Jack Daniels VDOT",
      supportCta: "Support development (Ko-fi)",
      affiliateDisclosure:
        "As an Amazon Associate, Marathon Time Predictor earns from qualifying purchases.",
    },
    gear: {
      title: "Shoes for your predicted pace band",
      body: "Browse Amazon for running shoes matched to your predicted pace band (external site · sponsored).",
      bodyTier: "Browse running shoes matched to {{tier}} on Amazon (external site · sponsored).",
      cta: "Search shoes on Amazon",
      ctaTier: "Shop {{tier}} shoes on Amazon",
      disclosure:
        "Sponsored: As an Amazon Associate, Marathon Time Predictor earns from qualifying purchases. Price and stock are shown by Amazon.",
    },
    support: {
      title: "If this helped, fuel the next improvement",
      body: "Tips go to keeping the calculator accurate and fast.",
      cta: "Support on Ko-fi",
    },
    distances: {
      "3k": "3K",
      "5k": "5K",
      "10k": "10K",
      "15k": "15K",
      half: "Half",
      "30k": "30K",
      full: "Marathon",
      halfShort: "Half",
      fullShort: "Marathon",
    },
    trainingTier: {
      sub3: {
        tier: "Sub-3 contenders",
        comment:
          "High-volume, high-intensity territory. Don't compromise on either, and treat recovery days with equal priority.",
        w1: "Wk: 1 km × 5 intervals (M-pace −20–30 s/km)",
        w2: "Wk: 16–20 km tempo (M-pace)",
        w3: "Wk: 30–35 km long run (M-pace +20–30 s/km)",
      },
      sub35: {
        tier: "Sub-3:30 contenders",
        comment:
          "Lots of headroom still. Stabilize at ~300 km/month and lift threshold via tempo runs.",
        w1: "Wk: 1 km × 3–5 intervals",
        w2: "Wk: 12–16 km tempo",
        w3: "Wk: 25–30 km long run (back half at M-pace)",
      },
      sub4: {
        tier: "Sub-4 contenders",
        comment:
          "Reachable on 3–4 runs/week. Long runs build the legs, tempos lift threshold. Build distance gradually to avoid injury.",
        w1: "Wk: 1 km × 3 (M-pace −10 s/km)",
        w2: "Wk: 8–12 km tempo",
        w3: "Wk: 22–28 km long run (LSD)",
      },
      sub45: {
        tier: "Sub-4:30 contenders",
        comment:
          "The 'wall at 20 km' is the deciding factor. Bag one or two 30 km long runs before race day to settle the nerves.",
        w1: "Wk: 5 km build-up run",
        w2: "Wk: 8–10 km easy jog",
        w3: "Wk: 20–25 km long run",
      },
      sub5: {
        tier: "Sub-5 / Finishers",
        comment:
          "Volume phase. Aim for ~100 km/month on 3 runs/week and let your body learn fueling and form.",
        w1: "Wk: 5–8 km easy jog",
        w2: "Wk: build-up or hill workout",
        w3: "Wk: 18–22 km long run (walking breaks ok)",
      },
      finish: {
        tier: "Finisher goal",
        comment:
          "The whole goal is finishing. Adapt your body to distance first, hold pace conversational, arrive at race day uninjured.",
        w1: "Wk: 5 km walk-run",
        w2: "Wk: 6–8 km easy jog",
        w3: "Wk: 15–22 km long run (walking ok, fueling practice)",
      },
    },
  },
  ko: {
    meta: {
      siteName: "마라톤 기록 예측기",
      siteTagline: "5K · 10K · 하프 기록으로 마라톤 기록 예측",
      siteDescription:
        "5K, 10K, 하프 마라톤 기록을 입력하면 Riegel · VDOT · Riegel-Elite 3개 모델로 마라톤 기록을 병렬 예측합니다. 서브4 · 서브3:30 · 서브3 까지의 차이, 추천 페이스, VDOT 트레이닝 페이스를 함께 표시합니다.",
    },
    nav: { home: "예측", pace: "페이스 계산", about: "도구 안내" },
    home: {
      titleA: "5K · 10K · 하프 기록으로",
      titleHighlight: "마라톤 기록",
      titleB: "을 예측",
      tagline:
        "Riegel · VDOT · Riegel-Elite 세 모델 병렬 예측. 서브4 · 서브3:30 · 서브3 까지의 차이를 시각화하고 추천 페이스, VDOT 트레이닝 페이스 (E/M/T/I/R), 월간 주행거리도 함께 제시합니다.",
      featuresHeading: "이 도구의 특징",
      feat1: "일반 러너용 보정 계수 k=1.14 적용 (Riegel)",
      feat2: "3개 모델 비교로 과대·과소 예측의 편향 상쇄",
      feat3: "결과는 URL 에 인코딩 — 공유해도 동일한 예측이 재현",
      feat4: "VDOT 트레이닝 페이스, 5K 스플릿, 기온 보정 지원",
      quickHeading: "자주 쓰는 조건",
      quickSub: "탭하면 결과 페이지로 직행 — 자신의 기록과 비교해 보세요.",
      popularHeading: "인기 예측 페이지",
      relatedHeading: "관련 예측",
    },
    form: {
      currentDistance: "현재 자기 최고 거리",
      currentTime: "그때의 기록 (시:분:초)",
      targetDistance: "예측할 거리",
      timePlaceholder: "0:45:30",
      pace: "페이스",
      submit: "예측하기",
      invalidTime: "시간 형식이 올바르지 않습니다 (예: 0:45:30 또는 45:30)",
      unrealistic: "현실적인 범위의 시간을 입력하세요",
      sameDistance: "현재 거리와 예측 거리가 같습니다",
      inputPaceHint: "예: 0:45:30 / 45:30 / 1:30:45",
    },
    result: {
      threeModelAvg: "3모델 평균",
      pacePerKm: "추천 1km 페이스",
      threeModelTitle: "3개 모델 병렬 표시",
      rangeLabel: "범위",
      paceLapTitle: "추천 1km 랩",
      paceLapNote:
        "30km 이후는 +0.5초/km/km 의 자연 감속을 포함한 추천 랩. 전반을 절제하고 후반을 이 곡선에 맞추면 실속을 막을 수 있습니다.",
      trainingTitle: "권장 트레이닝",
      trainingNote: "수준의 다리를 만들기 위한 기준입니다.",
      monthly: "월간",
      weekly: "주간",
      longRun: "롱런",
      shareTitle: "이 예측 공유하기",
      backCta: "← 다른 조건으로 예측",
      equivalentTitle: "전 거리 등가 예측",
      equivalentSub: "지금 당신의 주력으로 각 거리를 어느 정도에 달릴 수 있는지 기준.",
      trainingPacesTitle: "VDOT 트레이닝 페이스",
      trainingPacesSub: "Daniels VDOT 이론에서 도출된 5개 트레이닝 존. 일일 훈련의 잣대로.",
      racePlanTitle: "5km 스플릿 플랜",
      racePlanSub: "5km 단위 랩 기준. 레이스 당일 페이스 계획에.",
      racePlanEven: "이븐",
      racePlanNegative: "네거티브 스플릿 (후반 −1%)",
      splitKm: "구간",
      splitTime: "구간 시간",
      splitCum: "통과",
      heatTitle: "기온 보정",
      heatSub:
        "기온이 +5°C 오를 때마다 마라톤 페이스는 약 1.6% 떨어집니다 (Daniels 경험칙). 당일 예보를 입력해 현실적인 예측을 확인하세요.",
      heatTemp: "예상 기온",
      heatAdjusted: "보정 후 예측 시간",
      heatNote:
        "더위 적응 정도, 습도, 직사광선에 따라 실제 영향은 달라집니다. 15°C 이상이면 대책 필수, 25°C 이상이면 서브 목표 재검토 권장.",
    },
    share: {
      x: "𝕏 에 공유",
      line: "LINE 에 공유",
      copy: "🔗 링크 복사",
      copied: "✓ 복사됨",
    },
    models: {
      riegel: "Riegel (k=1.14)",
      riegelDesc:
        "Peter Riegel (1981) 의 경험식. 일반 러너용 보정 계수 k=1.14 적용. 거리가 길어질수록 페이스 저하를 강하게 추정하는 보수적 예측.",
      vdot: "VDOT (Daniels)",
      vdotDesc:
        "Jack Daniels 의 VDOT 이론. 최대산소섭취량과 지속 시간의 관계에서 도출. 트레이닝 지표로도 표준.",
      riegelElite: "Riegel (k=1.06)",
      riegelEliteDesc:
        "Riegel 원래의 k=1.06. 단련된 러너 (주 60km 이상 지속) 용 낙관값. 일반 러너에게는 후하게 나오기 쉬우나 목표 설정의 상한값으로 활용.",
    },
    zones: {
      easy: "E (이지)",
      easyDesc: "대화 가능한 페이스. 기초 형성과 회복에. 주의 대부분을 이 존에서.",
      marathon: "M (마라톤)",
      marathonDesc: "마라톤 목표 페이스. 20–30km 롱런에서 익히기.",
      threshold: "T (역치)",
      thresholdDesc: "젖산 역치 페이스. 20–60분 지속 가능한 강도. 템포 런의 잣대.",
      interval: "I (인터벌)",
      intervalDesc: "VO₂max 자극 강도. 1km×5세트 또는 3–5분×여러 세트로.",
      repetition: "R (레피티션)",
      repetitionDesc: "스피드와 러닝 이코노미 강화. 200–400m 를 완전 휴식으로 반복.",
    },
    subTargets: {
      sub5: "서브5",
      sub4: "서브4",
      "sub3.5": "서브3:30",
      sub3: "서브3",
      "sub2.5": "서브2:30",
      halfSub2: "하프 서브2",
      "halfSub1.75": "하프 서브1:45",
      "halfSub1.5": "하프 서브1:30",
      inReach: "을(를) {{delta}} 차이로 사정권",
      awayBy: "까지 {{delta}}",
    },
    pace: {
      title: "페이스 계산",
      tagline:
        "거리·시간·페이스 중 둘만 입력하면 나머지를 계산. min/km · min/mi · km/h · mph 병렬 표시.",
      modeDistTime: "거리 + 시간 → 페이스",
      modeTimeDistPace: "페이스 + 거리 → 시간",
      modePaceDist: "페이스 + 시간 → 거리",
      distance: "거리",
      time: "시간",
      paceLabel: "페이스",
      perKm: "/km",
      perMi: "/mi",
      kmh: "km/h",
      mph: "mph",
      presets: "거리 프리셋",
      custom: "커스텀 거리",
      customMeters: "미터 단위로 입력",
      showAllUnits: "모든 단위 표시",
    },
    about: {
      title: "이 도구에 대하여",
      whatHeading: "어떤 도구인가",
      whatBody:
        "5K, 10K, 하프 등 짧은 거리의 레이스 기록을 입력하면 마라톤 (또는 원하는 거리) 의 시간을 3개 모델로 병렬 산출합니다. 결과는 URL 에 인코딩되어 공유해도 누구나 동일한 예측을 재현할 수 있습니다.",
      modelsHeading: "사용 중인 예측 모델",
      modelsFooter:
        "3개 예측값 병렬 표시로 과대·과소 예측의 편향을 상쇄하고, 자신의 실제값이 「보수 ↔ 낙관」 어디에 있는지 파악할 수 있습니다.",
      cautionHeading: "주의 사항",
      caution1: "예측값은 어디까지나 「현재 주력에서의 이론값」 입니다.",
      caution2:
        "기상 조건 (기온·습도·바람), 코스 (고저차), 보급, 당일 컨디션, 본 레이스까지의 트레이닝 상태에 따라 실제 기록은 변동합니다.",
      caution3:
        "짧은 거리 (3km 등) 에서 마라톤으로의 예측은 오차가 커지기 쉽습니다. 하프 기록이 있으면 신뢰도가 가장 높아집니다.",
      faqHeading: "자주 묻는 질문",
      faq: [
        {
          q: "Riegel · VDOT · Riegel-Elite 3개 모델 중 어느 것을 믿어야 하나요?",
          a: "3개 평균이 중앙값 기준입니다. Riegel (k=1.14) 는 보수적, Riegel-Elite (k=1.06) 는 낙관적, VDOT 는 그 사이에 자리합니다. 주 60km 이상 단련된 러너는 Riegel-Elite 쪽으로 기울어집니다.",
        },
        {
          q: "서브4 · 서브3 달성에 월 얼마나 달려야 하나요?",
          a: "경험치로 서브4 는 월 150~250km, 서브3:30 은 월 250~350km, 서브3 는 월 350km 이상이 기준. 거리뿐 아니라 템포 런과 역치 페이스 훈련도 핵심입니다.",
        },
        {
          q: "왜 Cameron 공식이 아니라 Riegel-Elite 를 쓰나요?",
          a: "Cameron (1998) 의 textbook 공식은 아마추어 러너에게 비현실적으로 빠른 예측을 내놓습니다 (10K 45분에서 약 3:09 마라톤). 투명하고 검증 가능한 대안으로 Riegel 원래의 k=1.06 을 「낙관적 상한」으로 채택했습니다.",
        },
        {
          q: "더운 날 예측은 어떻게 봐야 하나요?",
          a: "Daniels 의 경험칙으로 +5°C 마다 마라톤 페이스가 약 1.6% 떨어집니다. 결과 페이지의 「기온 보정」 슬라이더로 당일 예보를 입력하면 보정된 시간을 확인할 수 있습니다.",
        },
        {
          q: "URL 공유만으로 같은 예측이 재현되는 이유는?",
          a: "모든 입력 (출발 거리 · 시간 · 목표 거리) 이 URL 자체에 인코딩되어 있기 때문. 백엔드나 DB 없이 완전히 stateless 구조라 같은 해시·슬러그를 열면 누구나 동일한 결과를 봅니다.",
        },
      ],
    },
    predict: {
      h1: "{{from}} {{time}} → {{to}} 예측 시간",
      description:
        "{{from}} 을(를) {{time}} 에 달리는 사람이 {{to}} 를 얼마에 달릴 수 있는지. 3모델 평균과 개별 모델 예측, 추천 페이스와 트레이닝 메뉴까지 한눈에.",
      indexTitle: "예측 랜딩 모음",
      indexTagline: "자주 검색되는 거리·시간 조합. 탭하면 예측 결과 페이지로.",
      seeFullResult: "→ 전체 결과 페이지 보기",
    },
    footer: {
      disclaimer:
        "예측값은 어디까지나 기준입니다. 기상 · 코스 · 컨디션 · 트레이닝 상태에 따라 실제 기록은 변동합니다.",
      citation: "모델: Peter Riegel (1981) / Jack Daniels VDOT",
      supportCta: "개발 지원하기 (Ko-fi)",
      affiliateDisclosure:
        "Amazon 어소시에이트로서 마라톤 타임 예측은 적격 판매를 통해 수입을 얻습니다.",
    },
    gear: {
      title: "예측 타임대에 맞는 슈즈 찾기",
      body: "목표 타임대에 맞춘 러닝화를 Amazon에서 검색합니다 (외부 사이트·PR).",
      bodyTier: "{{tier}} 목표에 맞춘 러닝화를 Amazon에서 검색합니다 (외부 사이트·PR).",
      cta: "Amazon에서 슈즈 보기",
      ctaTier: "{{tier}}용 슈즈를 Amazon에서 보기",
      disclosure:
        "[PR] Amazon 어소시에이트로서 마라톤 타임 예측은 적격 판매를 통해 수입을 얻습니다. 가격·재고는 Amazon 표시를 따릅니다.",
    },
    support: {
      title: "도움이 됐다면 개발을 한 잔 응원해주세요",
      body: "후원금은 예측 도구 개선비에 씁니다.",
      cta: "Ko-fi로 지원하기",
    },
    distances: {
      "3k": "3km",
      "5k": "5km",
      "10k": "10km",
      "15k": "15km",
      half: "하프",
      "30k": "30km",
      full: "마라톤",
      halfShort: "하프",
      fullShort: "마라톤",
    },
    trainingTier: {
      sub3: {
        tier: "서브3 도전 층",
        comment:
          "속근+지근의 믹스를 높은 수준으로 요구하는 영역. 거리·강도 어느 쪽도 타협하지 말고, 회복일도 동일한 우선순위로.",
        w1: "주1: 1km×5세트 인터벌 (M 페이스 −20~30초/km)",
        w2: "주1: 16~20km 템포 (M 페이스)",
        w3: "주1: 30~35km 롱런 (M 페이스 +20~30초/km)",
      },
      sub35: {
        tier: "서브3:30 도전 층",
        comment:
          "주력의 성장 여지가 아직 큰 층. 월간 거리를 300km 전후로 안정시키고 템포로 역치를 끌어올리는 시기.",
        w1: "주1: 1km×3~5세트 인터벌",
        w2: "주1: 12~16km 템포",
        w3: "주1: 25~30km 롱런 (후반 M 페이스 가속)",
      },
      sub4: {
        tier: "서브4 도전 층",
        comment:
          "주 3~4회의 훈련으로 충분히 도달 가능. 롱런으로 다리를 만들고 템포로 역치를 의식. 부상 위험이 커지는 거리대이므로 점진적으로 늘리기.",
        w1: "주1: 1km×3세트 페이스 런 (M 페이스 −10초/km)",
        w2: "주1: 8~12km 템포",
        w3: "주1: 22~28km 롱런 (LSD)",
      },
      sub45: {
        tier: "서브4:30 도전 층",
        comment:
          "「20km 의 벽」을 넘느냐가 승부. 롱런으로 30km 를 1~2회 경험해 두면 당일 불안이 크게 줄어듭니다.",
        w1: "주1: 5km 빌드업 런",
        w2: "주1: 조깅 8~10km (대화 가능 페이스)",
        w3: "주1: 20~25km 롱런",
      },
      sub5: {
        tier: "서브5 · 완주 도전 층",
        comment:
          "여기서는 거리 위주 단계. 주 3회 훈련으로 월 100km 전후를 목표로 하고, 자세와 보급을 몸에 기억시키기.",
        w1: "주1: 조깅 5~8km",
        w2: "주1: 빌드업 또는 언덕 훈련",
        w3: "주1: 18~22km 롱런 (걷기 섞어도 OK)",
      },
      finish: {
        tier: "완주 도전 층",
        comment:
          "완주가 최대 목표. 거리에 몸을 적응시키는 것이 최우선이며, 페이스는 「대화 가능」을 엄수. 부상 제로로 본 레이스를 맞이하는 전략.",
        w1: "주1: 워크&런 5km",
        w2: "주1: 천천히 조깅 6~8km",
        w3: "주1: 15~22km 롱런 (걷기 OK · 보급 연습)",
      },
    },
  },
};

/**
 * Translation getter. Param substitution is `{{name}}`.
 * Type-safe via the Dict structure: callers use `t.result.threeModelAvg` etc.
 */
export function getDict(locale: Locale): Dict {
  return DICT[locale];
}

export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ""));
}
