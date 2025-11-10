import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAX_BIRTH_DATE, MIN_BIRTH_DATE } from "../constants/constants";

export const birthdayValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  if (value < MIN_BIRTH_DATE || value > MAX_BIRTH_DATE) {
    return { birthdayOutOfRange: true };
  }

  return null;
};
