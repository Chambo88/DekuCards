import React, { useState } from "react";
import { PrerequisitesForm } from "./PrerequisitesForm";
import { Prerequisite } from "@/models/models";
import { EditorProps } from "./FlashCardDialog";
import EditIcon from "../common/EditIcon";

const PrerequisiteEditor: React.FC<EditorProps> = ({ cardSet, setCardSet }) => {
  const [isPrerequisitesEditable, setIsPrerequisitesEditable] = useState(false);
  //TODO Make prereq hyperlinks clickable

  const handleSave = (data: Prerequisite[]) => {
    setCardSet({ ...cardSet, prerequisites: data });
    setIsPrerequisitesEditable(false);
  };

  const handleCancel = () => {
    setIsPrerequisitesEditable(false);
  };

  return (
    <>
      {isPrerequisitesEditable ? (
        <div className="mx-5 mb-4 p-4">
          <h3 className="font-semibold">Prerequisites</h3>
          <PrerequisitesForm
            initialData={cardSet.prerequisites}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>
      ) : (
        <EditIcon>
          <div
            className="mx-5 mb-4 cursor-text p-4 hover:bg-muted"
            onClick={() => setIsPrerequisitesEditable(true)}
          >
            <h3 className="mb-4 font-semibold">Prerequisites</h3>
            {cardSet.prerequisites.length == 0 ? (
              <div className="ml-3 text-sm italic text-muted-foreground">
                {"None"}
              </div>
            ) : (
              <></>
            )}
            <ul className="ml-3 list-disc pl-5">
              {cardSet.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm">
                  {prereq.name}
                </li>
              ))}
            </ul>
          </div>
        </EditIcon>
      )}
    </>
  );
};

export default PrerequisiteEditor;
