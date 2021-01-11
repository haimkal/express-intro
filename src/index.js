const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const users = [];
let counter = 1;
let photos = [];
let photosCounter = 0;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// LOGIN (/user/login => POST)
app.post('/user/login', (req, res)=> {
    const {username, password} = req.body;
    console.log(typeof username, typeof password)
    const user= users.find((user)=> user.username == username && user.password == password);
    if (!user) {
        res.status(403).send();
        return;
    }
    res.json(user);
    console.log(user);
})

// DELETE USER BY ID
app.delete('/user/:id', (req, res) => {
    const id  = Number(req.params.id);
    const index = users.findIndex((user) =>user.id === id);
    if (index === -1) {
        res.status(404).send(`User ${id} does not exist`);
    } else {
        users.splice(index, 1);
        res.status(204).send();
    }
})


// CREATE USER
app.put('/user', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('Incorrect body');
        return;
    }
    if (username.length < 3 || password.length < 6) {
        res.status(400).send('Username or password are invalid');
        return;
    }
    const newUser = {
        id: counter,
        username,
        password
    };
    counter++;
    users.push(newUser);
    res.sendStatus(201);
});


// EDIT USER
app.post ('/user/:id', (req, res) => {
    const id  = Number(req.params.id);
    const currentUser= users.find((user)=> user.id === id);
    if (!currentUser) {
        res.status(404).send(`User ${id} does not exist`);
        return;
    }

    const {username, password} = req.body;
    if(username.length < 4 && password.toString().length <4) {
        res.status(400).send('Username or password are invalid');
    }else{
        currentUser.username= username; 
        currentUser.password = password;
        res.status(200).json(currentUser);
    }

})


// GET ALL USERS
app.get('/user', (req, res) => {
    res.send(users);
});

// GET USER BY ID
app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const requestedUser = users.find(user => user.id === userId);
    if (!requestedUser) {
        res.sendStatus(404);
        return;
    }
    res.send(requestedUser);
});


// ADDING IMAGE- CREATING PHOTO

app.put ('/photo', (req, res) => {
    const {title, filename} = req.body;
    console.log(filename);
    if (!isValidImage(filename)) {
        res.status(400).send('invalid photo!');
        return;
    }
    const newPhoto = {
        id: photosCounter,
        title,
        filename
    };
    photosCounter ++;
    photos.push(newPhoto)
    res.status(200).send('photo was added');
    
})

// HELPER FUNCTION - checking if filename is valid
function isValidImage(filename) {
    if(!filename && typeof filename !== 'string') return false;
    let fileType = filename.split('.');
    fileType = fileType[fileType.length -1];
        return (fileType === "jpg" || fileType ==="jpeg" || fileType === "png")
        
        
};

// GETTING AN IMAGE
app.get('/photo/:id', (req, res) => {
    const photoId = parseInt(req.params.id);
    const requestedPhoto = photos.find(photo => photo.id === photoId);
    if (!requestedPhoto) {
        res.sendStatus(404);
        return;
    }
    res.send(requestedPhoto);
});

// GETTING ALL IMAGES
app.get('/photo', (req, res) => {
    res.send(photos);
});

// DELETE IMAGE BY ID
app.delete('/photo/:id', (req, res) => {
    const id  = Number(req.params.id);
    const index = photos.findIndex((user) =>photo.id === id);
    if (index === -1) {
        res.status(404).send(`photo ${id} does not exist`);
    } else {
        photo.splice(index, 1);
        res.status(204).send();
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

