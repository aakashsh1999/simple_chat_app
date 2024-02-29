import {useEffect, useState} from 'react'
import io from 'socket.io-client'
import {v4} from 'uuid'

const port = 8000;
const socket = io(`http://localhost:${port}`)

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState("")
  const [room , setRoom] = useState("")
  const [chatIsVisible, setChatIsVisible] = useState(false);
  const [messages, setMessages] = useState([])

  useEffect(() =>{
    console.log('connected', socket.connected)
    socket.on('connect', () =>{
      setIsConnected(true)
    })
    socket.on('disconnect', ()=>{
      setIsConnected(false)
    })
    return () =>{
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [isConnected])

  useEffect(()=>{
      socket.on('recieve_msg', (d) =>{
        console.log(d)
        const msg =`${user} send: ${d}`
        setMessages(prevState => [msg, ...prevState])
      })
  });


  const handleEnterChatRoom = () =>{
    if(user !== "" && room !==""){
      setChatIsVisible(true)
      socket.emit('join_room', {user, room})
    }
  }

  const handleSendMessage = () =>{
    const newMsgData ={
      room:room,
      user:user,
      message: newMessage,
    }
    socket.emit("send_msg", newMsgData)
    const msg = `${user} send: ${messages}`
    setMessages(prevState => [msg, ...prevState])
    console.log(messages)
    setNewMessage("")
  }


  return (
    <div style={{padding:"20px"}}>
      {
        !chatIsVisible ?
        <>        <input type={"text"} placeholder={'user'} value={user} onChange={e=> setUser(e.target.value)} />
        <br />
        <input type={"text"} placeholder={'room'} value={room} onChange={e=> setRoom(e.target.value)} />
        <br />
        <button onClick={handleEnterChatRoom}>Enter Room</button>
        </>
        :<>
        <div>
          <h5>Room: {room} | User : {user}</h5>
          <div style={{
            height:200,
            width:500,
            border:'1px solid black',
            overflowY:'scroll',
            marginBottom:10,
            padding:10
          }}>
            {messages.map(el=> <div key={v4()}>{el}</div>)}
          </div>
          <input type={'text'} placeholder="message" value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
        </div>
          <button onClick={handleSendMessage}>Send Message </button>
        </>

      }
    </div>
  );
}

export default App;
