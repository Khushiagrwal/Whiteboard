import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); // backend URL
  }

  // Send event
  emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }

  // Listen event
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }
}
