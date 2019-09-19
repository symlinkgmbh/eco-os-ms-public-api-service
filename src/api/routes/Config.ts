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
import { ConfigController } from "../controllers/ConfigController";

export class ConfigRoute extends AbstractRoutes implements PkApi.IRoute {
  private configController: ConfigController = new ConfigController();

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.setConfig();
    this.getConfig();
    this.updateConfig();
    this.deleteConfig();
    this.getAllConfig();
    this.deleteAllConfig();
    this.loadFrontendConfig();
  }

  private setConfig(): void {
    this.getApp()
      .route("/api/v1/config")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .set(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getConfig(): void {
    this.getApp()
      .route("/api/v1/config/:id")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .get(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updateConfig(): void {
    this.getApp()
      .route("/api/v1/config")
      .put((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .update(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteConfig(): void {
    this.getApp()
      .route("/api/v1/config/:id")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .delete(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAllConfig(): void {
    this.getApp()
      .route("/api/v1/config")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .getAll()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteAllConfig(): void {
    this.getApp()
      .route("/api/v1/config")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .deleteAll()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadFrontendConfig(): void {
    this.getApp()
      .route("/api/v1/config/load/client")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.configController
          .buildFrontendConfig()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
