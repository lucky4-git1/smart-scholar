import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../database/prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function signToken(user: { id: string; email: string; role: string; fullName: string }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.ss_token) {
      token = req.cookies.ss_token;
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwtSecret) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    // Invalid or expired token; continue as unauthenticated
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this resource.',
    });
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: insufficient permissions for this operation.',
      });
    }
    next();
  };
}

export async function requireOrgAccess(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const orgId = req.params.orgId || req.body.organizationId || (req.query.orgId as string);
  if (!orgId) {
    return res.status(400).json({ success: false, error: 'Organization ID is required.' });
  }

  // Admins have global access
  if (req.user.role === 'ADMIN') {
    return next();
  }

  const membership = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: req.user.id,
      },
    },
  });

  if (!membership) {
    return res.status(403).json({
      success: false,
      error: 'You are not an authorized member of this organization.',
    });
  }

  next();
}
