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
import { KeyController } from "../controllers";

@injectValidatorService
export class KeyRoute extends AbstractRoutes implements PkApi.IRoute {
  private keyController: KeyController = new KeyController();
  private validatorService!: PkApi.IValidator;
  private postKeyPattern: PkApi.IValidatorPattern = {
    pubKey: "",
    deviceId: "",
    email: "",
  };

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.getUsersKeysByEmail();
    this.revokeKeysFromUserByKey();
    this.revokeKeyFromUserByDeviceId();
    this.revokeAllKeys();
    this.addKeyToUserByEmail();
  }

  private getUsersKeysByEmail(): void {
    this.getApp()
      .route("/api/v1/key/:email")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.keyController
          .getUsersKeyByEmail(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private revokeKeysFromUserByKey(): void {
    this.getApp()
      .route("/api/v1/revoke/key/:pubKey")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.keyController
          .revokeKeysFromUserByKey(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private revokeKeyFromUserByDeviceId(): void {
    this.getApp()
      .route("/api/v1/revoke/device/:deviceId")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.keyController
          .revokeKeyFromUserByDeviceId(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private revokeAllKeys(): void {
    this.getApp()
      .route("/api/v1/keys")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.keyController
          .revokeAllKeys()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private addKeyToUserByEmail(): void {
    this.getApp()
      .route("/api/v1/key")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postKeyPattern);
        this.keyController
          .addKeyToUserByEmail(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
