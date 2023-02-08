import React, {useState, useRef, useEffect} from 'react';
import { GrSend } from 'react-icons/gr'
import SocketIOClient from 'socket.io-client';
import styles from './styles.module.css';
import Message from '../message';
import { basePath } from '../../../next.config';


export default function MainChat() {

    let [chat, setChat] = useState([]);
    let username = useRef('');
    let socketId = useRef(null);
    let messagesSectionRef = useRef();
    let scrollBarWasAtBottom = useRef(false);


    
    useEffect(() => {
        username.current = sessionStorage.getItem('username') || '';

        const socket = SocketIOClient.connect(process.env.BASE_URL, {
            path: basePath + '/api/socketio',
        });

        socket.on('connect', () => {
            socketId.current = socket.id
            setChat((chat) => [...chat, {username:'Sistema', message: 'Hola nuevo usuario! Envía tu mensajes para que todo el mundo los vea! :)'}]);
        });

        socket.on('message', (info) => {
            setChat((chat) => [...chat, info]);
            if (scrollBarWasAtBottom.current) {
                messagesSectionRef.current.scrollTo(0, messagesSectionRef.current.scrollHeight);
            }
        });

        if (socket) return () => socket.disconnect();

    }, []);



    const handleOnSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const message = event.target.elements.inputMessage.value;
        if (message.replaceAll(' ', '') === '') return;

        scrollBarWasAtBottom.current = messagesSectionRef.current.scrollTop + messagesSectionRef.current.clientHeight === messagesSectionRef.current.scrollHeight;
        fetch(basePath + '/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({socketId: socketId.current, username: username.current, message}),
        }).then(() => {
            event.target.elements.inputMessage.value = '';
            event.target.elements.inputMessage.focus()

            //moves scrollbar
            if (scrollBarWasAtBottom.current) {
                messagesSectionRef.current.scrollTo(0, messagesSectionRef.current.scrollHeight);
            }
        })
    }






    return (
        <main className={styles['main']}>
            <div className={styles['messages-section']} ref={messagesSectionRef}>
                {chat.map((info, pos) => {
                    const className = info.socketId === socketId.current ? 'sended-message' : 'recieved-message';
                    return <Message key={pos} className={className} username={info.username} message={info.message}/>
                })}
                
            </div>
            <form className={styles['send-messages-section']} onSubmit={handleOnSubmit}>
                <input name='inputMessage' className={styles['sending-text']} placeholder='Mensaje' />
                <button className={styles['send-text-btn']} type='submit'><GrSend /></button>
            </form>
        </main>
    );
}

