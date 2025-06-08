export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const calcLevel = (correct: number, wrong: number) => {
  let level;

  if (wrong === 0) {
    level = Math.min(correct, 4);
  } else {
    level = Math.min(Math.floor(correct / wrong), 4);
  }

  level = Math.max(0, level);
  return level;
};
