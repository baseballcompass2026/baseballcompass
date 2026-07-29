// 外部APIを差し替え可能にするProvider契約
export interface BaseballProvider {
  getToday(): Promise<unknown>;
  getSchedule(): Promise<unknown>;
  getRanking(): Promise<unknown>;
  getShop(): Promise<unknown>;
}