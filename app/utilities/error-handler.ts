import { NotificationInstance } from "antd/es/notification/interface";
import { ApiError } from "../types/types";



export function handleApiError(error: unknown, notificationApi:NotificationInstance) 
{
  const apiError = error as ApiError;
  notificationApi.error({
      message: apiError.message ?? "Failed to accept invitation",
      description: apiError.details
          ? typeof apiError.details === "string"
              ? apiError.details
              : JSON.stringify(apiError.details)
          : "The invitation could not be accepted.",
  });
}