// タイトルから抽出する日本人メジャー選手辞書。slugはAPI URLに使用する。
export const players = [
  { name:"大谷翔平", slug:"ohtani", aliases:["大谷翔平","Shohei Ohtani","Ohtani"] },
  { name:"山本由伸", slug:"yamamoto", aliases:["山本由伸","Yoshinobu Yamamoto"] },
  { name:"佐々木朗希", slug:"sasaki", aliases:["佐々木朗希","Roki Sasaki"] },
  { name:"鈴木誠也", slug:"suzuki", aliases:["鈴木誠也","Seiya Suzuki"] },
  { name:"今永昇太", slug:"imanaga", aliases:["今永昇太","Shota Imanaga"] },
  { name:"ダルビッシュ有", slug:"darvish", aliases:["ダルビッシュ有","Yu Darvish","Darvish"] },
  { name:"菊池雄星", slug:"kikuchi", aliases:["菊池雄星","Yusei Kikuchi"] },
  { name:"千賀滉大", slug:"senga", aliases:["千賀滉大","Kodai Senga"] },
  { name:"吉田正尚", slug:"yoshida", aliases:["吉田正尚","Masataka Yoshida"] }
] as const;

// MLB 30球団・NPB 12球団。日本語名と主要な英語表記を同じタグへ正規化する。
export const teams = [
  ["ロサンゼルス・ドジャース",["ドジャース","Los Angeles Dodgers","Dodgers"]],["サンディエゴ・パドレス",["パドレス","San Diego Padres","Padres"]],["サンフランシスコ・ジャイアンツ",["SFジャイアンツ","San Francisco Giants"]],["アリゾナ・ダイヤモンドバックス",["ダイヤモンドバックス","Arizona Diamondbacks"]],["コロラド・ロッキーズ",["ロッキーズ","Colorado Rockies"]],
  ["シカゴ・カブス",["カブス","Chicago Cubs"]],["ミルウォーキー・ブルワーズ",["ブルワーズ","Milwaukee Brewers"]],["セントルイス・カージナルス",["カージナルス","St. Louis Cardinals"]],["シンシナティ・レッズ",["レッズ","Cincinnati Reds"]],["ピッツバーグ・パイレーツ",["パイレーツ","Pittsburgh Pirates"]],
  ["フィラデルフィア・フィリーズ",["フィリーズ","Philadelphia Phillies"]],["ニューヨーク・メッツ",["メッツ","New York Mets"]],["アトランタ・ブレーブス",["ブレーブス","Atlanta Braves"]],["マイアミ・マーリンズ",["マーリンズ","Miami Marlins"]],["ワシントン・ナショナルズ",["ナショナルズ","Washington Nationals"]],
  ["ニューヨーク・ヤンキース",["ヤンキース","New York Yankees"]],["ボストン・レッドソックス",["レッドソックス","Boston Red Sox"]],["ボルチモア・オリオールズ",["オリオールズ","Baltimore Orioles"]],["タンパベイ・レイズ",["レイズ","Tampa Bay Rays"]],["トロント・ブルージェイズ",["ブルージェイズ","Toronto Blue Jays"]],
  ["クリーブランド・ガーディアンズ",["ガーディアンズ","Cleveland Guardians"]],["デトロイト・タイガース",["デトロイト・タイガース","Detroit Tigers"]],["カンザスシティ・ロイヤルズ",["ロイヤルズ","Kansas City Royals"]],["ミネソタ・ツインズ",["ツインズ","Minnesota Twins"]],["シカゴ・ホワイトソックス",["ホワイトソックス","Chicago White Sox"]],
  ["ヒューストン・アストロズ",["アストロズ","Houston Astros"]],["シアトル・マリナーズ",["マリナーズ","Seattle Mariners"]],["テキサス・レンジャーズ",["レンジャーズ","Texas Rangers"]],["ロサンゼルス・エンゼルス",["エンゼルス","Los Angeles Angels","Angels"]],["アスレチックス",["Athletics","アスレチックス"]],
  ["読売ジャイアンツ",["読売ジャイアンツ","巨人"]],["阪神タイガース",["阪神タイガース","阪神"]],["横浜DeNAベイスターズ",["DeNA","ベイスターズ"]],["広島東洋カープ",["広島カープ","カープ"]],["東京ヤクルトスワローズ",["ヤクルト","スワローズ"]],["中日ドラゴンズ",["中日","ドラゴンズ"]],
  ["福岡ソフトバンクホークス",["ソフトバンク","ホークス"]],["北海道日本ハムファイターズ",["日本ハム","ファイターズ"]],["千葉ロッテマリーンズ",["ロッテ","マリーンズ"]],["東北楽天ゴールデンイーグルス",["楽天イーグルス","楽天"]],["オリックス・バファローズ",["オリックス","バファローズ"]],["埼玉西武ライオンズ",["西武","ライオンズ"]]
] as const;

export const npbTeamNames: Set<string> = new Set(teams.slice(30).map(([name]) => name));
export const mlbTeamNames: Set<string> = new Set(teams.slice(0,30).map(([name]) => name));