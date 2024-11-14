import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface CancelConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  desc: string;
  destructive?: boolean;
  primaryText?: string;
  secondaryText?: string;
  confirm: () => void;
}

const CancelConfirmDialog: React.FC<CancelConfirmDialogProps> = ({
  title,
  desc,
  primaryText = "Confirm",
  secondaryText = "Cancel",
  destructive = false,
  children,
  confirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    confirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="flex flex-col bg-background">
        <DialogHeader>
          <div className="m-4 text-lg font-bold">{title}</div>
        </DialogHeader>
        <p className="mx-4 mb-4">{desc}</p>

        <DialogFooter className="bg-background p-4 shadow-lg">
          <Button
            onClick={handleConfirm}
            className="min-w-20"
            variant={destructive ? "destructive" : "default"}
          >
            {primaryText}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
            className="ml-2 min-w-20"
          >
            {secondaryText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmDialog;
