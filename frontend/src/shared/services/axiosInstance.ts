import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface AppAxiosRequestConfig extends AxiosRequestConfig {
    showToast?: boolean
}

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_ENDPOINT 
})

const axiosRequest = {
  async get<T>(url: string, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((response) => response.data);
  },

  async post<T>(url: string, data?: any, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.post<T>(url, data, config).then((response) => response.data);
  },

  async put<T>(url: string, data?: any, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.put<T>(url, data, config).then((response) => response.data);
  },

  async delete<T>(url: string, config?: AppAxiosRequestConfig): Promise<T> {
    return axiosInstance.delete<T>(url, config).then((response) => response.data);
  },
};

export default axiosRequest;
