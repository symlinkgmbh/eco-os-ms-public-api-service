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



import { injectAuthClient } from "@symlinkde/eco-os-pk-core";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { PkCore, MsAuth, PkApi } from "@symlinkde/eco-os-pk-models";

@injectAuthClient
export class AuthenticatioController {
  private authRequest: MsAuth.IAuthenticationRequest;
  private authClient!: PkCore.IEcoAuthClient;

  constructor(request: MsAuth.IAuthenticationRequest) {
    this.authRequest = request;
  }

  public async authenticate(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.authClient.authenticate(this.authRequest));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
