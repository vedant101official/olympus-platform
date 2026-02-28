import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User  from '../users/user.model';
import { env } from '../../core/config/env';

interface LoginInput {
    email: string;
    password: string;
    tenantId: string;
}

export const LoginUser = async ({email, password, tenantId}: LoginInput) => {
    const user = await User.findOne({ email, tenantId }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        {
            userId: user._id,
            tenantId: user.tenantId,
            role: user.role
        },
        env.JWT_SECRET!,
        { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    )

    return token;

}