import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";

interface CancelConfirmDialogProps {
  children?: React.ReactNode;
  title: string;
  desc: string;
  destructive?: boolean;
  primaryText?: string;
  secondaryText?: string;
  confirm: () => void;
}

interface CancelConfirmDialogContentProps extends CancelConfirmDialogProps {
  cancel: () => void;
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

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <CancelConfirmDialogContent
        title={title}
        desc={desc}
        primaryText={primaryText}
        secondaryText={secondaryText}
        destructive={destructive}
        confirm={handleConfirm}
        cancel={handleCancel}
      />
    </Dialog>
  );
};

export const CancelConfirmDialogContent: React.FC<
  CancelConfirmDialogContentProps
> = ({
  title,
  desc,
  primaryText = "Confirm",
  secondaryText = "Cancel",
  destructive = false,
  confirm,
  cancel,
}) => {
  return (
    <DialogContent className="flex flex-col bg-background">
      <DialogTitle>
        <div className="m-4 text-lg">{title}</div>
      </DialogTitle>
      <DialogDescription>
        <p className="mx-4 mb-4">{desc}</p>
      </DialogDescription>

      <DialogFooter className="bg-background p-4 shadow-lg">
        <Button
          onClick={confirm}
          className="min-w-20"
          variant={destructive ? "destructive" : "default"}
        >
          {primaryText}
        </Button>
        <Button variant="secondary" onClick={cancel} className="ml-2 min-w-20">
          {secondaryText}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CancelConfirmDialog;
