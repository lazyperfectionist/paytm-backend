const zod = require('zod');

const userSchema  = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8),
    firstName:zod.string(),
    lastName:zod.string()
    
})

const loginSchema = zod.object({
    username:zod.string().email(),
    password:zod.string().min(8)
})

const updateSchema = zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

module.exports = {userSchema,loginSchema,updateSchema};