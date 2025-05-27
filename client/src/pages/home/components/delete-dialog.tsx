import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePhoto } from "../usePhoto";

type Props = {
  isOpen: boolean;
  setDialog: (value: boolean) => void;
  photoId: string;
  url: string;
};

export const DeleteDialog = ({ isOpen, setDialog, photoId, url }: Props) => {
  const { photoDeletion } = usePhoto();

  return (
    <Dialog open={isOpen} onOpenChange={() => setDialog(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Photo</DialogTitle>
          <DialogDescription>Are you sure delete this photo?</DialogDescription>
        </DialogHeader>

        <div>
          <img
            src={url}
            className="w-full h-60 object-cover rounded-lg shadow cursor-pointer"
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              photoDeletion(photoId, () => setDialog(false));
            }}
          >
            Yes, delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
