import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import {errorHandler} from '../helpers/dbErrorHandler';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) =>{
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    try {
        await newUser.save();
        res.status(201).json({message: 'User Created Successfully!'});
    }
    catch (err){
        next(err)
    }
};

export const signin = async (req, res, next) =>{
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Invalid Password'));

        const token = jwt.sign(
            {id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        const {password: pass, ...rest} = validUser.toObject();
        res
         .cookies('acess_token', token, {httpOnly: true})
         .status(200)
         .json(rest);
    } catch (err){
        next(err)
    }
}

export const google = async (req, res, next) =>{
    try {
        const user =  await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign(
                {id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'}
            )

            const {password: pass, ...rest} = user.toObject();
            res
             .cookie('access_token', token, {httpOnly: true})
             .status(200)
             .json(rest);
        }
        else{
            const genereatedPassword = 
             Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const hashedPassword= bcryptjs.hashSync(generatedPassword, 10);
            const newUser  = newUser({
                username: 
                 req.body.name.split(' ').join('').toLowerCase() + 
                 Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo, 
             });
            await newUser.save();
            const token = jwt.sign({is: mewUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            const {password: pass, ...rest} = newUser.toObject();
            res
             .cookie('access_token', token, {httpOnly:true})
             .status(201)
             .json(rest);
        } 
        } catch (error){
            next(error)
    }
};

export const signout = async(req, res, next) =>{
    try{
        res.clearCookie('access_token');
        res.status(200).json("User has been logged out");
    } catch (error){
        next(error);
    }
}

