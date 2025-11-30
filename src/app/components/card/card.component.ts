import {
    ChangeDetectionStrategy,
    Component, computed, DestroyRef, inject,
    input, OnInit,
    output, signal,
} from '@angular/core'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatTooltip } from '@angular/material/tooltip'
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { ValidationMessageDirective } from "../../shared/directives/validation-message.directive";
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from "@angular/material/autocomplete";
import { Country } from "../../shared/enum/country";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormCardGroup } from "../../shared/interface/interfaces";
import { debounceTime } from "rxjs";
import { HINT_SHOW_DELAY, MAX_BIRTH_DATE, MIN_BIRTH_DATE, USER_INPUT_DEBOUNCE } from "../../shared/constants/constants";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
    selector: 'app-card',
    imports: [
        MatCard,
        MatCardContent,
        MatInput,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatOption,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIcon,
        ReactiveFormsModule,
        MatIconButton,
        MatTooltip,
        ValidationMessageDirective,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #countries = Object.values(Country);

    form = input.required<FormCardGroup>();

    remove = output<FormCardGroup>();

    protected filteredCountries = signal<string[]>(this.#countries);
    protected readonly countryControl = computed(() => this.form().controls.country);
    protected readonly usernameControl = computed(() => this.form().controls.username);
    protected readonly birthdayControl = computed(() => this.form().controls.birthday);

    protected readonly MAX_BIRTH_DATE = MAX_BIRTH_DATE;
    protected readonly MIN_BIRTH_DATE = MIN_BIRTH_DATE;
    protected readonly HINT_SHOW_DELAY = HINT_SHOW_DELAY;

    ngOnInit(): void {
        this.initCountryFilter();
    }

    private initCountryFilter(): void {
        this.countryControl()?.valueChanges
            .pipe(
                debounceTime(USER_INPUT_DEBOUNCE),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(value => this.filterCountries(value));
    }

    private filterCountries(value: string | null): void {
        const filter = (value || '').toLowerCase();
        this.filteredCountries.set(
            this.#countries.filter(c => c.toLowerCase().includes(filter))
        );
    }
}
