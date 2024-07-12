import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import LoadingBar from './Loadingbar';
import { useNavigate } from 'react-router-dom';
import { merge } from './utils/MergeSort';
import { upload } from './utils/FileUpload';
import { notifyError } from './utils/Notification';
function Chat() {
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [sortedMessages, setSortedMessages] = useState([])
    const [username, setUsername] = useState("");
    const [backgroundImage, setBackgroundImage] = useState('');
    const [suggestedMessages, setSuggestedMessages] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(true);
    const toggleSuggestions = () => {
        setShowSuggestions((prev) => !prev);
    };

    const handleImageUpload = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        try {
            const imageUrl = await upload(file);
            setBackgroundImage(imageUrl);
            sessionStorage.setItem('backgroundImage', imageUrl);
        } catch (error) {
            notifyError("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };
    const getSuggestedMessages=async (jwt,socket)=>{
        const response = await axios.get('https://charming-appliance-3966cb327a.strapiapp.com/api/suggestion', {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        let suggestedMessages=response.data.data.attributes.sentences.sentences;
        console.log(socket)
        socket.emit('suggestedMessages', {suggestedMessages})
    }
    useEffect(() => {
        const jwt = localStorage.getItem('ayna_jwt');
        const user = localStorage.getItem('ayna_user');
        setBackgroundImage(sessionStorage.getItem('backgroundImage'))
        if (!jwt || !user) {
            navigate('/login');
            return;
        }
        const serverMessages = JSON.parse(sessionStorage.getItem('serverMessages')) || [];
        const userMessages = JSON.parse(sessionStorage.getItem('userMessages')) || [];
        setSortedMessages(merge(userMessages, serverMessages))
        const newSocket = io('https://charming-appliance-3966cb327a.strapiapp.com');
        setSocket(newSocket);
        const parsedUser = JSON.parse(user);
        setUsername(parsedUser.username);
        newSocket.on('connection', (data) => {
            getSuggestedMessages(jwt,newSocket)
        });

        newSocket.on('message', (receivedMessage) => {
            const messageObject = JSON.parse(receivedMessage)
            const serverMessages = JSON.parse(sessionStorage.getItem('serverMessages')) || [];
            serverMessages.push(messageObject);
            sessionStorage.setItem('serverMessages', JSON.stringify(serverMessages));
            const userMessages = JSON.parse(sessionStorage.getItem('userMessages')) || [];
            setSortedMessages(merge(userMessages, serverMessages))
        });
        newSocket.on('suggestions_received', (receivedMessages) => {
            console.log(JSON.parse(receivedMessages))
            setSuggestedMessages(JSON.parse(receivedMessages))
        });
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim().length === 0) {
            notifyError("Please enter a message");
            return;
        }
        const currentTime = new Date().toLocaleTimeString();
        const newMessage = { username, message, time: currentTime };
        const userMessages = JSON.parse(sessionStorage.getItem('userMessages')) || [];
        const serverMessages = JSON.parse(sessionStorage.getItem('serverMessages')) || [];
        userMessages.push(newMessage);
        sessionStorage.setItem('userMessages', JSON.stringify(userMessages));
        socket.emit('message', newMessage);
        setSortedMessages(merge(userMessages, serverMessages))
        setMessage('');
    };

    const handleLogout = () => {
        localStorage.removeItem('ayna_jwt');
        localStorage.removeItem('ayna_user');
        sessionStorage.removeItem('backgroundImage');
        sessionStorage.removeItem('userMessages');
        sessionStorage.removeItem('serverMessages');
        navigate('/login');
    };
    const handleTyping = (message) => {
        socket.emit("getsuggestions", { message })
        setShowSuggestions(true)
    };
    return (
        <>
            {loading && <LoadingBar />}
            <Toaster />
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#67539f' }}>
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg w-3/4 h-3/4">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl text-white">Chat Room</h2>
                            <div className="text-white flex items-center">Logged in as: {username}</div>
                            <button
                                className="bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                        <div className="flex-grow mb-4 overflow-y-auto bg-gray-100 p-4 rounded-lg" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
                            {sortedMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 flex ${msg.username === 'server' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className="mb-2 flex justify-start">
                                        <div className="p-2 rounded-lg bg-gray-300 text-gray-800 shadow-lg">
                                            <div className="font-bold text-lg text-gray-900 mb-1 flex justify-between items-center">
                                                <span className="mb-1 mr-2">{msg.username}</span>
                                                <span className="text-sm text-gray-500">{msg.time}</span>
                                            </div>
                                            <div className="message">{msg.message}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            {showSuggestions && suggestedMessages.length > 0 && message.trim().length > 0 && (
                                <div className="bg-white shadow-lg rounded-lg max-h-24 overflow-y-auto">
                                    <div className="flex justify-between p-2">
                                        <h3 className="text-lg">
                                            Suggestions ({suggestedMessages.length})
                                        </h3>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={toggleSuggestions}
                                        >
                                            Hide
                                        </button>
                                    </div>
                                    <ul className="p-2">
                                        {suggestedMessages.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => setMessage(suggestion)}
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <form onSubmit={sendMessage} className="flex">
                            <input
                                className="flex-grow px-3 py-2 rounded bg-gray-300 text-gray-800 focus:bg-white focus:outline-none"
                                type="text"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    handleTyping(e.target.value);
                                }}
                                placeholder="Type your message..."
                            />
                            <button
                                className="ml-2 bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                type="submit"
                            >
                                Send
                            </button>
                        </form>
                        <div className="mt-4 flex items-center justify-center">
                            <label className="block text-white mb-2">Upload Background Image:</label>
                            <div className="flex items-center mx-2">
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer bg-purple-800 hover:bg-purple-700 text-white py-2 px-4 rounded focus:outline-none"
                                >
                                    Choose File
                                </label>
                                <span className="ml-2 text-white">{loading ? "Uploading..." : ""}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;
