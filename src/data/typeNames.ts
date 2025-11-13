const typeNameMap: Record<string, string> = {
  // P S R Pn
  PSRPn: '孤高の青写真研究者',
  // P S R A
  PSRA: '爆速ソロ実験家',
  // P S U Pn
  PSUPn: '段取りソロの実用設計者',
  // P S U A
  PSUA: '即出荷のソロプロデューサー',
  // P T R Pn
  PTRPn: '構想先行の革新研究者',
  // P T R A
  PTRA: '走りながら検証する共創クリエイター',
  // P T U Pn
  PTUPn: '段取り巧者の共創プロダクター',
  // P T U A
  PTUA: '現場で磨く共創ドライバー',
  // C S R Pn
  CSRPn: '設計も嗜む孤高の実験エンジニア',
  // C S R A
  CSRA: '単騎突撃の実験ハッカー',
  // C S U Pn
  CSUPn: '段取り上手な実装ソリスト',
  // C S U A
  CSUA: '孤高の実装職人',
  // C T R Pn
  CTRPn: '青写真に強い実験型エンジニア',
  // C T R A
  CTRA: '共創の実験ドリブンエンジニア',
  // C T U Pn
  CTUPn: '現実主義のチームプレイヤー',
  // C T U A
  CTUA: '出荷最優先の連携ハッカー',
};

export function getTypeDisplayName(typeKey: string): string {
  // 安全側：万一 "P" 末尾の旧表記が来た場合 "Pn" に補正
  const normalized = typeKey.replace(/([PCRUST])(P)$/, (_m, head, tail) => `${head}Pn`);
  return typeNameMap[normalized] || 'タイプ名未定義';
}



