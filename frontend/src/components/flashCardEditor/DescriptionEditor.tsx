import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";
import { Button } from "../ui/button";
import { CheckIcon } from "@heroicons/react/24/outline";
import useTreeStore from "@/stores/useTreeStore";
import useSetService from "@/services/useSetService";

const DescriptionEditor: React.FC<EditorProps> = ({ dekuSetId }) => {
  const description = useTreeStore((state) =>
      state.dekuSets[dekuSetId].description
  );
  const [isDescEditable, setIsDescEditable] = useState(false);
  const { updateDekuSetDB } = useSetService();
  const updateSetState = useTreeStore((state) => state.updateSet);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isDescEditable && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 30}px`;
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [isDescEditable]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateSetState(dekuSetId, { description: e.target.value });
  };

  const handleSave = async () => {
    setIsDescEditable(false);
    await updateDekuSetDB(dekuSetId);
  };

  return (
    <>
      {isDescEditable ? (
        <div className="relative mx-8 mb-2 mt-1 flex flex-col items-end">
          <Textarea
            ref={textareaRef}
            className="resize-none overflow-hidden"
            style={{ overflowWrap: "anywhere" }}
            value={description ?? ""}
            onChange={(e) => {
              handleDescriptionChange(e);
              const textarea = e.target;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight + 30}px`;
            }}
            onBlur={handleSave}
            placeholder="Description (optional)"
            autoFocus
            maxLength={1024}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {description?.length ?? 0} / 1024
          </p>
          <Button
            className="absolute bottom-7 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-none rounded-tl-lg rounded-tr-lg bg-secondary p-0 text-secondary-foreground hover:bg-secondary/80"
            onClick={handleSave}
          >
            <CheckIcon className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <EditIcon>
          <div
            className="mx-4 cursor-text whitespace-pre-line text-wrap break-words p-4 hover:bg-muted"
            onClick={() => setIsDescEditable(true)}
          >
            {description== undefined || description.trim().length == 0 ? (
              <div className="ml-3 text-sm italic text-muted-foreground">
                {"Description.."}
              </div>
            ) : (
              <p className="pl-4 pr-7 text-sm">{description}</p>
            )}
          </div>
        </EditIcon>
      )}
    </>
  );
};

export default DescriptionEditor;
