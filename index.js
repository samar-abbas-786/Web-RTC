// import express from "express";
// import http from "http";
// import path from "path";
// import { Server } from "socket.io";
// const app = express();
// const server = http.createServer(app);
// const PORT = 3000;
// const __dirname = path.resolve();
// // import {} from "simple-peer"
// const io = new Server(server);

// app.use(express.static(path.join(__dirname, "public")));

// io.on("connection", (socket) => {
//   console.log("A user is connected");

//   socket.on("disconnect", () => {
//     console.log("User is disconnected");
//   });

//   socket.on("signal", (data) => {
//     socket.broadcast.emit("signal", data);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running at ${PORT}`);
// });

let local;
let remote;
let peerConnection;
let client;
let channel;

const server = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    { urls: "stun:stun1.l.google.com:5349" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349" },
    { urls: "stun:stun3.l.google.com:3478" },
    { urls: "stun:stun3.l.google.com:5349" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349" },
  ],
};

const init = async () => {
  local = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById("user-1").srcObject = local;
  createOffer();
};

const createOffer = async () => {
  peerConnection = new RTCPeerConnection(server);
  remote = new MediaStream();
  document.getElementById("user-2");

  //get all track of local and add it to peerconnection
  local.getTracks().forEach((track) => {
    peerConnection.addTrack(track, local);
  });

  //Listen when peer connection has track add it to remote stream
  peerConnection.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remote.addTrack(track);
    });
  };

  //When we set  peerConnection.setLocalDescription(offer) it start requesting stun server for ice candidate and we can listen for them

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log("New Ice Candidate", event.candidate);
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log(offer);
};

init();
