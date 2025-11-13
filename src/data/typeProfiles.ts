export interface TypeProfile {
  key: string;
  name: string;
  catchcopy: string;
  persona: string;
  quote: string;
  strengths: string;
}

function normalize(typeKey: string): string {
  // 末尾Planの"P"を"Pn"に正規化
  return typeKey.replace(/([PCRUST])(P)$/, (_m, head, tail) => `${head}Pn`);
}

const profiles: Record<string, TypeProfile> = {
  // P-S-R-Pn
  PSRPn: {
    key: 'PSRPn',
    name: '孤高の青写真研究者',
    catchcopy: '「構想から実験まで、自分の頭の中に全てある。」',
    persona: '静かにロジックを積み上げる研究肌。人より先に未来を見ている。',
    quote: '🗣「理想の形が見えた時点で満足しちゃうんだよね。」',
    strengths: '要件定義／UI設計',
  },
  // P-S-R-A
  PSRA: {
    key: 'PSRA',
    name: '爆速ソロ実験家',
    catchcopy: '「思いついたら即ビルド、寝る前に新機能。」',
    persona: 'コードを書きながら考える実験駆動型。',
    quote: '🗣「まず動かしてみよう。それが一番速い。」',
    strengths: 'プロトタイプ／技術検証',
  },
  // P-S-U-Pn
  PSUPn: {
    key: 'PSUPn',
    name: '段取りソロの実用設計者',
    catchcopy: '「無駄を削り、最短ルートで堅実に。」',
    persona: '設計と品質を重視する安定志向。',
    quote: '🗣「しっかり作った方が後々ぜったい楽。」',
    strengths: '要件定義／品質設計',
  },
  // P-S-U-A
  PSUA: {
    key: 'PSUA',
    name: '即出荷のソロプロデューサー',
    catchcopy: '「出してみてから考えよう。」',
    persona: '速度最優先。ユーザー反応重視。',
    quote: '🗣「β版でいい、今日出すぞ。」',
    strengths: 'MVP開発／初期出荷',
  },
  // P-T-R-Pn
  PTRPn: {
    key: 'PTRPn',
    name: '構想先行の革新研究者',
    catchcopy: '「未来のプロダクトを仲間と描く。」',
    persona: '斬新なアイデアをチームで磨くタイプ。',
    quote: '🗣「誰も作ってないものほど燃えるよね。」',
    strengths: '企画／プロト設計',
  },
  // P-T-R-A
  PTRA: {
    key: 'PTRA',
    name: '走りながら検証する共創クリエイター',
    catchcopy: '「手を動かしながら議論を進める。」',
    persona: '実装しつつ議論して形にする推進力。',
    quote: '🗣「考えながら作る方が圧倒的に速い。」',
    strengths: 'プロトタイプ／技術検証',
  },
  // P-T-U-Pn
  PTUPn: {
    key: 'PTUPn',
    name: '段取り巧者の共創プロダクター',
    catchcopy: '「議論を設計に変換する、頼れるPMタイプ。」',
    persona: '安定・現実的な設計が武器。',
    quote: '🗣「理想より“動く仕組み”を優先しよう。」',
    strengths: '要件定義／仕様調整',
  },
  // P-T-U-A
  PTUA: {
    key: 'PTUA',
    name: '現場で磨く共創ドライバー',
    catchcopy: '「とりあえず出す、からプロダクトは進化する。」',
    persona: '動くものを素早く共有しチームを前に進める。',
    quote: '🗣「実際に触ってから決めよ。」',
    strengths: 'MVP開発／運用改善',
  },
  // C-S-R-Pn
  CSRPn: {
    key: 'CSRPn',
    name: '設計も嗜む孤高の実験エンジニア',
    catchcopy: '「構造もコードも、自分で完結したい。」',
    persona: '技術選定も実装も高い精度でこなす。',
    quote: '🗣「理論と実装、どっちも大事でしょ。」',
    strengths: 'アーキ設計／技術検証',
  },
  // C-S-R-A
  CSRA: {
    key: 'CSRA',
    name: '単騎突撃の実験ハッカー',
    catchcopy: '「壊して作って、また壊す。」',
    persona: '改修・検証の鬼。変化に強い。',
    quote: '🗣「このコード、ちょっと気に食わないな…作り直すか。」',
    strengths: 'プロトタイプ／リファクタ',
  },
  // C-S-U-Pn
  CSUPn: {
    key: 'CSUPn',
    name: '段取り上手な実装ソリスト',
    catchcopy: '「整理されたコードは裏切らない。」',
    persona: '安定感と手堅い実装力。',
    quote: '🗣「動作確認は作業の一部なんだよ。」',
    strengths: '実装／品質保証',
  },
  // C-S-U-A
  CSUA: {
    key: 'CSUA',
    name: '孤高の実装職人',
    catchcopy: '「余計なことはしない。やるべきことだけやる。」',
    persona: '静かに淡々と成果を積む。',
    quote: '🗣「終わったら連絡するね。」',
    strengths: '実装／保守',
  },
  // C-T-R-Pn
  CTRPn: {
    key: 'CTRPn',
    name: '青写真に強い実験型エンジニア',
    catchcopy: '「未来を見据えて技術を選ぶ。」',
    persona: '判断軸が論理的で柔軟。',
    quote: '🗣「最適解は、状況によって変わる。」',
    strengths: 'アーキ設計／技術調査',
  },
  // C-T-R-A
  CTRA: {
    key: 'CTRA',
    name: '共創の実験ドリブンエンジニア',
    catchcopy: '「実装で語り、議論で磨く。」',
    persona: 'コードコミュニケーションが得意。',
    quote: '🗣「試作品置いたよ。これで話す方が早い。」',
    strengths: 'プロトタイプ／レビュー',
  },
  // C-T-U-Pn
  CTUPn: {
    key: 'CTUPn',
    name: '現実主義のチームプレイヤー',
    catchcopy: '「完璧よりも“届くこと”が大事。」',
    persona: '控えめだが確実に進める安定軸。',
    quote: '🗣「ユーザーに届く形ってどれだろう？」',
    strengths: 'リリース管理／運用',
  },
  // C-T-U-A
  CTUA: {
    key: 'CTUA',
    name: '出荷最優先の連携ハッカー',
    catchcopy: '「“今動く”を最短で届ける。」',
    persona: '納期駆動で状況を動かすタフガイ。',
    quote: '🗣「リファクタは次リリースでいいよね。」',
    strengths: 'MVP開発／リリース前対応',
  },
};

export function getTypeProfile(typeKey: string): TypeProfile | undefined {
  const normalized = normalize(typeKey);
  return profiles[normalized];
}



