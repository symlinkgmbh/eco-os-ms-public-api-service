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



import { Response, NextFunction } from "express";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { ITokenRequest } from "./ITokenRequest";
import { ProtectionTargetController } from "./ProtectionTargetController";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";

const protectionTargetMiddleware = (req: ITokenRequest, res: Response, next: NextFunction) => {
  const protectionTargetController: ProtectionTargetController = ProtectionTargetController.getInstance();
  protectionTargetController
    .checkTargetAccess(req)
    .then(() => {
      next();
    })
    .catch((err) => {
      Log.log(err, LogLevel.error);
      next(
        new CustomRestError(
          {
            code: 401,
            message: "access denied",
          },
          401,
        ),
      );
    });
};

export { protectionTargetMiddleware };
