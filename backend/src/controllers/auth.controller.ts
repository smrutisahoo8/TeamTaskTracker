import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { createSuccessResponse, createErrorResponse } from '../utils/response.util';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, organizationId } = req.body;

    const user = await authService.register(fullName, email, password, organizationId);

    return res.status(201).json(createSuccessResponse('User registered successfully', user));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return res.status(400).json(
      createErrorResponse(400, 'REGISTRATION_ERROR', message)
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json(createSuccessResponse('Login successful', result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return res.status(401).json(
      createErrorResponse(401, 'AUTHENTICATION_ERROR', message)
    );
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json(createSuccessResponse('Token refreshed successfully', result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token refresh failed';
    return res.status(401).json(
      createErrorResponse(401, 'TOKEN_ERROR', message)
    );
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    return res.status(200).json(createSuccessResponse('Logout successful'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return res.status(400).json(
      createErrorResponse(400, 'LOGOUT_ERROR', message)
    );
  }
};
