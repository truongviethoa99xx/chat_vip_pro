var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

let socket;

$("#connect").click(async function () {
  let domain = $("#domain").val();
  let user_id = $("#user_id").val();
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 7);
  document.cookie = `token=${user_id}; expires=` + expireDate.toUTCString();
  document.cookie = `domain=${domain}; expires=` + expireDate.toUTCString();

  // Sự kiện khi kết nối thành công
  socket = io(`${domain}?user_id=${user_id}`); // Thay đổi URL thành URL của máy chủ Socket.IO của bạn

  socket.on("connect", function () {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  listen();
});

$("#disconnect").click(function () {
  socket.disconnect();
});

let dataText;

$(function () {
  let cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].split("=");
    if (cookie[0] === "token") {
      let user_id = cookie[1];
      $("#user_id").val(user_id);
      break;
    }
  }

  const textarea = document.getElementById("my-textarea");

  textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let value = textarea.value;
      let data = {
        room_id: $("#room").val(),
        message: value,
      };
      socket.emit("message-text", data);
      textarea.value = "";
    }
  });

  let domainCookie = getCookieValue("domain");
  $("#domain").val(domainCookie);

  let roomCookie = getCookieValue("room_id");
  $("#room").val(roomCookie);

  let emit_key = getCookieValue("emit");
  $("#emit-key").val(emit_key);

  let listen_key = getCookieValue("listen");
  $("#listen-key").val(listen_key);

  $("#join-room").click(function () {
    let data = {
      room_id: $("#room").val(),
    };
    socket.emit("leave-room", data);
    socket.emit("join-room", data);

    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    document.cookie =
      `room_id=${$("#room").val()}; expires=` + expireDate.toUTCString();

    fetch(`http://172.16.4.5:6969/${$("#room").val()}/list-message`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let html = "";
        data.data.map((item) => {
          if ($("#user_id").val() == item.user.id) {
            html += `<div class="d-flex flex-row p-3 message-right">
                        <div class="bg-white chat ml-2 p-3 position-relative">
                            <div class="name-user">${item.user.name}</div>
                            <span class="text-muted">${item.msg}</span>
                        </div>
                        <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width="30" height="30" />
                    </div>`;
          } else {
            html += `<div class="d-flex flex-row p-3 message-left">
                        <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width="30" height="30" />
                        <div class="chat ml-2 p-3">
                          <div class="name-user">${item.user.name}</div>
                          ${item.msg}
                        </div>
                    </div>`;
          }
        });
        $("#chat-main").html(html);
      })
      .catch(function (error) {
        console.log("Đã xảy ra lỗi: " + error);
      });
  });

  $("#leave-room").click(function () {
    let data = {
      conversation_id: $("room").val(),
    };
    socket.emit("leave-room", data);
    $("#room_id").text("Room ID");
  });

  $("#send-message").on("click", function () {
    console.log("send-message");
    let data = editor.getValue();
    let emit = $("#emit-key").val();
    sendMessage(data, emit);

    let expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    document.cookie =
      `emit=${$("#emit-key").val()}; expires=` + expireDate.toUTCString();
    document.cookie =
      `listen=${$("#listen-key").val()}; expires=` + expireDate.toUTCString();
  });

  $("#send").click(function () {
    let socket_emit = $("#key-socket").val();
    sendMessage(dataText.getValue(), socket_emit);
  });
});

// async function getMessage() {
//   $("#list-message").html("");
//   let room = $("#room").val();
//   let token = $("#token").val();
//   fetch(`http://172.16.10.74:9015/api/v2/message/${room}?limit=200&arrow=1`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       ProjectId: "7014",
//       Method: 0,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       jQuery.each(data.data, function (i, val) {
//         $("#list-message").append(`<div class="message-item">
//             <div class="name-user">${val.user.full_name} - Type: ${val.type}</div>
//             <div class="created-at-message">U:${val.user.user_id} - M:${val.message_id} - C:${val.conversation.conversation_id}</div>
//           </div>`);
//       });
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// async function getUserRedis() {
//   $("#list-redis").html("");
//   let room = $("#room").val();
//   console.log(room);
//   let token = $("#token").val();
//   fetch(
//     `http://172.16.10.74:9014/api/v2/conversation/socket-redis?conversation_id=${room}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         ProjectId: "7014",
//         Method: 0,
//       },
//     }
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       jQuery.each(data.data, function (i, val) {
//         let list_device = val.socket.map((item) => {
//           return item.device;
//         });
//         $("#list-redis").append(`<div class="message-item">
//             <div class="name-user">${val.user.full_name}</div>
//             <div class="created-at-message">${list_device.join(", ")}</div>
//           </div>`);
//       });
//     })
//     .catch((error) => {});
// }

async function sendMessage(data, socket_emit) {
  data = JSON.parse(data);
  socket.emit(socket_emit, data);
}

function getCookieValue(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(";");

  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return "";
}

// function generateRandomString(length) {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let randomString = "";

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     randomString += characters.charAt(randomIndex);
//   }

//   return randomString;
// }
