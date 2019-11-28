const express = require('express');
const router = express.Router();

const API = require('../model/api')

const system = require('../backend/mockBBDD')

router.get('/suscriptions', (req, res, next) => {
    const valid = req.query !== undefined
    const validId = req.query.artistId !== undefined;
    if(valid && validId){
        const id = req.query.artistId
        API.get('/artists/' + id)
        .then(response => {
            const artist = response.data;
            if(artist !== undefined){
                const elems = (system.getAllThatFollow(Number.parseInt(req.query.artistId)));
                res.status(200).json(elems);
            }
            else{
                res.status(400).json({message: "artist es undefinded2"})
            }
            
        })
        .catch(err => {
            console.log(err)
            res.status(400)
        })
    }
    else{
        res.status(400).json({message: 'bad'})
    }
});

router.post('/suscribe', (req, res, next) => {
    const validLength = Object.keys(req.body).length === 2;
    const validId = req.body.artistId !== undefined;
    const validemail = req.body.email !== undefined;
    if(validLength && validId && validemail){
        const email = req.body.email;
        const id = req.body.artistId;
        // debe verificar que no existe el mail
        API.get('/artists/' + id)
            .then(response => {
                const artist = response.data;
                if(artist !== undefined){
                    system.addUser(email, id);
                    res.status(200).json({message: "ok"});
                }
                else{
                    res.status(400).json({message: "artist es undefinded2"})
                }
                
            })
            .catch(err => {
                console.log(err)
                res.status(400)
            })
        }
    else{
        res.status(400).json({message: 'bad'})
    }
});

router.post('/unsuscribe', (req, res, next) => {
    const validLength = Object.keys(req.body).length === 2;
    const validId = req.body.artistId !== undefined;
    const validemail    = req.body.email !== undefined;
    if(validLength && validId && validemail){
        // verificar que existe el mail
        const id = Number.parseInt(req.body.artistId);
        const email = req.body.email
        API.get('/artists/' + id)
        .then(response => {
            const artist = response.data;
            if(artist !== undefined){
                system.unFollow(email,id)
                res.status(200).json(system.getUser(email))
            }
            else{
                res.status(400).json({message: "artist es undefinded2"})
            }  
        })
        .catch(err => {
            res.status(400)
        })
    }
    else{
        res.status(400).json({message: 'bad'})
    }
});

router.post('/notify', (req, res, next) => {
    const c1 = Object.keys(req.body).length === 3
    const c2 = req.body.subject !== undefined
    const c3 = req.body.message !== undefined
    const c4 = req.body.artistId !== undefined
    if(c1 && c2 && c3 && c4){
        const id = req.body.artistId
        API.get('/artists/' + id)
        .then(response => {
            const artist = response.data;
            const subject = req.body.subject;
            const message = req.body.message;
            const m = system.notify(artist, subject, message); 
            res.status(200).json({message: m})
        })
        .catch(err => {
            res.status(400)
        })
    }
	else{
        res.status(400).json({message: "error en el body"})
    }
});

router.delete('/suscriptions', (req, res, next) => {
	const validLength = Object.keys(req.body).length === 1;
    const validId = req.body.artistId !== undefined;
    if(validLength && validId){
        const id = Number.parseInt(req.body.artistId);
        const email = req.body.email
        API.get('/artists/' + id)
        .then(response => {
            const artist = response.data;
            if(artist !== undefined){
                system.allUnfollow(req.body.artistId)
                res.status(200).json()                
            }
            else{
                res.status(400).json({message: "artist es undefinded2"})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400)
        })
    }
    else{
        res.status(400).json({message: 'bad'})
    }
});

module.exports = router;