import { postPhoto } from "@/lib/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpload = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postPhoto,
  });

  const uploadPhoto = (formData: FormData, callback: () => void) => {
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get"],
        });

        toast.success("Photo uploaded successfully");
        callback();
      },
      onError: (error) => {
        toast.error("Upload failed: " + error.message);
      },
    });
  };

  return {
    uploadPhoto,
    isMutating: isPending,
  };
};
