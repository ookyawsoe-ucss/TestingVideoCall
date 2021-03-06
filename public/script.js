const socket = io('/');
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined, {
    path : '/peerjs',
    host : '/',
    port : '3000'
}); 
let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);


    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    }); 

    let text = $('input');

    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length !== 0) {
            // console.log(text.val()); 
            socket.emit('message', text.val());
            text.val('')
        }
    });

    socket.on('createMessage', message => {
        console.log("Create Message", message);
        $('.messages').append(`<li class="message"  ><b>User</b><br>${message}</li>`);
    })


    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
}); 


peer.on('open', id => {
    console.log("ID ",id);
    socket.emit('join-room', ROOM_ID, id);
});

// socket.emit('join-room', ROOM_ID);

const connectToNewUser = (userId, stream) => {
    console.log("New User Id", userId, stream);
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}

const addVideoStream = (video, stream) => {
    video.srcObject =  stream;
    video.addEventListener('loadedmetada', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToButtom = () => {
    letd=$('.main__chat__window');
    document.scrollTop(d.prop("scrollHeight")); 
}

// Mute/Unmute Video
const muteUnmute = () => {
    console.log(myVideoStream);
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
                <i class="fas fa-microphone"></i>
                <span>Mute</span>  `


    document.querySelector('.main__mute__button').innerHTML = html;
  
}


const setUnmuteButton = () => {
    const html = `
                <i class="unmute fas fa-microphone-slash"></i>
                <span>Unmute</span>  `


    document.querySelector('.main__mute__button').innerHTML = html;
  
}
// Play/Stop Video
const playStop = () => {
    console.log(myVideoStream);
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setStopVideo();
    }else{
        setPlayVideo();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
                <i class="fas fa-video"></i>
                <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}


const setPlayVideo = () => {
    const html = `
                <i class="stop fas fa-video-slash"></i>
                <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

$(document).ready(function(){
    $(".chat").click(function(){
      $(".main__right").toggle();
    });
});