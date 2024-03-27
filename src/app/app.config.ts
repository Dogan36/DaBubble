import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideClientHydration(), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"dabubble-9fc3f","appId":"1:417516174579:web:e3fefddc3232d2519d4b86","databaseURL":"https://dabubble-9fc3f-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"dabubble-9fc3f.appspot.com","apiKey":"AIzaSyD65N1jufoX_0t7XwM4NXR-pd2sxRfhs8k","authDomain":"dabubble-9fc3f.firebaseapp.com","messagingSenderId":"417516174579"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore())), 
    importProvidersFrom(provideDatabase(() => getDatabase())), provideAnimationsAsync(),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideStorage(() => getStorage())) ]
};
