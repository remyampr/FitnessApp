const Trainer=require("../Models/Trainer")
const { hashPassword,comparePassword } = require("../Utilities/passwordUtilities");
const { createToken } = require("../Utilities/generateToken");

const registerTrainer=async (req,res,next)=>{
    try{

        
        const {name,email,password,phone}=req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: "All fields are required !" });
          }
        const trainerExist=await Trainer.findOne({email});
        if(trainerExist){
           return res.status(401).json({error:"Trainer already exist!"})
        }
        const hashedPassword=await hashPassword(password);
        const newTrainer=new Trainer({
            name,email,password:hashedPassword,phone
        });
        await newTrainer.save()
        if(newTrainer){
            const token=createToken(newTrainer._id,newTrainer.role);
            res.cookie("token",token);
            return res.status(201).json({msg:"New Trainer Registered",newTrainer});
        }

    }catch(err){
        next(err);
    }

}
const loginTrainer=async (req,res,next)=>{
    try{

        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({ error: "All fields are required !" });
        }
        const trainer=await Trainer.findOne({email});
        if(!trainer){
            return res.status(400).json({ error: "trainer not Found !" });
        }

        const passwordMatch=await comparePassword(password,trainer.password);
        if(!passwordMatch){
            return res.status(401).json({ error: "Password not match !" });
        }

        const token=createToken(trainer._id,trainer.role);
        res.cookie("token",token);
        return res.json({ msg: "trainer Login",trainer:{name:trainer.name,email:trainer.email,Role:trainer.role},token:token});


    }catch(err){
        next(err);
    }

}


const logout=async(req,res,next)=>{
    try {
      res.clearCookie("token")
      res.status(200).json({msg:"logout"})
    } catch (error) {
      next(error)
    }
  }


module.exports={registerTrainer,loginTrainer,logout}