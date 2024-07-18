import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface AppAxiosRequestConfig extends AxiosRequestConfig {
    showToast?: boolean
}

export interface AppAxiosError extends AxiosError {
  formattedMessage?: string;
}

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_ENDPOINT 
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
  const token = localStorage.getItem('AUTH_TOKEN')

  if (token) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return config
})

const axiosRequest = {
  async get<T>(url: string, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((response) => response.data);
  },

  async post<T>(url: string, data?: any, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.post<T>(url, data, config).then((response) => response.data).catch();
  },

  async put<T>(url: string, data?: any, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.put<T>(url, data, config).then((response) => response.data);
  },

  async delete<T>(url: string, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.delete<T>(url, config).then((response) => response.data);
  },
};

export default axiosRequest;
