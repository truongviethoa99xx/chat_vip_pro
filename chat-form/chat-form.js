let socket;
let user_id_login;

$("#connect-user").click(function () {
  let user = $("#user_id").val();
  if (user) {
    fetch(`http://172.16.4.5:6969/${user}/user`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data) {
          alert(`Đăng nhập thành công user_id: ${user}`);
          $(".name-user").text(data.data.name);
          $(".avatar-user").attr("src", data.data.avatar);
          user_id_login = data.data.id;
        } else {
          alert("Đăng nhập thất bại");
        }
      })
      .catch(function (error) {
        console.log("Đã xảy ra lỗi: " + error);
      });
  } else {
    alert("Vui lòng nhập user_id");
    return;
  }

  socket = io(`http://172.16.4.5:6969?user_id=${$("#user_id").val()}`);

  socket.on("connect", function () {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  listenForm();
});

$(function () {
  let room_id;
  fetch("http://172.16.4.5:6969/room")
    .then((response) => response.json())
    .then((data) => {
      let html = data.data.map((item) => {
        return `<li class="clearfix chat-room-item" data-id="${item.id}">
                    <img
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt="avatar"
                    />
                    <div class="about">
                    <div class="name" >${item.name}</div>
                    <div class="status">
                        <i class="fa fa-circle offline"></i> room
                    </div>
                    </div>
                </li>`;
      });
      $(".list-unstyled.chat-list").html(html);
    })
    .catch((err) => {
      console.log(err);
    });

  $(document).on("click", ".chat-room-item", function () {
    room_id = $(this).data("id");
    let name = $(this).find(".name").text();
    $("#room-name").text(name);
    fetch(`http://172.16.4.5:6969/${room_id}/list-message`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let html = "";

        data.data.map((item) => {
          if (user_id_login == item.user.id) {
            html += ` <li class="clearfix chat-item">
                        <div class="message-data text-right">
                        <span class="message-data-time">${item.user.name}</span>
                        <img
                            src="${item.user.avatar}"
                            alt="avatar"
                        />
                        </div>
                        <div class="message other-message float-right">
                        ${item.msg}
                        </div>
                    </li>`;
          } else {
            html += ` <li class="clearfix">
                            <div class="message-data">
                            <img
                                src="${item.user.avatar}"
                                alt="avatar"
                            />
                            <span class="message-data-time">${item.user.name}</span>
                            </div>
                            <div class="message my-message">${item.msg}</div>
                        </li>`;
          }
        });
        $("#chat-body").html(html);
      })
      .catch(function (error) {
        console.log("Đã xảy ra lỗi: " + error);
      });

    let data = {
      room_id: room_id,
    };
    socket.emit("leave-room", data);
    socket.emit("join-room", data);
  });

  const textarea = document.getElementById("input-message");

  textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let value = textarea.value;
      if (!value) {
        return;
      }
      let data = {
        room_id: room_id,
        message: value,
      };
      socket.emit("message-text", data);
      textarea.value = "";
    }
  });
});

async function showAlert() {}
