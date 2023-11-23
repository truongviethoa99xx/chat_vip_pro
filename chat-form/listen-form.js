async function listenForm() {
   //  let socket = io(`http://172.16.4.5:6969?user_id=1`); // Thay đổi URL thành URL của máy chủ Socket.IO của bạn
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
      console.log('nghe đc');
      await renderChatResponseForm(data);
   });
}

async function renderChatResponseForm(data) {
   // let user_id_render = $("#user_id").val();
   if (1 === +data.user_id) {
      $('#chat-body').append(
         `<li class="clearfix chat-item">
       <div class="message-data text-right">
       <span class="message-data-time">${data.user.name}</span>
       <img
       src="${data.user.avatar}"
       alt="avatar"
       />
       </div>
       <div class="message other-message float-right">
       ${data.msg}
       </div>
       </li>
       </li>`
      );
   } else {
      $('#chat-body').append(
         `<li class="clearfix">
          <div class="message-data">
          <img
          src="${data.user.avatar}"
          alt="avatar"
          />
          <span class="message-data-time">${data.user.name}</span>
          </div>
          <div class="message my-message">${data.msg}</div>
          </li>`
      );
   }
   $('#chat-body').scrollTop = $('#chat-body').scrollHeight;
}
