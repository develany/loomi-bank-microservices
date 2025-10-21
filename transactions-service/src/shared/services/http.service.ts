import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ConfigService } from "../../config/config.service";
import { LoggerService } from "./logger.service";

@Injectable()
export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService
  ) {
    this.logger.setContext("HttpService");
    this.axiosInstance = axios.create({
      timeout: 5000,
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug(`Making request to ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`Request error: ${error.message}`, error.stack);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(`Received response from ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          this.logger.error(
            `Response error: ${error.response.status} - ${error.message}`,
            error.stack
          );
        } else {
          this.logger.error(`Request failed: ${error.message}`, error.stack);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}
