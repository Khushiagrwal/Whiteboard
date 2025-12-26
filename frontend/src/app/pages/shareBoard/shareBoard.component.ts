import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-board',
  templateUrl: './shareBoard.component.html',
  standalone:true,
  imports:[FormsModule,CommonModule]
})
export class ShareBoardComponent {
  mode = "canvas";
  shareLink = "";

  generateLink(){
    const boardId = Math.random().toString(36).substring(2,8);
    this.shareLink = `${window.location.origin}/board/${boardId}?mode=${this.mode}`;
  }
}
