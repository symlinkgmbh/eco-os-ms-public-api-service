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
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { ContentController } from "../controllers";

@injectValidatorService
export class ContentRoute extends AbstractRoutes implements PkApi.IRoute {
  private contentController: ContentController = new ContentController();
  private validatorService!: PkApi.IValidator;
  private postContentPattern: PkApi.IValidatorPattern = {
    checksum: "",
    key: "",
  };

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.addContent();
    this.getContent();
    this.revokeOutdatedContent();
    this.getContentWithParam();
  }

  private addContent(): void {
    this.getApp()
      .route("/api/v1/content")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postContentPattern);
        this.contentController
          .addContent(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getContent(): void {
    this.getApp()
      .route("/api/v1/content")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.contentController
          .getContent(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getContentWithParam(): void {
    this.getApp()
      .route("/api/v1/content/:checksum")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.contentController
          .getContent(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private revokeOutdatedContent(): void {
    this.getApp()
      .route("/api/v1/content")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.contentController
          .revokeOutdatedContent(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
