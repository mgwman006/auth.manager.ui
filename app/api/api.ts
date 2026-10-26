import axios from 'axios';
import { AccountAction, AccountAuthRequestDTO, AccountAuthResponseDTO, AccountCreateDto, AccountDetailsDto, ApiError, ApiResponse, UserCreateRequestDto, UserDetailsDTO } from '../types/types';

const apiUrl = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: `${apiUrl}/auth-manager/v1`, 
  headers: {
    'Content-Type': 'application/json',
  } ,
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      // An HTTP response is accessible to JavaScript.
      const body = error.response.data;

      return Promise.reject(
        new ApiError({
          message: body?.message ?? "SERVER_ERROR",
          data: body?.data ?? null,
          statusCode: body?.statusCode ?? error.response.status,
        })
      );
    }

    if (axios.isAxiosError(error) && error.request) {
      // No HTTP response is accessible to JavaScript.
      return Promise.reject(
        new ApiError({
          message: "NETWORK_ERROR",
          data: error.message,
          statusCode: 0,
        })
      );
    }

    // Error occurred while setting up the request.
    return Promise.reject(
      new ApiError({
        message: "CLIENT_ERROR",
        data: error instanceof Error
          ? error.message
          : "Unexpected error occurred",
        statusCode: 0,
      })
    );
  }
);


export const authApi = {
  getAccount: async (phoneNumber?: string) => {
    const res = await apiClient.get<ApiResponse<AccountDetailsDto>>("/auth/account", {
      params: { phoneNumber },
    });

    return handleResponse(res.data);
  },
  logIn: async (request: AccountAuthRequestDTO) => {
    const res =  await apiClient.post<ApiResponse<AccountAuthResponseDTO>>(`/auth`,request);
    return handleResponse(res.data);
  },
  register: async (request: AccountCreateDto) => {
    const res =  await apiClient.post<ApiResponse<AccountDetailsDto>>(`/auth/account`,request);
    return handleResponse(res.data);
  }
};

export const usersApi = {
  getByPhoneNumber: async (phoneNumber: string): Promise<UserDetailsDTO> => {
    const res = await apiClient.get<ApiResponse<UserDetailsDTO>>(`/users/${phoneNumber}`);
    return handleResponse(res.data);
  },
  registerUser: async (request: UserCreateRequestDto): Promise<UserDetailsDTO> => {
    const res = await apiClient.post<ApiResponse<UserDetailsDTO>>(`/users`, request);
    return handleResponse(res.data);
  },
};

export function handleResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message ?? "Request failed");
  }

  return response.data;
}
