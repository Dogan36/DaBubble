import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
    { path: 'home', component: MainPageComponent, data: { title: 'Da Bubble | Home' } },
    { path: '', component: StartingPageComponent, data: { title: 'Da Bubble | Start' } },
    { path: 'imprint', component: ImprintComponent, data: { title: 'Da Bubble | Imprint' } },
    { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { title: 'Da Bubble | Privacy Policy' } },
    { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Da Bubble | Reset Password' } }
];
