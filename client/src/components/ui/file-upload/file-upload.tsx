import { AlertCircle, CloudUpload, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "../button";
import { Alert, AlertDescription } from "../alert";
import { Spinner } from "../spinner";
import { useFileUpload } from "./useFileUpload";
import { useUpload } from "./useUpload";
import { formatDateToMMDDYYYY } from "@/lib/utils";

type Props = {
  onOpenChange: (value: boolean) => void;
};

export const FileUpload = ({ onOpenChange }: Props) => {
  const maxSizeMB = 2;
  const maxSize = maxSizeMB * 1024 * 1024; // 2MB default

  const [error, setError] = useState<string>("");

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
  });

  const { uploadPhoto, isMutating } = useUpload();

  const handleUploadFile = () => {
    setError("");

    const formData = new FormData();
    formData.append("photo", files[0].file as File);
    formData.append(
      "metadata",
      JSON.stringify({
        tags: ["test"],
        updatedAt: formatDateToMMDDYYYY(new Date()),
      }),
    );

    uploadPhoto(formData, () => onOpenChange(false));
  };

  const previewUrl = files[0]?.preview || null;
  // const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
          />

          {previewUrl && !isMutating && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || "Uploaded image"}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          )}

          {!previewUrl && !isMutating && (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="mb-2 flex size-11 shrink-0 items-center justify-center bg-background"
                aria-hidden="true"
              >
                <CloudUpload className="size-14 opacity-60" />
              </div>
              <p className="mb-1.5 text-base">
                Drag here or{" "}
                <strong
                  onClick={openFileDialog}
                  className="cursor-pointer text-blue-500 underline"
                >
                  photo
                </strong>{" "}
                to upload
              </p>
            </div>
          )}

          {isMutating && (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="mb-2 flex size-11 shrink-0 items-center justify-center bg-background"
                aria-hidden="true"
              >
                <Spinner message={<strong>Uploading...</strong>} />
              </div>
              <p className="mb-1.5 text-base">
                Do not close this browser while uploading the document
              </p>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute right-4 top-4">
            <button
              type="button"
              className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>Upload failed</AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full"
        onClick={handleUploadFile}
        disabled={isMutating || files.length == 0}
      >
        Upload
      </Button>
    </div>
  );
};
