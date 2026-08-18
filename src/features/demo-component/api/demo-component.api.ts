import { apiClient } from '@/shared/lib/axios';
import type { PaginatedResponse } from '@/shared/types';
import type { DemoApiPanigationRequest, response } from '../types/demo.type';


export const getDemoApiPanigation = async (body: DemoApiPanigationRequest): Promise<PaginatedResponse<response>> => {
  return apiClient.post<PaginatedResponse<response>>('/api/User/GetUserForProfile', body);
};