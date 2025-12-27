import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
//   styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  message = "";
  messages: string[] = [];

  constructor(private socketService: SocketService) {
    // 🔥 Listen for incoming chat messages
    this.socketService.on("chatMessage", (msg: string) => {
      this.messages.push(msg);
    });
  }

  sendMessage() {
    if (!this.message.trim()) return;

    // Add to UI
    this.messages.push("You: " + this.message);

    // Broadcast to others
    this.socketService.emit("chatMessage", this.message);

    // Clear input
    this.message = "";
  }
}
