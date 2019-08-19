/** 
* Copyright 2018-2019 Symlink GmbH 
* 
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License. 
* You may obtain a copy of the License at 
*  
*     http://www.apache.org/licenses/LICENSE-2.0 
* 
* Unless required by applicable law or agreed to in writing, software 
* distributed under the License is distributed on an "AS IS" BASIS, 
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
* See the License for the specific language governing permissions and 
* limitations under the License. 
* 
*/ 

import { injectUserClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, PkApi, PkHooks, PkAcl, MsUser } from "@symlinkde/eco-os-pk-models";
import { ApiResponseBuilder, CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { injectIAclProcessor } from "@symlinkde/eco-os-pk-acl";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { injectUserHooks } from "@symlinkde/eco-os-pk-hooks";
import { IRegisterValidator, RegisterValidator } from "../../infrastructure/register";
import { Request } from "express";
import { CryptionUtils } from "@symlinkde/eco-os-pk-crypt";

@injectUserHooks
@injectUserClient
@injectIAclProcessor
export class UserController {
  public userHooks!: PkHooks.IUserHooks;
  private userClient!: PkCore.IEcoUserClient;
  private aclProcessor!: PkAcl.IAclProcessor;
  private registrationValidator: IRegisterValidator;

  public constructor() {
    this.registrationValidator = new RegisterValidator();
  }

  public async loadUserById(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.loadUserById(req.params.id);
      const processedObject = await this.aclProcessor.processObject<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processedObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async loadUserByEmail(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.loadUserByEmail(req.params.mail);
      const processedObject = await this.aclProcessor.processObject<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processedObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async loadUserByEmailFromToken(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.loadUserByEmail(req.decriptedToken.email);
      const processedObject = await this.aclProcessor.processObject<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processedObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async createUser(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    const isRegistrationAllowed = await this.registrationValidator.isRegistrationAllowed(req);

    if (!isRegistrationAllowed) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C809.code,
          message: apiResponseCodes.C809.message,
        },
        400,
      );
    }

    const processEulaResult = await this.registrationValidator.processEula(req);
    if (!processEulaResult) {
      throw new CustomRestError(
        {
          code: 400,
          message: "please accept our terms and conditions",
        },
        400,
      );
    }

    try {
      const result = await this.userClient.createUser(<MsUser.ICreateUserModel>req.body);
      const queueResult = await this.userHooks.afterCreate(result.data);
      result.data.queueId = queueResult.data.id;
      return ApiResponseBuilder.buildApiResponse(result);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
  public async updateUserById(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.updateUserById(req.params.id, <MsUser.IUpdateUserModel>req.body);
      const processedObject = await this.aclProcessor.processObject<MsUser.IUser>("user", result.data);
      return ApiResponseBuilder.buildApiResponse(result, processedObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async updateUserByIdFromToken(id: string, req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.updateUserById(id, <MsUser.IUpdateUserModel>req.body);
      const processedObject = await this.aclProcessor.processObject<MsUser.IUser>("user", result.data);
      return ApiResponseBuilder.buildApiResponse(result, processedObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteUserById(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const response = await this.userClient.loadUserById(req.params.id);
      const result = await this.userClient.deleteUserById(req.params.id);
      this.userHooks.afterDeleteAccount(response.data.email);
      return ApiResponseBuilder.buildApiResponse(result);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteUserByIdFromToken(id: string, req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.deleteUserById(id);
      return ApiResponseBuilder.buildApiResponse(result);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async loadAllUsers(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.loadAllUsers();
      const processObject = await this.aclProcessor.processObjects<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async sendForgotPasswordRequest(obj: MsUser.IForgotPasswordRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.sendForgotPasswordRequest(obj);
      result.data.email = obj.email;
      this.userHooks.afterForgotPassword(result.data, result.data.otp);
      return ApiResponseBuilder.buildApiResponse(result);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async sendChangePasswordRequest(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.sendForgotPasswordRequest(<MsUser.IForgotPasswordRequest>{
        email: req.decriptedToken.email,
      });
      result.data.email = req.decriptedToken.email;
      this.userHooks.afterChangePassword(result.data, result.data.otp);
      return ApiResponseBuilder.buildApiResponse(result);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async sendAndUpdatePassword(obj: MsUser.IForgotPasswordUpdateRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.sendAndUpdatePassword(obj);
      return ApiResponseBuilder.buildApiResponse(result);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async searchUsers(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.searchUsers(req.params.query);
      const processObject = await this.aclProcessor.processObjects<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async importUsers(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.importUsers(<MsUser.IImportRequest>req.body);
      const processObject = await this.aclProcessor.processObjects<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async prepareUserForDeletion(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.prepareUserForDelete(req.decriptedToken.email);
      const processObject = await this.aclProcessor.processObject<MsUser.IUser>(req.decriptedToken.role, result.data);
      this.userHooks.beforeDeleteHook(req.decriptedToken.email, result.data.deleteId);
      return ApiResponseBuilder.buildApiResponse(result, processObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteUserByDeleteId(req: Request): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.userClient.deleteUserByDeleteId(req.body.deleteId));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async addApiKey(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.userClient.addKeyToUser(req.decriptedToken._id, req.body.apiKey),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async removeApiKey(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.userClient.removeKeyFromUser(req.decriptedToken._id, req.body.apiKey),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async removeAllApiKeys(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.userClient.removeAllKeysFromUser(req.decriptedToken._id));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public generateApiKey(): object {
    try {
      return {
        apiKey: CryptionUtils.generateApiKey(),
      };
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
