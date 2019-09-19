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



import { AbstractRoutes } from "@symlinkde/eco-os-pk-api";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Response, NextFunction } from "express";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { MeController } from "../controllers/MeController";

export class MeRoute extends AbstractRoutes implements PkApi.IRoute {
  private meController: MeController;

  constructor(app: Application) {
    super(app);
    this.meController = new MeController();
    this.activate();
  }

  public activate(): void {
    this.loadMe();
    this.deleteMe();
  }

  private loadMe(): void {
    this.getApp()
      .route("/api/v1/me")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.meController
          .loadMe(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
    return;
  }

  private deleteMe(): void {
    this.getApp()
      .route("/api/v1/me")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.meController
          .prepareUserForDeletion(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
    return;
  }
}
