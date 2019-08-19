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

import { injectRedisClient } from "@symlinkde/eco-os-pk-redis";
import { ICaptchaResponse } from "./ICaptchaResponse";
import { StaticCaptcha } from "./StaticCaptcha";
import { ICaptchaStore } from "./ICaptchaStore";
import { ICaptchaService } from "./ICaptchaService";
import { MsConf, PkCore, PkRedis } from "@symlinkde/eco-os-pk-models";
import { injectConfigClient } from "@symlinkde/eco-os-pk-core";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { Request } from "express";

@injectConfigClient
@injectRedisClient
export class CaptchaService implements ICaptchaService {
  private redisClient!: PkRedis.IRedisClient;
  private configClient!: PkCore.IEcoConfigClient;

  public async buildCaptcha(): Promise<ICaptchaResponse> {
    const result = await this.loadCaptchaConfig();
    if (!result.active) {
      throw new CustomRestError(
        {
          code: 400,
          message: "Captcha is not active",
        },
        400,
      );
    }
    const captcha = StaticCaptcha.getCaptcha();
    const token = this.createCaptchaToken();
    this.redisClient.set(token, { result: captcha.text }, 120);
    return <ICaptchaResponse>{
      token,
      data: captcha.data,
    };
  }

  public async validateCaptcha(req: Request): Promise<boolean> {
    const result = await this.loadCaptchaConfig();
    if (!result.active) {
      return true;
    }

    const token = req.header("x-captcha-token");
    const solution = req.header("x-captcha-result");

    if (token === undefined || solution === undefined) {
      throw new CustomRestError(
        {
          code: 400,
          message: "Missing captcha validation headers",
        },
        400,
      );
    }

    const entry = await this.redisClient.get<ICaptchaStore>(token);
    if (!entry) {
      return false;
    }

    if (entry.result !== solution) {
      return false;
    }

    return true;
  }

  private async loadCaptchaConfig(): Promise<MsConf.ICaptchaConfig> {
    const loadedConfig = await this.configClient.get("captcha");
    return <MsConf.ICaptchaConfig>Object(loadedConfig.data.captcha);
  }

  private createCaptchaToken(): string {
    return `ctc.${this.s4()}-${this.s4()}-${this.s4()}-${this.s4()}`;
  }

  private s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
