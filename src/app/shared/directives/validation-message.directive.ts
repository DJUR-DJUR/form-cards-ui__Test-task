import { Directive, ElementRef, OnInit, Renderer2, inject, DestroyRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, merge } from "rxjs";

@Directive({
  selector: '[appValidationMessage]',
  standalone: true,
})
export class ValidationMessageDirective implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) fieldName!: string;

  private errorElement!: HTMLDivElement;

  ngOnInit(): void {
    this.setupErrorElement();
    this.setupSubscriptions();
    this.updateError();
  }

  private setupErrorElement(): void {
    this.errorElement = this.#renderer.createElement('div');
    this.#renderer.setStyle(this.errorElement, 'color', 'red');
    this.#renderer.setStyle(this.errorElement, 'font-size', '12px');
    this.#renderer.setStyle(this.errorElement, 'position', 'absolute');
    this.#renderer.setStyle(this.errorElement, 'left', '0');
    this.#renderer.setStyle(this.errorElement, 'bottom', '-4px');
    this.#renderer.setStyle(this.errorElement, 'pointer-events', 'none');
    this.#renderer.setStyle(this.#elementRef.nativeElement, 'position', 'relative');
    this.#renderer.appendChild(this.#elementRef.nativeElement, this.errorElement);
  }

  private setupSubscriptions(): void {
    const blur$ = fromEvent(this.#elementRef.nativeElement, 'focusout');

    merge(this.control.statusChanges, blur$)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.updateError());
  }

  private updateError(): void {
    if (this.control.invalid && (this.control.dirty || this.control.touched)) {
      this.#renderer.setProperty(
        this.errorElement,
        'innerText',
        `Please provide a correct ${ this.fieldName }`
      );
    } else {
      this.#renderer.setProperty(
        this.errorElement,
        'innerText',
        ''
      );
    }
  }
}
