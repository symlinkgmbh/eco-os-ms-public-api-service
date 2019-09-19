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



import { injectFederationClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, PkApi } from "@symlinkde/eco-os-pk-models";
import { Request } from "express";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";

@injectFederationClient
export class FederationController {
  private federationClient!: PkCore.IEcoFederationClient;

  public async procesFederationRequest(req: Request): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.federationClient.getUserKeys(req.body.encryptedEmail, req.body.encryptedDomain),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
