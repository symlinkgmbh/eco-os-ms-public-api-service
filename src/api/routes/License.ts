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
import { LicenseController } from "../controllers/LicenseController";

@injectValidatorService
export class LicenseRoute extends AbstractRoutes implements PkApi.IRoute {
  private licenseController: LicenseController = new LicenseController();
  private validatorService!: PkApi.IValidator;
  private postLicensePattern: PkApi.IValidatorPattern = {
    license: "",
  };

  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.addLicense();
    this.checkLicense();
    this.loadLicense();
    this.loadLicensePublicKey();
    this.removeLicense();
    this.checkLicenseLight();
  }

  private addLicense(): void {
    this.getApp()
      .route("/api/v1/licensing")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postLicensePattern, [
          {
            field: "license",
            minLength: 15,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.licenseController
          .addLicense(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private checkLicense(): void {
    this.getApp()
      .route("/api/v1/licensing/check")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.licenseController
          .checkLicense()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadLicense(): void {
    this.getApp()
      .route("/api/v1/licensing")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.licenseController
          .loadLicense()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadLicensePublicKey(): void {
    this.getApp()
      .route("/api/v1/licensing/publickey")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.licenseController
          .loadLicensePublicKey()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeLicense(): void {
    this.getApp()
      .route("/api/v1/licensing")
      .delete((req: Request, res: Response, next: NextFunction) => {
        this.licenseController
          .removeLicense()
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private checkLicenseLight(): void {
    this.getApp()
      .route("/api/v1/licensing/check/light")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.licenseController
          .checkLicenseLight()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
