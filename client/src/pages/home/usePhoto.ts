import {
  deletePhoto,
  getMetadata,
  getPhoto,
  getPhotoIds,
  putMetadata,
} from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export const usePhoto = () => {
  const {
    data: photoIds,
    isFetching: idsLoading,
    error: idsError,
  } = useQuery({ queryKey: ["get", "photoIds"], queryFn: getPhotoIds });

  const {
    data: photos,
    isFetching: photosLoading,
    error: photosError,
  } = useQuery({
    queryKey: ["get", "photos", photoIds?.length],
    queryFn: async () => {
      const photoBlobs = await Promise.all(photoIds?.map(getPhoto));

      return photoBlobs;
    },
    enabled: photoIds?.length > 0,
  });

  const {
    data: metadata,
    isFetching: metadataLoading,
    error: metadataError,
  } = useQuery({
    queryKey: ["get", "metadata", photoIds?.length],
    queryFn: async () => {
      const metadata = await Promise.all(photoIds?.map(getMetadata));

      return metadata;
    },
    enabled: photoIds?.length > 0,
  });

  const isLoading = idsLoading || photosLoading || metadataLoading;
  const isError = idsError || photosError || metadataError;

  const listPhoto = useMemo(() => {
    return photos?.map((photo) => {
      const item = metadata?.find((meta) => meta.id == photo.id);

      return {
        id: photo.id,
        url: photo.url,
        metadata: item?.metadata,
      };
    });
  }, [metadata, photos]);

  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deletePhoto,
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { tags: string[]; updatedAt: string };
    }) => putMetadata(id, payload),
  });

  const photoDeletion = (id: string, callback: () => void) => {
    deleteMutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["get"] });
        toast.success("Photo deleted successfully");
        callback();
      },
      onError: (error) => {
        toast.error("Delete failed: " + error.message);
      },
    });
  };

  const updateMetadata = (
    id: string,
    payload: { tags: string[]; updatedAt: string },
    callback: () => void,
  ) => {
    updateMutate(
      { id, payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get"] });
          toast.success("Metadata updated successfully");
          callback();
        },
        onError: (error) => {
          toast.error("Update failed: " + error.message);
        },
      },
    );
  };

  return {
    listPhoto,
    isLoading,
    isError,
    photoDeletion,
    updateMetadata,
  };
};
