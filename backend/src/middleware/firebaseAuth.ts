import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  uid?: string;
}

export const verificarAutenticacao = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Token de autenticação não informado.',
      });
    }

    const token = authorization.split(' ')[1];

    const decodedToken = await adminAuth.verifyIdToken(token);

    req.uid = decodedToken.uid;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido ou expirado.',
    });
  }
};