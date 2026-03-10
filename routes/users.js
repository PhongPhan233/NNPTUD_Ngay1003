const express = require("express")
const router = express.Router()

const userSchema = require("../schemas/users")

router.post("/", async (req,res)=>{

    try{

        let newUser = new userSchema({
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
            fullName:req.body.fullName,
            avatarUrl:req.body.avatarUrl,
            role:req.body.role
        })

        await newUser.save()

        res.send(newUser)

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.get("/", async (req,res)=>{

    let filter = { isDeleted:false }

    if(req.query.username){

        filter.username = {
            $regex:req.query.username,
            $options:"i"
        }

    }

    let users = await userSchema
    .find(filter)
    .populate("role")

    res.send(users)

})

router.get("/:id", async (req,res)=>{

    try{

        let user = await userSchema
        .findById(req.params.id)
        .populate("role")

        if(!user){

            res.status(404).send({
                message:"USER NOT FOUND"
            })

        }else{

            res.send(user)

        }

    }catch(error){

        res.status(404).send({
            message:error.message
        })

    }

})

router.put("/:id", async (req,res)=>{

    try{

        let user = await userSchema.findByIdAndUpdate(

            req.params.id,
            req.body,
            {new:true}

        )

        if(user){

            res.send(user)

        }else{

            res.status(404).send({
                message:"USER NOT FOUND"
            })

        }

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.delete("/:id", async (req,res)=>{

    try{

        let user = await userSchema.findById(req.params.id)

        if(!user){

            res.status(404).send({
                message:"USER NOT FOUND"
            })

        }else{

            user.isDeleted = true

            await user.save()

            res.send(user)

        }

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.post("/enable", async (req,res)=>{

    try{

        let user = await userSchema.findOne({

            username:req.body.username,
            email:req.body.email

        })

        if(!user){

            res.status(404).send({
                message:"USER NOT FOUND"
            })

        }else{

            user.status = true

            await user.save()

            res.send(user)

        }

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.post("/disable", async (req,res)=>{

    try{

        let user = await userSchema.findOne({

            username:req.body.username,
            email:req.body.email

        })

        if(!user){

            res.status(404).send({
                message:"USER NOT FOUND"
            })

        }else{

            user.status = false

            await user.save()

            res.send(user)

        }

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})
module.exports = router