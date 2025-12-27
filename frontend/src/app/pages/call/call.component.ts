import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-video-call',
  standalone: true,
  templateUrl: './call.component.html'
})
export class VideoCallComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  peerConnection!: RTCPeerConnection;
  localStream!: MediaStream;

  constructor(private socketService: SocketService) {
    // 📥 Listen for Offer from other user
    this.socketService.on("offer", async (offer) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socketService.emit("answer", answer);
    });

    // 📥 Listen for Answer
    this.socketService.on("answer", (answer) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // 📥 Listen for ICE Candidates
    this.socketService.on("ice-candidate", (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  async setupConnection() {
    this.peerConnection = new RTCPeerConnection();

    // Add ICE candidate event
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("ice-candidate", event.candidate);
      }
    };

    // Stream other user video
    this.peerConnection.ontrack = (event) => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    // 🎥 Ask camera + mic permission
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.localVideo.nativeElement.srcObject = this.localStream;

    // Add every track to peer
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  // ☎️ Start Call
  async startCall() {
    await this.setupConnection();

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socketService.emit("offer", offer);
  }

  // 📞 Answer Call
  async answerCall() {
    await this.setupConnection();
  }
}
