import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ShareBoardComponent } from './app/pages/shareBoard/shareBoard.component';
import { provideRouter, Routes } from '@angular/router';
import { routes } from './app/app.routes'; 
// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
