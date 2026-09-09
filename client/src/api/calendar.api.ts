import { isMockActive } from './axios';
import { mockStore } from './mock/mockStore';
import { CalendarLeaveEvent } from './mock/mockData';

export const calendarApi = {
  async getMonthEvents(year: number, month: number): Promise<CalendarLeaveEvent[]> {
    if (!isMockActive()) {
      return [];
    }

    return mockStore.getCalendarEvents(year, month);
  },
};
