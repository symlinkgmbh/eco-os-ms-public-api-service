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
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { injectIAclProcessor } from "@symlinkde/eco-os-pk-acl";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { PkCore, MsUser, PkAcl, PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";

@injectUserClient
@injectIAclProcessor
export class ActivationController {
  private userClient!: PkCore.IEcoUserClient;
  private aclProcessor!: PkAcl.IAclProcessor;

  public async activateUser(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.activeUser(<MsUser.ICreateUserModel>req.body);
      const processObject = await this.aclProcessor.processObject<MsUser.IUser>("user", result.data);
      return ApiResponseBuilder.buildApiResponse(result, processObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deactivateUser(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const result = await this.userClient.activeUser(req.params.id);
      const processObject = await this.aclProcessor.processObject<MsUser.IUser>(req.decriptedToken.role, result.data);
      return ApiResponseBuilder.buildApiResponse(result, processObject);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
