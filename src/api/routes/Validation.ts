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




import { AbstractRoutes } from "@symlinkde/eco-os-pk-api";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { ValidationController } from "../controllers";

export class ValidationRoute extends AbstractRoutes implements PkApi.IRoute {
  private validationController: ValidationController;

  constructor(app: Application) {
    super(app);
    this.validationController = new ValidationController();
    this.activate();
  }

  public activate(): void {
    this.validateActivationId();
    this.validateForgotPasswordId();
    this.validateDeleteId();
  }

  private validateForgotPasswordId(): void {
    this.getApp()
      .route("/api/v1/validation/forgot/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.validationController
          .validateForgotPasswordId(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private validateActivationId(): void {
    this.getApp()
      .route("/api/v1/validation/activate/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.validationController
          .validateActivationId(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private validateDeleteId(): void {
    this.getApp()
      .route("/api/v1/validation/delete/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.validationController
          .validateDeleteId(req)
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
