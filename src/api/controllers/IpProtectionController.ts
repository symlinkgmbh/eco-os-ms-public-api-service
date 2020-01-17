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




import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { injectIpProtectionClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";

@injectIpProtectionClient
export class IpProtectionController {
  private ipProtectionClient!: PkCore.IEcoIpProtectionClient;

  public async add(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      const { address, deny } = req.body;
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.add(address, deny));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getEntryById(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.getEntryById(req.params.id));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getEntryByIp(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.getEntryByIp(encodeURI(req.params.ip)));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getAllEntries(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.getAllEntries());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getAllWhitelistEntries(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.getAllWhitelistEntries());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getAllBlacklistEntries(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.getAllBlacklistEntries());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async updateEntryById(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      const { address, deny } = req.body;
      return ApiResponseBuilder.buildApiResponse(
        await this.ipProtectionClient.updateEntryById(req.params.id, address, deny),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteEntryById(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.deleteEntryById(req.params.id));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteBlacklist(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.deleteBlacklist());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteWhitelist(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.deleteWhitelist());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getMetrics(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.ipProtectionClient.getMetrics());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async searchIpAddress(req: MsOverride.IRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.ipProtectionClient.extendedIpSearch(decodeURI(req.params.address)),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
