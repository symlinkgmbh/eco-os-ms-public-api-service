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

import { injectKeyClient } from "@symlinkde/eco-os-pk-core";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { PkCore, PkApi, MsKey } from "@symlinkde/eco-os-pk-models";

@injectKeyClient
export class KeyController {
  public keyClient!: PkCore.IEcoKeyClient;

  public async getUsersKeyByEmail(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.keyClient.loadUsersKeyByEmail({ email: req.params.email }));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async revokeKeysFromUserByKey(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.keyClient.revokeKeysFromUserByKey({ pubKey: req.params.pubKey }),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async revokeKeyFromUserByDeviceId(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.keyClient.revokeKeyFromUserByDeviceId({ deviceId: req.params.deviceId }),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async revokeAllKeys(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.keyClient.revokeAllKeys());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async addKeyToUserByEmail(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.keyClient.addKeyToUserByEmail(<MsKey.IKey>{
          deviceId: req.body.deviceId,
          email: req.body.email,
          pubKey: req.body.pubKey,
        }),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
