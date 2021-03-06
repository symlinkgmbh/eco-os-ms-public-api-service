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
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { FederationController } from "../controllers";

@injectValidatorService
export class FederationRoute extends AbstractRoutes implements PkApi.IRoute {
  private federationController: FederationController;
  private validatorService!: PkApi.IValidator;
  private postFederationUserRequestService: PkApi.IValidatorPattern = {
    encryptedEmail: "",
    encryptedDomain: "",
  };

  private postFederationContentPattern: PkApi.IValidatorPattern = {
    checksum: "",
    domain: "",
  };

  private postFederationDeliverContent: PkApi.IValidatorPattern = {
    checksum: "",
    domain: "",
  };

  constructor(app: Application) {
    super(app);
    this.federationController = new FederationController();
    this.activate();
  }

  public activate(): void {
    this.getUsersKeysByEmail();
    this.recieveContent();
    this.deliverContent();
  }

  private getUsersKeysByEmail(): void {
    this.getApp()
      .route("/api/v1/federation/user")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postFederationUserRequestService, [
          {
            field: "encryptedEmail",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
          {
            field: "encryptedDomain",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.federationController
          .procesFederationRequest(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private recieveContent(): void {
    this.getApp()
      .route("/api/v1/federation/content")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postFederationContentPattern, [
          {
            field: "checksum",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
          {
            field: "domain",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.federationController
          .receiveRemoteConent(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deliverContent(): void {
    this.getApp()
      .route("/api/v1/federation/deliver")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postFederationDeliverContent, [
          {
            field: "checksum",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
          {
            field: "domain",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.federationController
          .deliverRemoteContent(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
