import { LayoutModule } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent, SidebarComponent } from '@layout';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        LayoutModule,
        ReactiveFormsModule,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
    ],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
