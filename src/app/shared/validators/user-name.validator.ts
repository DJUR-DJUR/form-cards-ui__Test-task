import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { debounceTime, first, map, of, switchMap, tap } from "rxjs";
import { DataService } from "../../services/data.service";
import { USER_INPUT_DEBOUNCE } from "../constants/constants";

export const usernameAsyncValidator = (userService: DataService): AsyncValidatorFn => {
    return (control: AbstractControl) =>
        control.valueChanges.pipe(
            debounceTime(USER_INPUT_DEBOUNCE),
            switchMap(value => !value ? of(null) : userService.checkUsername(value)),
            map(res => res?.isAvailable ? null : { usernameTaken: true }),
            first()
        );
}
