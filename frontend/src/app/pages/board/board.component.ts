import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component'; // Ensure this path is correct
import { ChatComponent } from '../chat/chat.component'; // Adjusted the path to the correct location
import { VideoCallComponent } from "../call/call.component";

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  imports: [CommonModule, CanvasComponent, ChatComponent, VideoCallComponent]
})
export class BoardComponent {
  boardId: string | null = null;
  mode: string | null = null;

  constructor(private route: ActivatedRoute) {
    // Get board id
    this.boardId = this.route.snapshot.paramMap.get('id');

    // Get mode (?mode=xxxx)
    this.mode = this.route.snapshot.queryParamMap.get('mode');
  }
}
