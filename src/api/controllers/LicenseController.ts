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
import { injectLicenseClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, PkApi } from "@symlinkde/eco-os-pk-models";
import { Request } from "express";

@injectLicenseClient
export class LicenseController {
  private licenseClient!: PkCore.IEcoLicenseClient;

  public async addLicense(req: Request): Promise<PkApi.IApiResponse> {
    try {
      const { license } = req.body;
      return ApiResponseBuilder.buildApiResponse(await this.licenseClient.addLicense(license));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async checkLicense(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.licenseClient.checkLicense());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async loadLicense(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.licenseClient.loadLicense());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async loadLicensePublicKey(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.licenseClient.loadLicensePublicKey());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async removeLicense(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.licenseClient.removeLicense());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async checkLicenseLight(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.licenseClient.checkLicenseLight());
    } catch (err) {
      if (!err) {
        throw new CustomRestError(err, 500);
      }

      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
