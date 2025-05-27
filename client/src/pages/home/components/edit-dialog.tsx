import { useEffect, useId, useState } from "react";
import { format } from "date-fns";
import { type Tag, TagInput } from "emblor";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePhoto } from "../usePhoto";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  setDialog: (value: boolean) => void;
  photoId: string;
  url: string;
  metadata: { tags: string[]; updatedAt: string };
};

export const EditDialog = ({
  isOpen,
  setDialog,
  photoId,
  url,
  metadata,
}: Props) => {
  const id = useId();
  const [date, setDate] = useState<Date>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const { updateMetadata } = usePhoto();

  useEffect(() => {}, []);

  return (
    <Dialog open={isOpen} onOpenChange={() => setDialog(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Photo</DialogTitle>
        </DialogHeader>

        <div>
          <img
            src={url}
            className="w-full h-60 object-cover rounded-lg shadow cursor-pointer"
          />

          <div className="flex flex-col gap-6 mt-5">
            <div className="flex flex-col gap-2">
              <Label className="mb-2">Updated At</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-red-400">
                Last Updated At: {metadata.updatedAt}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <Label className="mb-2" htmlFor={id}>
                  Tags
                </Label>
                <TagInput
                  id={id}
                  tags={tags}
                  setTags={(newTags) => {
                    setTags(newTags);
                  }}
                  placeholder="Add a tag"
                  styleClasses={{
                    inlineTagsContainer:
                      "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] p-1 gap-1",
                    input: "w-full min-w-[80px] shadow-none px-2 h-7",
                    tag: {
                      body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                      closeButton:
                        "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                    },
                  }}
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                />
              </div>
              <span className="text-sm text-red-400">
                Last Tags: {metadata.tags.join(", ")}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateMetadata(
                photoId,
                {
                  tags: tags.map((tag) => tag.text),
                  updatedAt: format(date as Date, "dd/MM/yyyy"),
                },
                () => setDialog(false),
              );
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
