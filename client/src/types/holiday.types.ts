export interface HolidaySummaryDto {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdBy?: string;
}

export interface HolidayDetailsDto {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateHolidayDto {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateHolidayDto {
  name: string;
  startDate: string;
  endDate: string;
}
