import {Request, Response, NextFunction} from 'express';
import{ZodError} from 'zod';
import {AppError} from '../errors/AppError.js';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): Response { 
    // Handle validation errors from Zod                       
    if (err instanceof ZodError) {
        return res.status(400).json({
            err:'Validation error',
            details: err.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }))
        });
    }
    // Handle custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            err: 'Application error',
            message: err.message,
            details: err.details,
        });
    }

// Handle unexpected errors
    console.error('Unexpected error:', err);
    return res.status(500).json({
        err: 'Internal server error',
    });   
}
