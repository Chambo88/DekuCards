export const MAX_FLASHCARD_CHAR = 1000;
export const MAX_FLASHCARD_IN_NODE = 255;
export const MAX_JSON_CHAR =
  (MAX_FLASHCARD_CHAR * 2 + 16) * MAX_FLASHCARD_IN_NODE;
export const AI_PROMPT = `Please turn the content following CONTENT into a set of flash cards. Return the result in the format [
  {
    "front": "Question 1",
    "back": "Answer 1"
  },
  {
    "front": "Question 2",
    "back": "Answer 2"
  },
  ...
]. I want you to aim for approximately NUM_OF_CARDS.
No Front or back may exceed ${MAX_FLASHCARD_CHAR} characters.
The total characters must not exceed ${MAX_JSON_CHAR}.

(change as needed)
NUM_OF_CARDS: 10 
CONTENT:
`;
export const JSON_HINT_FORMAT = `Make sure to correctly format JSON as below. 
(Tabs, Spaces, new lines are all irrelevant. The max character limit for the questions and answers is ${MAX_FLASHCARD_CHAR})
[
  {
    "front": "REPLACE_WITH_QUESTION", 
    "back": "REPLACE_WITH_ANSWER"
  },
  {
    "front": "REPLACE_WITH_QUESTION_2",
    "back": "REPLACE_WITH_ANSWER_2"
  },
  ...
]`;
