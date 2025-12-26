import { Routes } from '@angular/router';
import { ShareBoardComponent } from './pages/shareBoard/shareBoard.component';
import { BoardComponent } from './pages/board/board.component';

export const routes: Routes = [
  { path: '', redirectTo: 'share', pathMatch: 'full' },  // default route
  { path: 'share', component: ShareBoardComponent },
  { path: 'board/:id', component: BoardComponent }, // dynamic board page
];
