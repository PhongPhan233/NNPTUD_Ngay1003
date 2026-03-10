const express = require("express")
const router = express.Router()

const roleSchema = require("../schemas/roles")
const userSchema = require("../schemas/users")

router.post("/", async (req,res)=>{

    try{

        let newRole = new roleSchema({
            name:req.body.name,
            description:req.body.description
        })

        await newRole.save()

        res.send(newRole)

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.get("/", async (req,res)=>{

    let roles = await roleSchema.find({
        isDeleted:false
    })

    res.send(roles)

})

router.get("/:id", async (req,res)=>{

    try{

        let role = await roleSchema.findById(req.params.id)

        if(!role){

            res.status(404).send({
                message:"ROLE NOT FOUND"
            })

        }else{

            res.send(role)

        }

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.put("/:id", async (req,res)=>{

    try{

        let role = await roleSchema.findByIdAndUpdate(

            req.params.id,
            req.body,
            {new:true}

        )

        if(role){

            res.send(role)

        }else{

            res.status(404).send({
                message:"ROLE NOT FOUND"
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

        let role = await roleSchema.findById(req.params.id)

        if(!role){

            res.status(404).send({
                message:"ROLE NOT FOUND"
            })

        }else{

            role.isDeleted = true

            await role.save()

            res.send(role)

        }

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

router.get("/:id/users", async (req,res)=>{

    try{

        let users = await userSchema
        .find({
            role:req.params.id,
            isDeleted:false
        })
        .populate("role")

        res.send(users)

    }catch(error){

        res.status(400).send({
            message:error.message
        })

    }

})

module.exports = router