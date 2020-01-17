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




import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { PkApi, MsUser } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/UserController";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";

@injectValidatorService
export class PasswordRoute extends AbstractRoutes implements PkApi.IRoute {
  private userController: UserController;
  private validatorService!: PkApi.IValidator;
  private postForgotPasswordPattern: PkApi.IValidatorPattern = {
    email: "",
  };

  private postUpdatePasswordPattern: PkApi.IValidatorPattern = {
    otp: "",
    forgotPasswordId: "",
    password: "",
    confirmPassword: "",
  };

  constructor(app: Application) {
    super(app);
    this.userController = new UserController();
    this.activate();
  }

  public activate(): void {
    this.changePassword();
    this.forgotPassword();
    this.updatePassword();
  }

  private forgotPassword(): void {
    this.getApp()
      .route("/api/v1/password/forgot")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postForgotPasswordPattern, [
          {
            field: "email",
            minLength: 4,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.userController
          .sendForgotPasswordRequest(req.body as MsUser.IForgotPasswordRequest)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private changePassword(): void {
    this.getApp()
      .route("/api/v1/change/password")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .sendChangePasswordRequest(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updatePassword(): void {
    this.getApp()
      .route("/api/v1/password/update")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postUpdatePasswordPattern, [
          {
            field: "otp",
            onlyNumber: true,
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
          {
            field: "forgotPasswordId",
            minLength: 10,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
          {
            field: "password",
            minLength: 6,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
          {
            field: "confirmPassword",
            minLength: 6,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.userController
          .sendAndUpdatePassword(req.body as MsUser.IForgotPasswordUpdateRequest)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
