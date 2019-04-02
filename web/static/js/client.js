import {Socket, LongPoller} from "phoenix"

class ClientApp {

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    socket.connect({user_id: "123"})
    var $roomid = $("#roomid").val()
    var $status    = $("#status")
    var $input     = $("#circle-input")
    var $username  = $("#username")

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
      chan.push("new:msg", {user: $username.val()})
      $input.val("")
    })

    chan.on("new:msg", msg => {
      var snd = new Audio("/sounds/drum.mp3")
      snd.play()
      console.log("button clicked")
    })

    chan.on("user:entered", msg => {
      if(msg.user) {
        var username = this.sanitize(msg.user)
        console.log("user ${username} entered")
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

$( () => ClientApp.init() )

export default ClientApp
