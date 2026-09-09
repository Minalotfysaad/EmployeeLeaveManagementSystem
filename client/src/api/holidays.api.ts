import { apiClient, USE_MOCK } from './axios';
import {
  HolidayDetailsDto,
  HolidaySummaryDto,
  CreateHolidayDto,
  UpdateHolidayDto,
} from '../types/holiday.types';
import { EmployeeQueryParameters } from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const holidaysApi = {
  async getHolidays(params: EmployeeQueryParameters = {}): Promise<PagedResult<HolidaySummaryDto>> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<PagedResult<HolidaySummaryDto>>('/holidays', {
          params,
        });
        return response.data;
      } catch (err) {
        console.warn('Backend API getHolidays failed, using mock...', err);
      }
    }

    const all = mockStore.getHolidays();
    return {
      items: all,
      page: 1,
      pageSize: 50,
      totalCount: all.length,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  },

  async getHoliday(id: string): Promise<HolidayDetailsDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<HolidayDetailsDto>(`/holidays/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend API getHoliday failed, using mock...', err);
      }
    }

    const item = mockStore.getHolidays().find((h) => h.id === id);
    if (!item) throw new Error('Holiday not found');
    return item;
  },

  async createHoliday(dto: CreateHolidayDto): Promise<HolidayDetailsDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post<HolidayDetailsDto>('/holidays', dto);
        return response.data;
      } catch (err) {
        console.warn('Backend API createHoliday failed, using mock...', err);
      }
    }

    return mockStore.createHoliday(dto.name, dto.startDate, dto.endDate);
  },

  async updateHoliday(id: string, dto: UpdateHolidayDto): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.put(`/holidays/${id}`, dto);
        return;
      } catch (err) {
        console.warn('Backend API updateHoliday failed, using mock...', err);
      }
    }

    mockStore.updateHoliday(id, dto.name, dto.startDate, dto.endDate);
  },

  async deleteHoliday(id: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/holidays/${id}`);
        return;
      } catch (err) {
        console.warn('Backend API deleteHoliday failed, using mock...', err);
      }
    }

    mockStore.deleteHoliday(id);
  },
};
