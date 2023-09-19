module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    // console.log(socket.engine);

    socket.on("send_message", (data) => {
      console.log(data);
      socket.broadcast.emit("receive_message", data);
    });

    // Add more socket.io event handlers as needed
  });
};
