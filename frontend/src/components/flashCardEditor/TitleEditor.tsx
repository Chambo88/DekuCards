import React, { useState } from "react";
import { Input } from "../ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";
import { Button } from "../ui/button";
import { CheckIcon } from "@heroicons/react/24/outline";
import useTreeStore from "@/stores/useTreeStore";
import useSetService from "@/services/useSetService";

const TitleEditor: React.FC<EditorProps> = ({ dekuSetId }) => {
  const title = useTreeStore((state) =>
      state.dekuSets[dekuSetId].title
  );
  const updateSetState = useTreeStore((state) => state.updateSet);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const { updateDekuSetDB } = useSetService();

  //TODO Add validation for when saving
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSetState(dekuSetId, { title: e.target.value });
  };

  const handleSave = async () => {
    setIsTitleEditable(false);
    await updateDekuSetDB(dekuSetId);
  }

  return isTitleEditable ? (
    <div className="relative mx-8 mt-11">
      <Input
        className="mb-2 px-4 text-xl font-bold"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleSave}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Tab") {
            handleSave()
          }
        }}
        maxLength={128}
        autoFocus
      />
      <Button
        className="absolute bottom-2 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-none rounded-tl-lg rounded-tr-lg bg-secondary p-0 text-secondary-foreground hover:bg-secondary/80"
        onClick={handleSave}
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
          {title || "Untitled"}
        </DialogTitle>
      </EditIcon>
    </div>
  );
};

export default TitleEditor;
