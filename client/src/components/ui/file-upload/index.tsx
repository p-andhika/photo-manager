import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { FileUpload } from "./file-upload";

type Props = {
  isOpen: boolean;
  setDialog: (value: boolean) => void;
};

export const PhotoUploadDialog = ({ isOpen, setDialog }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => setDialog(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>
        <FileUpload onOpenChange={setDialog} />
      </DialogContent>
    </Dialog>
  );
};
