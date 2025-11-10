import { FormControl, FormGroup } from "@angular/forms";
import { Country } from "../enum/country";

export interface FormCardControls {
    country: FormControl<Country | null>;
    username: FormControl<string | null>;
    birthday: FormControl<Date | null>;
}

export type FormCardGroup = FormGroup<FormCardControls>;

export interface SubmitFormData {
    country: Country | null;
    username: string | null;
    birthday: Date | null;
}
