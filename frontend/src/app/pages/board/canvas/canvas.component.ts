import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../services/socket.service'; // make sure path is correct

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  drawing = false;

  constructor(private socketService: SocketService) {}

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    /** LOCAL DRAW EVENTS */
    canvas.addEventListener('mousedown', () => this.drawing = true);
    canvas.addEventListener('mouseup', () => this.drawing = false);
    canvas.addEventListener('mousemove', (event) => this.draw(event));

    /** RECEIVE BROADCASTED DRAW DATA */
    this.socketService.on('draw', (data: any) => {
      this.drawFromServer(data);
    });
  }

  /** SEND DRAWING DATA TO SOCKET */
  draw(event: MouseEvent) {
    if (!this.drawing) return;

    const x = event.offsetX;
    const y = event.offsetY;

    // Draw locally
    this.drawDot(x, y);

    // Broadcast to others
    this.socketService.emit('draw', { x, y });
  }

  /** DRAW FUNCTION USED BY BOTH */
  drawDot(x: number, y: number) {
    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /** WHEN DATA ARRIVES FROM OTHER USERS */
  drawFromServer(data: { x: number, y: number }) {
    this.drawDot(data.x, data.y);
  }
}
