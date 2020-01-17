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
import { IpProtectionController } from "../controllers/IpProtectionController";

@injectValidatorService
export class IpProtectionRoute extends AbstractRoutes implements PkApi.IRoute {
  private ipProtectionController: IpProtectionController = new IpProtectionController();
  private validatorService!: PkApi.IValidator;
  private postIpPattern: PkApi.IValidatorPattern = {
    address: "",
    deny: "",
  };
  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.addEntry();
    this.getAllEntries();
    this.getAllBlacklistEntries();
    this.getAllWhitelistEntries();
    this.getEntry();
    this.updateEntry();
    this.deleteEntry();
    this.deleteBlacklist();
    this.deleteWhitelist();
    this.loadAddress();
    this.getIpMetrics();
    this.searchIpAddress();
  }

  private addEntry(): void {
    this.getApp()
      .route("/api/v1/protection")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postIpPattern, [
          {
            field: "address",
            minLength: 5,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.ipProtectionController
          .add(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAllEntries(): void {
    this.getApp()
      .route("/api/v1/protection")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .getAllEntries()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAllBlacklistEntries(): void {
    this.getApp()
      .route("/api/v1/protection/blacklist")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .getAllBlacklistEntries()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getAllWhitelistEntries(): void {
    this.getApp()
      .route("/api/v1/protection/whitelist")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .getAllWhitelistEntries()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getEntry(): void {
    this.getApp()
      .route("/api/v1/protection/address/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .getEntryById(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updateEntry(): void {
    this.getApp()
      .route("/api/v1/protection/address/:id")
      .put((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .updateEntryById(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteEntry(): void {
    this.getApp()
      .route("/api/v1/protection/address/:id")
      .delete((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .deleteEntryById(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteBlacklist(): void {
    this.getApp()
      .route("/api/v1/protection/blacklist")
      .delete((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .deleteBlacklist()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteWhitelist(): void {
    this.getApp()
      .route("/api/v1/protection/whitelist")
      .delete((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .deleteWhitelist()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadAddress(): void {
    this.getApp()
      .route("/api/v1/protection/search/:ip")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .getEntryByIp(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getIpMetrics(): void {
    this.getApp()
      .route("/api/v1/protection/metrics")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .getMetrics()
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private searchIpAddress(): void {
    this.getApp()
      .route("/api/v1/protection/address/search/:address")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.ipProtectionController
          .searchIpAddress(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
