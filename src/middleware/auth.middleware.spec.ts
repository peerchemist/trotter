jest.mock('../config/config.ts');
import config from '../config/config';
import { auth } from './auth.middleware';
import { createRequest, createResponse } from 'node-mocks-http';

describe('AuthMiddleware', () => {
  const responseMock = createResponse();

  jest.spyOn(responseMock, 'status');
  jest.spyOn(responseMock, 'json');
  const nextMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should bypass when correct credentials are passed', () => {
    const authorizationHeader = `Basic ${Buffer.from(
      `${config.adminUsername}:${config.adminPassword}`,
    ).toString('base64')}`;
    auth(
      createRequest({ headers: { authorization: authorizationHeader } }),
      responseMock,
      nextMock,
    );
    expect(responseMock.status).not.toHaveBeenCalled();
    expect(responseMock.json).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
  });

  it('should fail when authorization header is missing', () => {
    auth(createRequest(), responseMock, nextMock);
    expect(responseMock.status).lastCalledWith(401);
  });

  it('should fail when authorization header is missing Basic claim', () => {
    const authorizationHeader = `${Buffer.from(
      `${config.adminUsername}:${config.adminPassword}`,
    ).toString('base64')}`;
    auth(
      createRequest({ headers: { authorization: authorizationHeader } }),
      responseMock,
      nextMock,
    );
    expect(responseMock.status).toHaveBeenCalledTimes(1);
    expect(responseMock.json).toHaveBeenCalled();
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('should fail authorization when password is wrong', () => {
    const authorizationHeader = `Basic ${Buffer.from(
      `${config.adminUsername}:${config.adminPassword}fail`,
    ).toString('base64')}`;
    auth(
      createRequest({ headers: { authorization: authorizationHeader } }),
      responseMock,
      nextMock,
    );
    expect(responseMock.status).toHaveBeenCalledTimes(1);
    expect(responseMock.json).toHaveBeenCalled();
    expect(responseMock.status).lastCalledWith(401);
  });

  it('should fail authorization when username is wrong', () => {
    const authorizationHeader = `Basic ${Buffer.from(
      `${config.adminUsername}fail:${config.adminPassword}`,
    ).toString('base64')}`;
    auth(
      createRequest({ headers: { authorization: authorizationHeader } }),
      responseMock,
      nextMock,
    );
    expect(responseMock.status).toHaveBeenCalled();
    expect(responseMock.json).toHaveBeenCalled();
    expect(responseMock.status).lastCalledWith(401);
  });
})
