import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.scss']
})
export class VideochatComponent implements OnInit, AfterViewInit {

  myVideo: ElementRef;
  public peer;
  public anotherId;
  public myPeerId;
  constructor(private router: Router) { }

  ngOnInit() {
    this.peer = new Peer();
    setTimeout(() => {
      this.myPeerId = this.peer.id;
    }, 3000);

    this.peer.on('connexion', function(conn) {
      conn.on('data', function(data) {
        // Imprime "salut!"
        console.log(data);
      });
    });
  }

  ngAfterViewInit() {
    let video = this.myVideo.nativeElement;
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    this.peer.on('call', function(call){
      n.getUserMedia({video: true, audio: true}, function(stream) {
        call.anwser(stream);
        call.on('stream', function(remotestream){
          video.src = URL.createObjectURL(remotestream);
          video.play();
        })
      }), function(err) {
        console.log('Failed to get local stream' ,err);
      }
    });
  }

  connect() {
    var conn = this.peer.connect(this.anotherId);
    conn.on('open', function () {
      conn.send('sending of salutation to receiver!');
    });
    // this.anotherId = '';
  }

  videoConnect() {
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherId;
   //  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
   var n = <any>navigator;
   n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
   n.getUserMedia({video: true, audio: true}, function(stream){
     var call = localvar.call(fname, stream);
     call.on('stream', function(remotestream){
       video.src = URL.createObjectURL(remotestream);
       video.play();
     }), function(err){
       console.log('Failed to get local stream' ,err);
     }
   })
 }

  endChat() {
    this.router.navigateByUrl('messages');
  }

}
