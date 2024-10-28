import { Routes } from '@angular/router';
import { HomepageComponent } from './public/homepage/homepage.component';
import { DocsComponent } from './public/docs/docs.component';
import { LoginComponent } from './public/login/login.component';
import { FeaturesComponent } from './public/features/features.component';
import { AboutComponent } from './public/about/about.component';
import { SignupComponent } from './public/signup/signup.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DesignComponent } from './private/design/design.component';



export const AppPaths = {
    LOGIN: 'login',
    SIGNUP: 'signup',
    DOCS: 'docs',
    FEATURES: 'features',
    ABOUT:'about',
    ROOT: '',
    DASHBOARD: 'dashboard',
    DESIGN_BOARD: 'design'
}

export const routes: Routes = [
    { path: AppPaths.ROOT,title: 'fancy homepage', component: HomepageComponent},
    { path: AppPaths.DASHBOARD,title: 'dashboard', component: DashboardComponent},
    { path: AppPaths.DOCS, title: 'docs page', component: DocsComponent},
    { path: AppPaths.ABOUT, title: 'about page', component: AboutComponent},
    { path: AppPaths.FEATURES, title: 'features page', component: FeaturesComponent},
    { path: AppPaths.LOGIN, title: 'login page', component: LoginComponent},
    { path: AppPaths.SIGNUP, title: 'signup page', component: SignupComponent},
    { path: AppPaths.DESIGN_BOARD, title: 'design page', component: DesignComponent}

];
