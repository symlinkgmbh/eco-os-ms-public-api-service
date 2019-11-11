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



import { ICaptchaService, ICaptchaResponse } from "../../infrastructure/captcha";
import { CaptchaService } from "../../infrastructure/captcha/CaptchaService";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { Request } from "express";

export class CaptchaController {
  private captchaService: ICaptchaService;

  constructor() {
    this.captchaService = new CaptchaService();
  }

  public async getCaptcha(): Promise<ICaptchaResponse> {
    return this.captchaService.buildCaptcha();
  }

  public async validateCaptcha(req: Request): Promise<void> {
    if (!(await this.captchaService.validateCaptcha(req))) {
      // add C855 error
      throw new CustomRestError(
        {
          code: 403,
          message: "Captcha is not valid",
        },
        403,
      );
    }
    return;
  }
}
