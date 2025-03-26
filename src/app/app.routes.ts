import { Routes } from '@angular/router';
import { HomepageComponent } from './shared/homepage/homepage.component';
import { DocsComponent } from './public/docs/docs.component';
import { LoginComponent } from './public/login/login.component';
import { FeaturesComponent } from './public/features/features.component';
import { AboutComponent } from './public/about/about.component';
import { SignupComponent } from './public/signup/signup.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DesignComponent } from './private/design/design.component';
import {authGuard} from "./shared/auth.guard";
import {SettingsComponent} from "./private/settings/settings.component";
import {ActionConfigComponent} from "./private/action-config/action-config.component";

export const LocalKeys = {
    AUTH_TOKEN: 'authToken',
    LOGGED_USER: 'loggedUser',
    RULE_INPUT: 'ruleInput',
    RULE_OUTPUT: 'ruleOutput',
    RULES: 'rules',
    RULE_INPUT_FORM_DATA: 'ruleInputFormData',
    RULE_OUTPUT_FORM_DATA: 'ruleOutputFormData'
}

export const AppPaths = {
    LOGIN: 'login',
    SETTINGS: 'settings',
    SIGNUP: 'signup',
    DOCS: 'docs',
    FEATURES: 'features',
    ABOUT:'about',
    ROOT: '',
    DASHBOARD: 'dashboard',
    ACTION_CONFIG: 'configAction',
    DESIGN_BOARD: 'design'
}

export const routes: Routes = [
    { path: AppPaths.ROOT,title: 'fancy homepage', component: HomepageComponent},
    { path: AppPaths.DASHBOARD,title: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    { path: AppPaths.DOCS, title: 'docs page', component: DocsComponent},
    { path: AppPaths.ABOUT, title: 'about page', component: AboutComponent},
    { path: AppPaths.FEATURES, title: 'features page', component: FeaturesComponent},
    { path: AppPaths.LOGIN, title: 'login page', component: LoginComponent},
    { path: AppPaths.SIGNUP, title: 'signup page', component: SignupComponent},
    { path: AppPaths.DESIGN_BOARD, title: 'design page', component: DesignComponent , canActivate: [authGuard]},
    { path: AppPaths.SETTINGS, title: 'settings page', component: SettingsComponent , canActivate: [authGuard]},
    { path: AppPaths.ACTION_CONFIG, title: 'action config page', component: ActionConfigComponent , canActivate: [authGuard]}
];
