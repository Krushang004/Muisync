export type StatusSeverity = 'info' | 'warning' | 'error';

export interface StatusDocument {
  message: string | null;
  severity: StatusSeverity;
}

export interface StatusBannerData {
  message: string;
  severity: StatusSeverity;
  id: string;
}
