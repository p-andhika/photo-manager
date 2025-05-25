import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { usePhoto } from "./usePhoto";

export const Home = () => {
  const { listPhoto, isError } = usePhoto();

  if (isError) {
    return <div>Something went wrong...</div>;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold">Your Photos</h1>
        <Button>Upload</Button>
      </div>

      <hr className="my-8" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12 mt-12">
        {listPhoto?.map((photo, i) => (
          <div key={i} className="flex flex-col">
            <img
              src={photo.url}
              alt={`Photo ${photo.metadata?.title}`}
              className="w-full h-60 object-cover rounded-lg shadow cursor-pointer"
            />
            <span className="font-semibold text-base mt-2 cursor-pointer">
              {photo.metadata?.title}
            </span>
            <div className="flex flex-row gap-1.5 mt-2">
              {photo.metadata?.tags.map((tag: string, i: number) => {
                return (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
