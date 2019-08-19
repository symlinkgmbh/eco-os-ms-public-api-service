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
import { PkApi, MsAuth } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { AuthenticatioController } from "../controllers/AuthenticationController";

@injectValidatorService
export class AuthenticationRoute extends AbstractRoutes implements PkApi.IRoute {
  private validatorService!: PkApi.IValidator;
  private postAuthPattern: PkApi.IValidatorPattern = {
    email: "",
    password: "",
  };

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.authenticate();
  }

  private authenticate(): void {
    this.getApp()
      .route("/api/v1/authenticate")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postAuthPattern);
        const authController = new AuthenticatioController(req.body as MsAuth.IAuthenticationRequest);
        authController
          .authenticate()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
