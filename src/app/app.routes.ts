import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DocsComponent } from './docs/docs.component';

export const routes: Routes = [
    { path: '',title: 'fancy homepage', component: HomepageComponent},
    { path: 'docs',title: 'docs page', component: DocsComponent}
];
