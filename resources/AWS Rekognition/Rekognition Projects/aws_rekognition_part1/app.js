import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {

    const [image, setImage] = useState('');
    const [uploadResultMessage, setUploadresultMessage] = useState('Please upload an image to authenticate.');
    const [visitorName, setVisitorName] = useState('placeholder.jpeg');
    const [isAuth, setAuth] = useState(false);

    function sendImage(e) {
        e.preventDefault();
        setVisitorName(image.name);
        const visitorImageName = uuid.v4();
        fetch(`https://xihhfgmb92.execute-api.us-west-2.amazonaws.com/v1/jchowlabs-visitor-images/${visitorImageName}.jpeg`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'image/jpeg'
            },
            body: image
            }).then(async () => {
                const response = await authenticate(visitorImageName);
                if (response.Message === 'Success') {
                    setAuth(true);
                    setUploadresultMessage(`Hi ${response['firstName']} ${response['lastName']}, Welcome to Jchowlabs!`);
                } else {
                    setAuth(false);
                    setUploadResultMessage('Authentication failed: this person is not an employee.')
                }
            }).catch(error => {
                setAuth(false);
                setUploadResultMessage('There is an error during the authentication process. Please try again.')
                console.error(error)
            })
    }

    async function authenticate(visitorImageName) {
        const requestUrl = 'https://xihhfgmb92.execute-api.us-west-2.amazonaws.com/v1/employee?' +  new URLSearchParams({ 
            objectKey: `${visitorImageName}.jpeg`
        });                  
    return await fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        }).then(response => response.json())
        .then((data) => {
            return data;
        }).catch(error => console.error(error));
    }

    return (
        <div className="App">
        <h2>Facial Rekognition System</h2>
        <form onSubmit={sendImage}>
            <input type='file' name='image' onChange={(e) => setImage(e.target.files[0])}/>
            <button type='submit'>Authenticate</button>
        </form>
        <div className ={isAuth ? 'success' : 'failure' }>{uploadResultMessage}</div>
        <img src={ require(`./visitors/${visitorName}`) } alt="Visitor" height={250} width={250}/> 
        </div>
    );
}

export default App;


