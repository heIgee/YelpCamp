import mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    // passportLocalMongoose generates username, salt, hash fields
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;
