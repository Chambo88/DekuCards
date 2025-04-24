import React, { useState } from "react";
import { Input } from "../ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";
import { Button } from "../ui/button";
import { CheckIcon } from "@heroicons/react/24/outline";
import useTreeStore from "@/stores/useTreeStore";

const TitleEditor: React.FC<EditorProps> = ({ dekuSetId }) => {
  const dekuSet = useTreeStore((state) =>
      state.dekuSets[dekuSetId]
  );
  const [isTitleEditable, setIsTitleEditable] = useState(false);

  //TODO Add validation for when saving

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setCardSet({ ...cardSet, title: e.target.value });

  };

  return isTitleEditable ? (
    <div className="relative mx-8 mt-11">
      <Input
        className="mb-2 px-4 text-xl font-bold"
        value={dekuSet.title}
        onChange={handleTitleChange}
        onBlur={() => setIsTitleEditable(false)}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsTitleEditable(false);
          }
        }}
        maxLength={128}
        autoFocus
      />
      <Button
        className="absolute bottom-2 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-none rounded-tl-lg rounded-tr-lg bg-secondary p-0 text-secondary-foreground hover:bg-secondary/80"
        onClick={() => setIsTitleEditable(false)}
      >
        <CheckIcon className="h-5 w-5" />
      </Button>
    </div>
  ) : (
    <div className="mt-8">
      <EditIcon>
        <DialogTitle
          onClick={() => setIsTitleEditable(true)}
          className="mx-5 cursor-text p-4 text-xl font-bold hover:bg-muted"
        >
          {dekuSet.title || "Untitled"}
        </DialogTitle>
      </EditIcon>
    </div>
  );
};

export default TitleEditor;
