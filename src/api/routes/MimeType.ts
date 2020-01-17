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
import { Application, Response, NextFunction } from "express";
import { MimeTypeController } from "../controllers";

export class MimeTypeRoute extends AbstractRoutes implements PkApi.IRoute {
  private mimeTypeController: MimeTypeController = new MimeTypeController();

  constructor(app: Application) {
    super(app);
    this.activate();
  }
  public activate(): void {
    this.getMimeType();
  }

  private getMimeType(): void {
    this.getApp()
      .route("/api/v1/mimetype/:extension")
      .get((req: MsOverride.IRequest, res: Response, next: NextFunction) => {
        const type = this.mimeTypeController.getMimeTypeForFilExtension(req.params.extension);
        res.send(type);
      });
  }
}
