import { Component } from '@angular/core';
import { MultiCardComponent } from "./components/multi-card/multi-card.component";

@Component({
    selector: 'app-root',
    imports: [MultiCardComponent],
    templateUrl: './app.html',
})
export class App {}

