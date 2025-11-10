import {AbstractControl, ValidationErrors} from "@angular/forms";
import {Country} from "../enum/country";

export const countryValidator = (control: AbstractControl): ValidationErrors | null => {
  const countries = Object.values(Country);

  return countries.includes(control.value) ? null : { invalidCountry: true };
}
