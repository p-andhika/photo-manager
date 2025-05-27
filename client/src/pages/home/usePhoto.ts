import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

// Fetch all photo IDs
const fetchPhotoIds = async () => {
  const res = await fetch("http://localhost:3003/photos");
  if (!res.ok) throw new Error("Failed to fetch photo IDs");
  return res.json();
};

// Fetch photo by ID
const fetchPhoto = async (id: string) => {
  const res = await fetch(`http://localhost:3003/photos/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch photo ${id}`);
  return { id, url: URL.createObjectURL(await res.blob()) };
};

// Fetch metadata by ID
const fetchMetadata = async (id: string) => {
  const res = await fetch(`http://localhost:3003/metadata/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch metadata ${id}`);
  const metadata = await res.json();

  return { id, metadata };
};

// Delete photo
const photoDeletion = async (id: string) => {
  const res = await fetch(`http://localhost:3003/photos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete photo");
  return res.json();
};

export const usePhoto = () => {
  const {
    data: photoIds,
    isFetching: idsLoading,
    error: idsError,
  } = useQuery({ queryKey: ["get", "photoIds"], queryFn: fetchPhotoIds });

  const {
    data: photos,
    isFetching: photosLoading,
    error: photosError,
  } = useQuery({
    queryKey: ["get", "photos", photoIds?.length],
    queryFn: async () => {
      const photoBlobs = await Promise.all(photoIds?.map(fetchPhoto));

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
      const metadata = await Promise.all(photoIds?.map(fetchMetadata));

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

  const { mutate, isPending } = useMutation({
    mutationFn: photoDeletion,
  });

  const queryClient = useQueryClient();

  const deletePhoto = (id: string, callback: () => void) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get"],
        });

        toast.success("Photo deleted successfully");
        callback();
      },
      onError: (error) => {
        toast.error("Delete failed: " + error.message);
      },
    });
  };

  return {
    listPhoto,
    isLoading,
    isError,
    deletePhoto,
    isMutating: isPending,
  };
};
