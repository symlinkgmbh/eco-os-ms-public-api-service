/**
 * Copyright 2018-2020 Symlink GmbH
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




import { injectFederationClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, PkApi, MsFederation } from "@symlinkde/eco-os-pk-models";
import { Request } from "express";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";

@injectFederationClient
export class FederationController {
  private federationClient!: PkCore.IEcoFederationClient;

  public async procesFederationRequest(req: Request): Promise<PkApi.IApiResponse> {
    try {
      Log.log("process federation handshake", LogLevel.info);
      Log.log("payload", LogLevel.info);
      Log.log(req.body, LogLevel.info);

      const { encryptedEmail, encryptedDomain } = req.body;
      return ApiResponseBuilder.buildApiResponse(
        await this.federationClient.getUserKeys(encryptedEmail, encryptedDomain),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async receiveRemoteConent(req: Request): Promise<PkApi.IApiResponse> {
    try {
      Log.log("receive federation content", LogLevel.info);
      Log.log("payload", LogLevel.info);
      Log.log(req.body, LogLevel.info);

      return ApiResponseBuilder.buildApiResponse(
        await this.federationClient.receiveRemoteContent(req.body as MsFederation.IFederationPostObject),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deliverRemoteContent(req: Request): Promise<PkApi.IApiResponse> {
    try {
      Log.log("deliver federation content", LogLevel.info);
      Log.log("payload", LogLevel.info);
      Log.log(req.body, LogLevel.info);

      const { checksum, domain } = req.body;
      return ApiResponseBuilder.buildApiResponse(await this.federationClient.deliverRemoteContent(checksum, domain));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
