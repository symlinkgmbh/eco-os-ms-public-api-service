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



import { injectI18nClient } from "@symlinkde/eco-os-pk-core";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { PkCore, PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";

@injectI18nClient
export class I18nController {
  private i18nClient!: PkCore.IEcoI18nClient;

  public async getLocale(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.i18nClient.getLocale(
          String(req.header("Accept-Language") === undefined ? "en" : req.header("Accept-Language")),
          req.header("X-Language-Delimiter"),
        ),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getLocaleByKey(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.i18nClient.getLocaleEntryByKey(
          String(req.header("Accept-Language") === undefined ? "en" : req.header("Accept-Language")),
          req.params.key,
          req.header("X-Language-Delimiter"),
        ),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
