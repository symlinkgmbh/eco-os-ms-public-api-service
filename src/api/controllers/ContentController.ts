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

import { injectContentClient } from "@symlinkde/eco-os-pk-core";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { PkCore, PkApi } from "@symlinkde/eco-os-pk-models";

@injectContentClient
export class ContentController {
  public contentClient!: PkCore.IEcoContentClient;

  public async addContent(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.contentClient.createContent({
          checksum: req.body.checksum,
          key: req.body.key,
          domain: req.body.domain,
          liveTime: req.body.liveTime,
        }),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getContent(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      if (req.params.checksum !== undefined && req.params.checksum !== null) {
        return ApiResponseBuilder.buildApiResponse(await this.contentClient.loadContent(req.params.checksum));
      }
      return ApiResponseBuilder.buildApiResponse(await this.contentClient.loadContent(req.body.checksum));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async revokeOutdatedContent(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.contentClient.revokeOutdatedContent());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
