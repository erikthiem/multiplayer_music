import {Socket, LongPoller} from "phoenix"

class App {

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect({user_id: "123"})
    var $roomid = $("#roomid").val()
    var $status    = $("#status")
    var $dots  = $("#dots")
    var $circleColorInput = $("#circle-color-input")
    var $input     = $("#circle-input")
    var $username  = $("#username")
    var circleColor = "green"

    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("rooms:" + $roomid, {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => console.log("join ok"))
               .after(10000, () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    $input.on("click", e => {
      chan.push("new:msg", {user: $username.val(), body: circleColor})
      $input.val("")
    })

    $circleColorInput.on("keyup", e => {
      circleColor = $circleColorInput.val();
      $input.css("background-color", circleColor);
    })

    chan.on("new:msg", msg => {
      $dots.append(`<div class='dot' id='dot-${msg.user}' style='background-color: ${msg.body}; opacity: 0.2;'></div>`)
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      if(msg.user) {
        var username = this.sanitize(msg.user)
        $dots.append(`<div class='dot' id='dot-${username}' style='background-color: white; border: 1px solid black;'></div>`)
      }
    })
  }

  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<p><a href='#'>[${username}]</a>&nbsp; ${body}</p>`)
  }

}

$( () => App.init() )

export default App
