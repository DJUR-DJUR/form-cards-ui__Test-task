import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { MatCard, MatCardHeader } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { NgTemplateOutlet } from "@angular/common";
import { DataService } from "../../services/data.service";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormCardControls, FormCardGroup, SubmitFormData } from "../../shared/interface/interfaces";
import { countryValidator } from "../../shared/validators/country.validator";
import { usernameAsyncValidator } from "../../shared/validators/user-name.validator";
import { birthdayValidator } from "../../shared/validators/birthday.validator";
import {
    HINT_SHOW_DELAY,
    MAX_FORMS_COUNT,
    TIMER_DURATION_SEC,
    TIMER_INTERVAL_MS
} from "../../shared/constants/constants";
import { MatButton } from "@angular/material/button";
import { catchError, finalize, of, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-multi-card',
    imports: [
        CardComponent,
        MatCard,
        MatIcon,
        MatTooltip,
        NgTemplateOutlet,
        MatCardHeader,
        MatButton,
    ],
    templateUrl: './multi-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiCardComponent implements OnInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #dataService = inject(DataService);

    protected readonly formsArray = new FormArray<FormCardGroup>([]);

    protected readonly isSubmitting = signal(false);
    protected readonly formattedTimer = computed(() => {
        const totalSec = this.timerSec();
        const minutes = Math.floor(totalSec / 60);
        const seconds = totalSec % 60;
        const secStr = seconds < 10 ? `0${seconds}` : seconds.toString();
        return `${minutes}:${secStr}`;
    });

    protected readonly HINT_SHOW_DELAY = HINT_SHOW_DELAY;
    protected readonly MAX_FORMS_COUNT = MAX_FORMS_COUNT;

    private intervalId?: ReturnType<typeof setInterval>;
    private readonly timerSec = signal(0);

    ngOnInit(): void {
        this.addForm();
    }

    get invalidCount(): number {
        return this.formsArray.controls.filter(f =>
            Object.values(f.controls).some(c => c.invalid && c.touched)
        ).length;
    }

    addForm(): void {
        if (this.isSubmitting()) {
            return;
        }

        this.formsArray.push(this.createForm());
    }

    removeForm(index: number): void {
        this.formsArray.removeAt(index);
    }

    submitAll(): void {
        if (this.formsArray.invalid) {
            this.formsArray.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.formsArray.disable();
        this.startTimer();
    }

    cancelSubmit(): void {
        this.stopTimer();
        this.isSubmitting.set(false);
        this.formsArray.enable();
    }

    private createForm(): FormCardGroup {
        return new FormGroup<FormCardControls>({
            country: new FormControl(null, {
                validators: [Validators.required, countryValidator],
            }),
            username: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [usernameAsyncValidator(this.#dataService)],
            }),
            birthday: new FormControl(null, {
                validators: [Validators.required, birthdayValidator],
            }),
        });
    }

    private startTimer(): void {
        if (this.intervalId) {
            return;
        }

        this.timerSec.set(TIMER_DURATION_SEC);

        this.intervalId = setInterval(() => {
            this.timerSec.set(this.timerSec() - 1);

            if (this.timerSec() === 0) {
                this.finishSubmit();
            }
        }, TIMER_INTERVAL_MS);
    }

    private stopTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
            this.timerSec.set(0);
        }
    }

    private finishSubmit(): void {
        this.stopTimer();
        const data: SubmitFormData[] = this.formsArray.getRawValue();

        this.#dataService.submitForm(data)
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                tap(() => this.resetForms()),
                catchError((error: unknown) => {
                    console.error('Error submitting the form', error);
                    return of(null);
                }),
                finalize(() => {
                    this.isSubmitting.set(false);
                    this.formsArray.enable();
                })
            )
            .subscribe();
    }

    private resetForms(): void {
        this.formsArray.controls.forEach(f => f.reset());
        this.formsArray.markAsUntouched();
        this.formsArray.markAsPristine();
    }
}
