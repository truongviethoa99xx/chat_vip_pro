async function listenForm() {
   let socket = io(`http://172.16.4.5:6969?user_id=9`); // Thay đổi URL thành URL của máy chủ Socket.IO của bạn
  socket.on("connect-socket", async (data) => {
    console.log(data, "connect-socket");
  });

  socket.on("listen-join-room", async (data) => {
    console.log(data);
    $("#room_id").text(` ${data.data.name}`);
  });

  socket.on("socket-error", async (data) => {
    console.log(data);
  });

  socket.on("listen-message-text", async (data) => {
    await renderChatResponseForm(data);
  });
}

async function renderChatResponseForm(data) {
  console.log(data);
  // let user_id_render = $("#user_id").val();
  // let message = data.msg;
  // if (user_id_render == data.user_id) {
  //   $("#chat-main").prepend(
  //     `<div class="d-flex flex-row p-3 message-right">
  //       <div class="bg-white mr-2 p-3">
  //       <div class="name-user">${data.user.name}</div>
  //           <span class="text-muted">${message}</span>
  //       </div>
  //       <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30" height="30" />
  //     </div>`
  //   );
  // } else {
  //   $("#chat-main").prepend(
  //     `<div class="d-flex flex-row p-3 message-left">
  //         <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30" />
  //         <div class="chat ml-2 p-3">
  //         <div class="name-user">${data.user.name}</div>
  //           ${message}
  //         </div>
  //     </div>`
  //   );
  // }
}
