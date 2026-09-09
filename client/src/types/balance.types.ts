export interface BalanceDto {
  leaveTypeId: string;
  leaveType: string;
  remainingDays: number;
}

export interface UpdateBalanceDto {
  remainingDays: number;
}

export interface BalanceWithTotalDto extends BalanceDto {
  defaultDays?: number;
  usedDays?: number;
}
