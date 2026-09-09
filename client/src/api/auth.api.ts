import { apiClient, isMockActive } from './axios';
import { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from '../types/auth.types';
import { mockStore } from './mock/mockStore';

export const authApi = {
  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    if (!isMockActive()) {
      const response = await apiClient.post<AuthResponseDto>('/auth/login', dto);
      return response.data;
    }

    // Mock Login implementation (for Demo Mode)
    const user = mockStore.getUserByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid email or password in demo database.');
    }

    // Generate a structured mock JWT containing real claims
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        nameid: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.roles,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      })
    );
    const mockToken = `${header}.${payload}.mockSignature`;

    return {
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      token: mockToken,
    };
  },

  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    if (!isMockActive()) {
      const response = await apiClient.post<AuthResponseDto>('/auth/register', dto);
      return response.data;
    }

    const existing = mockStore.getUserByEmail(dto.email);
    if (existing) {
      throw new Error('An employee with this email already exists.');
    }

    const dept = dto.departmentId
      ? mockStore.getDepartments().find((d) => d.id === dto.departmentId)
      : undefined;

    const newId = `usr-${Date.now()}`;
    const newUser = {
      id: newId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      departmentName: dept?.name || 'General',
      roles: ['Employee'],
      createdDate: new Date().toISOString(),
    };

    // Save to mock store
    (mockStore as any).users.push(newUser);
    mockStore.getBalances(newId);

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        nameid: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        role: newUser.roles,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      })
    );
    const mockToken = `${header}.${payload}.mockSignature`;

    return {
      email: newUser.email,
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      token: mockToken,
    };
  },
};
