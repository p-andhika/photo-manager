import { useQuery } from "@tanstack/react-query";

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
  return { id, metadata: await res.json() };
};

export const usePhoto = () => {
  const {
    data: photoIds,
    isFetching: idsLoading,
    error: idsError,
  } = useQuery({ queryKey: ["photoIds"], queryFn: fetchPhotoIds });

  const {
    data: photos,
    isFetching: photosLoading,
    error: photosError,
  } = useQuery({
    queryKey: ["photos"],
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
    queryKey: ["metadatas"],
    queryFn: async () => {
      const photoBlobs = await Promise.all(photoIds?.map(fetchMetadata));
      return photoBlobs;
    },
    enabled: photoIds?.length > 0,
  });

  const isLoading = idsLoading || photosLoading || metadataLoading;
  const isError = idsError || photosError || metadataError;

  const listPhoto = photos?.map((photo) => {
    const item = metadata?.find((meta) => meta.id == photo.id);

    return {
      id: photo.id,
      url: photo.url,
      metadata: item?.metadata,
    };
  });

  return {
    listPhoto,
    isLoading,
    isError,
  };
};
