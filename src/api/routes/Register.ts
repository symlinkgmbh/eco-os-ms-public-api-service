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



import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Response, NextFunction } from "express";
import { UserController } from "../controllers/UserController";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { CaptchaController } from "../controllers";

@injectValidatorService
export class RegisterRoute extends AbstractRoutes implements PkApi.IRoute {
  private userController: UserController;
  private captchaService: CaptchaController;
  private validatorService!: PkApi.IValidator;
  private registerPattern: PkApi.IValidatorPattern = {
    email: "",
  };

  constructor(app: Application) {
    super(app);
    this.userController = new UserController();
    this.captchaService = new CaptchaController();
    this.activate();
  }

  public activate(): void {
    this.createUser();
  }

  private createUser(): void {
    this.getApp()
      .route("/api/v1/register")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.registerPattern, [
          {
            field: "email",
            minLength: 4,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.captchaService
          .validateCaptcha(req)
          .then(() => {
            this.userController
              .createUser(req)
              .then((result) => {
                res.send(result.data);
              })
              .catch((err) => {
                next(err);
              });
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
