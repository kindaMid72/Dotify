import express from 'express';
import userModels from '../models/userModels.js';
import bcrypt from 'bcrypt';



const route = express.Router();

// validasi input
route.post('/create_user', async (req, res) => {
    // Gunakan destructuring untuk mengambil data dari body, lebih bersih
    const { email, password, name, profile_url } = req.body;
    
    // Validasi input dasar (bisa diperlengkap)
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required.' });
    }
    if (await userModels.getUserByEmail({email}) == true){ // check if the email already exist
        res.status(400).json({massage: "Email already exist nig"});
        return;
    } 
    const passwordHashed = await bcrypt.hash(password, 10); // saltRound = 10 times
    try {
        const current_time = new Date();
        const result = await userModels.createUser({ email, passwordHashed, name, profile_url, current_time});
        res.status(201).json({massage: 'User created successfully ', result});
    } catch (error) {
        console.log(error);
        res.status(500).json({massage: error.massage || 'Failed to create user'}); // kembalikan pesan error
    }
});


route.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const hashedPassword = await userModels.getHashedPasswordByEmail({email}); // get hashed password by email for comparison
        const isCorrect = await bcrypt.compare(password, hashedPassword);
        if(isCorrect){
            res.status(200).json(
                {canEnter: true}
            )
        }else{
            res.status(400).json(
                {canEnter: false}
            )
        }
    }catch(err){
        res.status(500).json({message: err.massage});
    }
});

export default route;

