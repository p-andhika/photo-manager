import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Upload photo
const postPhoto = async (payload: FormData) => {
  const res = await fetch("http://localhost:3003/photos", {
    method: "POST",
    body: payload,
  });
  if (!res.ok) throw new Error("Failed to upload photo");
  return res.json();
};

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
