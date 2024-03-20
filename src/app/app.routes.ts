import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
    { path: '', component: MainPageComponent, data: { title: 'Da Bubble | Home' } },
    { path: 'login', component: LoginPageComponent, data: { title: 'Da Bubble | Login' } },
    { path: 'imprint', component: ImprintComponent, data: { title: 'Da Bubble | Imprint' } },
    { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { title: 'Da Bubble | Privacy Policy' } },
    ];
