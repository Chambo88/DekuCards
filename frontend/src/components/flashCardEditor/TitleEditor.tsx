import React, { useState } from "react";
import { Input } from "../ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";

const TitleEditor: React.FC<EditorProps> = ({ cardSet, setCardSet }) => {
  const [isTitleEditable, setIsTitleEditable] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardSet({ ...cardSet, title: e.target.value });
  };

  return isTitleEditable ? (
    <div className="mx-8 mt-11">
      <Input
        className="mb-2 px-4 text-xl font-bold"
        value={cardSet.title}
        onChange={handleTitleChange}
        onBlur={() => setIsTitleEditable(false)}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsTitleEditable(false);
          }
        }}
        autoFocus
      />
    </div>
  ) : (
    <div className="mt-8">
      <EditIcon>
        <DialogTitle
          onClick={() => setIsTitleEditable(true)}
          className="mx-5 cursor-text p-4 text-xl font-bold hover:bg-muted"
        >
          {cardSet.title || "Untitled"}
        </DialogTitle>
      </EditIcon>
    </div>
  );
};

export default TitleEditor;
