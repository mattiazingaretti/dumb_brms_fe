import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DocsComponent } from './docs/docs.component';
import { LoginComponent } from './login/login.component';
import { FeaturesComponent } from './features/features.component';
import { AboutComponent } from './about/about.component';



export const AppPaths = {
    JOIN: 'login',
    DOCS: 'docs',
    FEATURES: 'features',
    ABOUT:'about',
    ROOT: ''
}

export const routes: Routes = [
    { path: AppPaths.ROOT,title: 'fancy homepage', component: HomepageComponent},
    { path: AppPaths.DOCS, title: 'docs page', component: DocsComponent},
    { path: AppPaths.ABOUT, title: 'about page', component: AboutComponent},
    { path: AppPaths.FEATURES, title: 'features page', component: FeaturesComponent},
    { path: AppPaths.JOIN, title: 'signup-login page', component: LoginComponent}
    
];
