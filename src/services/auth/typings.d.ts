// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id?: number;
    name?: string;
    username?: string;
    avatar?: string;
    role?: string;
    roleId?: number;
    access?: string;
    email?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    token?: string;
    user?: CurrentUser;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    errorCode: string;
    errorMessage?: string;
    success?: boolean;
  };

  type ChangePasswordParams = {
    oldPassword?: string;
    newPassword?: string;
  };
}
