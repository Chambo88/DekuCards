import { FlashCard } from "@/models/models";

// Anki Constants
export const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const EASE_FACTOR_INCREMENT = 0.1;
const EASE_FACTOR_DECREMENT = 0.2;

const LEARNING_STEPS_MINUTES = [30];
const GRADUATING_INTERVAL_DAYS = 1;

const LAPSE_INTERVAL_MINUTES = 60;

// Health Calculation
const HEALTH_MAX = 5;
const HEALTH_MIN = 1;
const MAX_EASE_FACTOR = 3.05;
const STREAK_HEALTH_BONUS_FACTOR = 0.1;
const MAX_STREAK_HEALTH_BONUS_COUNT = 2;

const calculateNextAvailableDate = (
  now: Date,
  interval: number,
  unit: "minutes" | "days",
): Date => {
  const ms =
    unit === "minutes" ? interval * 60 * 1000 : interval * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + ms);
};

export const updateFlashCardOnCorrect = (flashCard: FlashCard): FlashCard => {
  const now = new Date();
  let newEaseFactor = flashCard.ease_factor;
  let newConsecutiveCorrectStreak = flashCard.times_correct + 1;
  let newLearningStepIndex = flashCard.learning_step_index;
  let newIsGraduated = flashCard.is_graduated;
  let nextAvailableDate: Date;
  let newCurrentIntervalDays: number;
  let newHealth: number;

  if (!newIsGraduated) {
    newLearningStepIndex++;

    if (newLearningStepIndex < LEARNING_STEPS_MINUTES.length) {
      newCurrentIntervalDays = 0;
      nextAvailableDate = calculateNextAvailableDate(
        now,
        LEARNING_STEPS_MINUTES[newLearningStepIndex],
        "minutes",
      );
      newHealth = Math.round(
        HEALTH_MIN +
          (newLearningStepIndex / LEARNING_STEPS_MINUTES.length) *
            (HEALTH_MAX - HEALTH_MIN - 2),
      );
    } else {
      // Graduation essentially just means past some set preliminary phase, a buffer to not effect EF to much
      newIsGraduated = true;
      newLearningStepIndex = LEARNING_STEPS_MINUTES.length;
      newCurrentIntervalDays = GRADUATING_INTERVAL_DAYS;
      nextAvailableDate = calculateNextAvailableDate(
        now,
        newCurrentIntervalDays,
        "days",
      );

      const easeFactorNormalizedOnGraduation =
        (newEaseFactor - MIN_EASE_FACTOR) / (MAX_EASE_FACTOR - MIN_EASE_FACTOR);
      let healthBasedOnEF =
        HEALTH_MIN +
        easeFactorNormalizedOnGraduation * (HEALTH_MAX - HEALTH_MIN);
      newHealth = Math.round(healthBasedOnEF);
    }
  } else {
    // Card is already graduated and in spaced review
    newEaseFactor = Math.min(
      flashCard.ease_factor + EASE_FACTOR_INCREMENT,
      3.0,
    );

    let nextIntervalDays: number;

    if (flashCard.times_correct === 0) {
      nextIntervalDays = GRADUATING_INTERVAL_DAYS;
    } else if (flashCard.times_correct === 1) {
      nextIntervalDays = 6;
    } else {
      nextIntervalDays = flashCard.current_interval_days * newEaseFactor;
    }

    newCurrentIntervalDays = Math.max(1, Math.round(nextIntervalDays));
    nextAvailableDate = calculateNextAvailableDate(
      now,
      newCurrentIntervalDays,
      "days",
    );

    const easeFactorNormalized =
      (newEaseFactor - MIN_EASE_FACTOR) / (MAX_EASE_FACTOR - MIN_EASE_FACTOR);
    let baseHealthFromEase =
      HEALTH_MIN + easeFactorNormalized * (HEALTH_MAX - HEALTH_MIN);

    const streakBonus =
      Math.min(newConsecutiveCorrectStreak, MAX_STREAK_HEALTH_BONUS_COUNT) *
      STREAK_HEALTH_BONUS_FACTOR;

    newHealth = Math.round(baseHealthFromEase + streakBonus);
  }

  newHealth = Math.min(HEALTH_MAX, Math.max(HEALTH_MIN, newHealth));

  return {
    ...flashCard,
    ease_factor: newEaseFactor,
    times_correct: newConsecutiveCorrectStreak,
    learning_step_index: newLearningStepIndex,
    is_graduated: newIsGraduated,
    current_interval_days: newCurrentIntervalDays,
    health: newHealth,
    last_shown_at_date: now,
    available_date: nextAvailableDate,
    streak_start_date: flashCard.streak_start_date || now,
  };
};

export const updateFlashCardOnIncorrect = (flashCard: FlashCard): FlashCard => {
  const now = new Date();

  let newEaseFactor = Math.max(
    flashCard.ease_factor - EASE_FACTOR_DECREMENT,
    MIN_EASE_FACTOR,
  );
  const newConsecutiveCorrectStreak = 0;
  let newLearningStepIndex = 0;

  const newCurrentIntervalDays = 0;

  const nextAvailableDate = calculateNextAvailableDate(
    now,
    LAPSE_INTERVAL_MINUTES,
    "minutes",
  );

  const newHealth = HEALTH_MIN;

  return {
    ...flashCard,
    ease_factor: newEaseFactor,
    times_correct: newConsecutiveCorrectStreak,
    learning_step_index: newLearningStepIndex,
    current_interval_days: newCurrentIntervalDays,
    health: newHealth,
    last_shown_at_date: now,
    available_date: nextAvailableDate,
    streak_start_date: null,
  };
};
