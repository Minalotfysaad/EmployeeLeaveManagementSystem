export interface ApprovalDecisionDto {
  comment?: string;
}

export enum Decision {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}
