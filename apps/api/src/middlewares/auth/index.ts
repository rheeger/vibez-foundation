/**
 * Authentication and Authorization Middleware
 * 
 * This module exports various middleware functions for handling
 * authentication and authorization in the application.
 */

import { jwtAuthenticate } from './jwtAuth';
import { validateRole } from './validateRole';

export {
  jwtAuthenticate,
  validateRole
}; 