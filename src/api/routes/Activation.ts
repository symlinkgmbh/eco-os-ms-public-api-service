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
import { Application, Request, Response, NextFunction } from "express";
import { ActivationController } from "../controllers/ActivationController";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";

@injectValidatorService
export class ActivationRoute extends AbstractRoutes implements PkApi.IRoute {
  private activationController: ActivationController;
  private validatorService!: PkApi.IValidator;
  private activationPattern: PkApi.IValidatorPattern = {
    activationId: "",
    password: "",
    confirmPassword: "",
  };

  constructor(app: Application) {
    super(app);
    this.activationController = new ActivationController();
    this.activate();
  }

  public activate(): void {
    this.activateAccount();
    this.deactivateAccount();
  }

  private activateAccount(): void {
    this.getApp()
      .route("/api/v1/activation/activate")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.activationPattern);
        this.activationController
          .activateUser(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deactivateAccount(): void {
    this.getApp()
      .route("/api/v1/deactivation/deactivate/:id")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.activationController
          .deactivateUser(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
