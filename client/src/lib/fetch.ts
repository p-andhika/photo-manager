// Fetch all photo IDs
export const getPhotoIds = async () => {
  const res = await fetch("http://localhost:3003/photos");
  if (!res.ok) throw new Error("Failed to fetch photo IDs");
  return res.json();
};

// Fetch photo by ID
export const getPhoto = async (id: string) => {
  const res = await fetch(`http://localhost:3003/photos/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch photo ${id}`);
  return { id, url: URL.createObjectURL(await res.blob()) };
};

// Fetch metadata by ID
export const getMetadata = async (id: string) => {
  const res = await fetch(`http://localhost:3003/metadata/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch metadata ${id}`);
  const metadata = await res.json();

  return { id, metadata };
};

// Update metadata
export const putMetadata = async (
  id: string,
  payload: { tags: string[]; updatedAt: string },
) => {
  const res = await fetch(`http://localhost:3003/metadata/${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({ metadata: payload }),
  });
  if (!res.ok) throw new Error("Failed to update metadata");
  return res.json();
};

// Delete photo
export const deletePhoto = async (id: string) => {
  const res = await fetch(`http://localhost:3003/photos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete photo");
  return res.json();
};

// Upload photo
export const postPhoto = async (payload: FormData) => {
  const res = await fetch("http://localhost:3003/photos", {
    method: "POST",
    body: payload,
  });
  if (!res.ok) throw new Error("Failed to upload photo");
  return res.json();
};
