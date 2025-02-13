

const bcrypt=require("bcryptjs")

const hashPassword=async (password)=>{
    const salt=await bcrypt.genSalt();
    const hashedPassword=bcrypt.hash(password,salt);
    return hashedPassword;
}

const comparePassword=async (password,hashedPassword)=>{
    const passwordMatch=bcrypt.compare(password,hashedPassword);
    return passwordMatch
}


module.exports={hashPassword,comparePassword}