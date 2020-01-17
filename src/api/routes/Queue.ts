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
import { PkApi, MsOverride } from "@symlinkde/eco-os-pk-models";
import { Application } from "express-serve-static-core";
import { Response, NextFunction } from "express";
import { QueueController } from "../controllers";

export class QueueRoute extends AbstractRoutes implements PkApi.IRoute {
  private queueController: QueueController = new QueueController();
  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.getAllJobs();
    this.getJobById();
  }

  private getAllJobs(): void {
    this.getApp()
      .route("/api/v1/queue")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.queueController
          .getJobs()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getJobById(): void {
    this.getApp()
      .route("/api/v1/queue/:id")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        this.queueController
          .getJobById(req.params.id)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
