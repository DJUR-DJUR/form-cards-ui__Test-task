import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { debounceTime, distinctUntilChanged, first, map, of, switchMap, tap } from "rxjs";
import { DataService } from "../../services/data.service";
import { USER_INPUT_DEBOUNCE } from "../constants/constants";

export const usernameAsyncValidator = (userService: DataService): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    const value = control.value;

    if (!value) {
      return of(null);
    }

    return of(value).pipe(
      debounceTime(USER_INPUT_DEBOUNCE),
      distinctUntilChanged(),
      switchMap(username => userService.checkUsername(username)),
      tap(() => control.markAsTouched()),
      map(res => (res.isAvailable ? null : { usernameTaken: true })),
      first()
    );
  };
}
