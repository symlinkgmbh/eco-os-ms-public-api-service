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
import { UserController } from "../controllers/UserController";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";

@injectValidatorService
export class AccountRoute extends AbstractRoutes implements PkApi.IRoute {
  private userController: UserController;
  private validatorService!: PkApi.IValidator;
  private postAccountPattern: PkApi.IValidatorPattern = {
    email: "",
  };

  private postCSVPattern: PkApi.IValidatorPattern = {
    file: "",
  };

  private postApikeyPattern: PkApi.IValidatorPattern = {
    apiKey: "",
  };

  constructor(app: Application) {
    super(app);
    this.userController = new UserController();
    this.activate();
  }

  public activate(): void {
    this.loadUserById();
    this.loadUserByEmail();
    this.createUser();
    this.updateUserById();
    this.deleteUserById();
    this.loadAllUsers();
    this.searchUsers();
    this.importUsers();
    this.addApiKey();
    this.generateApiKey();
    this.removeApiKey();
    this.removeAllApiKeys();
  }

  private loadUserById(): void {
    this.getApp()
      .route("/api/v1/account/:id")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .loadUserById(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadUserByEmail(): void {
    this.getApp()
      .route("/api/v1/account/email/:mail")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .loadUserByEmail(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private createUser(): void {
    this.getApp()
      .route("/api/v1/account")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postAccountPattern, [
          {
            field: "email",
            minLength: 4,
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.string,
          },
        ]);
        this.userController
          .createUser(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updateUserById(): void {
    this.getApp()
      .route("/api/v1/account/:id")
      .put((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .updateUserById(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private deleteUserById(): void {
    this.getApp()
      .route("/api/v1/account/:id")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .deleteUserById(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private loadAllUsers(): void {
    this.getApp()
      .route("/api/v1/accounts")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .loadAllUsers(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private searchUsers(): void {
    this.getApp()
      .route("/api/v1/accounts/search/:query")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .searchUsers(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private importUsers(): void {
    this.getApp()
      .route("/api/v1/accounts/import")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postCSVPattern);
        this.userController
          .importUsers(req)
          .then((result) => {
            res.send(result.data);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private addApiKey(): void {
    this.getApp()
      .route("/api/v1/account/access/apikey")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postApikeyPattern, [
          {
            field: "apiKey",
            typeCheck: true,
            targetType: PkApi.IValidatorTypes.object,
          },
        ]);
        this.userController
          .addApiKey(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private generateApiKey(): void {
    this.getApp()
      .route("/api/v1/account/access/apikey")
      .get((req: ITokenRequest, res: Response, next: NextFunction) => {
        try {
          res.send(this.userController.generateApiKey());
        } catch (err) {
          next(err);
        }
      });
  }

  private removeApiKey(): void {
    this.getApp()
      .route("/api/v1/account/access/apikey/delete")
      .post((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .removeApiKey(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private removeAllApiKeys(): void {
    this.getApp()
      .route("/api/v1/account/access/apikey/delete/all")
      .delete((req: ITokenRequest, res: Response, next: NextFunction) => {
        this.userController
          .removeAllApiKeys(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
