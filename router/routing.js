const express = require('express')
const router  = express.Router()
const multer  = require('multer')
const File    = require('../models/file')
const bcrypt  = require('bcryptjs')
const upload  = multer({
    dest: 'upload'
})

router.get('/upload',(req,res)=>{
    try{
        res.render('index.pug')
    }catch(err){
        console.log(err)
        res.redirect('/')
    }

})

router.post('/upload',upload.single('file'), async(req,res) =>{
    const newFile = {
        path: req.file.path,
        password: req.body.password,
        originalname: req.file.originalname
    }
    let nFile
    try{
        nFile = await File.create(newFile)
        // await nFile.save()
        res.render('index.pug',{
            path: `${req.headers.origin}/file/${nFile.id}`
        })
    }catch(err){
        if(!nFile){
            fs.unlink(newfile.path, (err) => {
                if (err) throw err;
                console.log(`successfully deleted ${newFile.path}`);
            });
        }
        res.redirect('/file/upload')
    }
})

router.get('/:id' , async (req,res) =>{

    try{
        let theFile = await File.findById(req.params.id)
        if(theFile.password != null && theFile.password != ''){
            res.render('password.pug',{
                file: theFile
            })
        }
        res.download(theFile.path,theFile.originalname)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})

router.post('/:id', async (req,res) =>{
    const file = await File.findById(req.params.id)
    try{
        if(await bcrypt.compare(req.body.password,file.password)){
            res.download(file.path,file.nameOriginal)
        }else{
            res.render('password.pug',{
                file: file,
                errors: 'incurrect password'
            })
        }
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router