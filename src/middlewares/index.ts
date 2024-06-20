import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const validationResult = schema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      errors: validationResult.error.errors.map(err => ({
        path: err.path,
        message: err.message
      }))
    });
  }

  next();
};

export { validateRequest };