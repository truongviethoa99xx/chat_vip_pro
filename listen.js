function listen() {
   let listen_key = $('#listen-key').val();
   socket.on('connect-socket', async (data) => {
      console.log(data, 'connect-socket');
   });

   socket.on('listen-join-room', async (data) => {
      console.log(data);
      $('#room_id').text(` ${data.data.name}`);
   });

   socket.on('socket-error', async (data) => {
      console.log(data);
   });

   socket.on('listen-message-text', async (data) => {
      await renderChatResponse(data);
   });
}

async function renderChatResponse(data) {
   let user_id_render = $('#user_id').val();
   let message = data.msg;
   if (user_id_render == data.user_id) {
      $('#chat-main').append(
         `<div class="d-flex flex-row p-3 message-right">
        <div class="bg-white mr-2 p-3">
        <div class="name-user">${data.user.name}</div>
            <span class="text-muted">${message}</span>
        </div>
        <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30" height="30" />
      </div>`
      );
   } else {
      $('#chat-main').append(
         `<div class="d-flex flex-row p-3 message-left">
          <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30" />
          <div class="chat ml-2 p-3">
          <div class="name-user">${data.user.name}</div>
            ${message}
          </div>
      </div>`
      );
   }
   $('#chat-main').scrollTop = $('#chat-main').scrollHeight;
}
