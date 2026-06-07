import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

export async function register({ email, password, fullName, phone }) {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new AppError('Email already registered', 409, 'CONFLICT');
  }

  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash: password,
    fullName,
    phone,
    roles: ['customer'],
  });

  const tokens = generateTokens(user);

  // Store refresh token
  user.refreshTokens.push({
    token: tokens.refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  return {
    user: user.toSafeObject(),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED');
  }

  const tokens = generateTokens(user);

  // Store refresh token
  user.refreshTokens.push({
    token: tokens.refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  return {
    user: user.toSafeObject(),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function refreshToken(token) {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'TOKEN_EXPIRED');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError('User not found', 401, 'UNAUTHORIZED');
  }

  // Check if this refresh token is still valid (not revoked)
  const stored = user.refreshTokens.find((rt) => rt.token === token);
  if (!stored) {
    // Token was revoked — possible token reuse, revoke all tokens for safety
    user.refreshTokens = [];
    await user.save();
    throw new AppError('Refresh token has been revoked', 401, 'UNAUTHORIZED');
  }

  // Rotate: remove old, issue new
  user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== token);

  const tokens = generateTokens(user);
  user.refreshTokens.push({
    token: tokens.refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
}

export async function logout(userId, refreshToken) {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    await user.save();
  }
}

export async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  return user.toSafeObject();
}

function generateTokens(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    roles: user.roles,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}
