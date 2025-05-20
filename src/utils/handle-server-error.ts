// Updated handleServerError.ts
import { AxiosError } from "axios";
import { toast } from "sonner";

export function handleServerError(error: unknown) {
  // Log the error
  // eslint-disable-next-line no-console
  console.log(error);

  if (error instanceof AxiosError) {
    const errorData = error.response?.data;
    const status = error.response?.status;

    // Handle specific status codes
    if (status === 304) {
      toast.error("Content not modified!", { closeButton: true });
      return;
    }

    if (status === 401) {
      // Don't show toast since it's handled in queryCache
      return;
    }

    if (status === 204) {
      toast.error("Content not found.", { closeButton: true });
      return;
    }

    if (errorData?.message) {
      toast.error(errorData.message, { closeButton: true });

      // Log validation errors if they exist
      if (errorData.errors) {
        // eslint-disable-next-line no-console
        console.error("Validation errors:", errorData.errors);
      }
      return;
    }

    if (errorData?.title) {
      toast.error(errorData.title, { closeButton: true });
      return;
    }

    // Fallback for other Axios errors
    toast.error("An error occurred while processing your request", {
      closeButton: true,
    });
  } else {
    // Handle non-Axios errors
    toast.error("Something went wrong!", { closeButton: true });
  }
}
