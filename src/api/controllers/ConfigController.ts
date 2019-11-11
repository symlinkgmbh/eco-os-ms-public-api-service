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



import { injectConfigClient } from "@symlinkde/eco-os-pk-core";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { certContainer, ICertService, certTypes } from "../../infrastructure/cert";
import { PkCore, MsConf, PkApi } from "@symlinkde/eco-os-pk-models";

@injectConfigClient
export class ConfigController {
  private configClient!: PkCore.IEcoConfigClient;

  public async set(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const { body } = req;
      return ApiResponseBuilder.buildApiResponse(await this.configClient.set(<MsConf.IConfigEntry>body));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async get(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const { id } = req.params;
      return await this.configClient.get(id);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async update(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const { key, content } = req.body;
      return await this.configClient.update(<MsConf.IConfigEntry>{ key, content });
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async delete(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      const { id } = req.params;
      return await this.configClient.delete(id);
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getAll(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.configClient.getAll());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async deleteAll(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.configClient.deleteAll());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async buildFrontendConfig(): Promise<object> {
    try {
      const loadCaptchConfig = await this.configClient.get("captcha");
      const captchaConfig: MsConf.ICaptchaConfig = <MsConf.ICaptchaConfig>Object(loadCaptchConfig.data.captcha);

      const loadPasswordConfig = await this.configClient.get("policies");
      const passwordPolicy: MsConf.IPoliciesConfig = <MsConf.IPoliciesConfig>Object(loadPasswordConfig.data.policies);

      const runningConfig = await this.configClient.getRunningConfig();

      const cert: ICertService = certContainer.get<ICertService>(certTypes.ICertService);

      const publicKeyPem = await cert.getPublicKeyPem();
      let publicKey = null;

      if (passwordPolicy.enableApiEncryption) {
        publicKey = Buffer.from(publicKeyPem).toString("base64");
      }

      return {
        captcha: captchaConfig,
        password: passwordPolicy.password,
        passwordDescriptionLocalized: passwordPolicy.passwordDescriptionLocalized,
        passwordDescritpion: passwordPolicy.passwordDescritpion,
        passwordPolicyBase64: Buffer.from(new RegExp(passwordPolicy.password).toString()).toString("base64"),
        publicKey,
        allowAccessByApiKeys: passwordPolicy.allowAccessByApiKeys,
        shouldAcceptEula: passwordPolicy.shouldAcceptEula,
        eulaURL: passwordPolicy.eulaURL,
        features: runningConfig.data,
      };
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async loadSingleServiceConf(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(
        await this.configClient.getRunningConfigFromSingleService(req.params.name),
      );
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
