import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { usePhoto } from "./usePhoto";
import { PhotoUploadDialog } from "@/components/ui/file-upload";
import { useState } from "react";
import { CircleX } from "lucide-react";
import { DeleteDialog } from "./components/delete-dialog";

export const Home = () => {
  const { listPhoto, isError } = usePhoto();
  const [isOpen, setDialog] = useState(false);
  const [isOpenDelete, setDeleteDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState({
    id: "",
    url: "",
  });

  if (isError) {
    return <div>Something went wrong...</div>;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold">Your Photos</h1>
        <Button onClick={() => setDialog(true)}>Upload</Button>
      </div>

      <hr className="my-8" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12 mt-12">
        {listPhoto?.map((photo, i) => (
          <div key={i} className="flex flex-col relative">
            <div
              className="absolute rounded-[50%] bg-black p-0 right-0 cursor-pointer"
              onClick={() => {
                setDeleteDialog(true);
                setSelectedPhoto({
                  id: photo.id,
                  url: photo.url,
                });
              }}
            >
              <CircleX color="white" />
            </div>

            <img
              src={photo.url}
              alt={`Photo ${photo.metadata?.updatedAt}`}
              className="w-full h-60 object-cover rounded-lg shadow cursor-pointer"
            />
            <span className="font-semibold text-base mt-2 cursor-pointer">
              Updated At: {photo.metadata?.updatedAt}
            </span>

            <div className="flex flex-row items-center mt-2">
              Tags:
              <div className="flex flex-row gap-1.5 ml-2">
                {photo.metadata?.tags.map((tag: string, i: number) => {
                  return <Badge key={i}>{tag}</Badge>;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PhotoUploadDialog isOpen={isOpen} setDialog={setDialog} />
      <DeleteDialog
        isOpen={isOpenDelete}
        setDialog={setDeleteDialog}
        photoId={selectedPhoto.id}
        url={selectedPhoto.url}
      />
    </>
  );
};
