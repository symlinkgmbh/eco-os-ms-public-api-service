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

import { Response, NextFunction, Request } from "express";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { ProtectionController } from "./ProtectionController";
import { ITokenRequest } from "./ITokenRequest";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";
import { PkCore } from "@symlinkde/eco-os-pk-models";

const processRequestingPath = async (path: string): Promise<boolean> => {
  const configClient: PkCore.IEcoConfigClient = serviceContainer.get<PkCore.IEcoConfigClient>(
    ECO_OS_PK_CORE_TYPES.IEcoConfigClient,
  );
  const loadConf = await configClient.get("publicApiEndpoints");
  const openRoutes: Array<string> = Object(loadConf.data.publicApiEndpoints);
  if (path.split("/")[3] === "queue" || path.split("/")[3] === "docs" || path.split("/")[3] === "validation") {
    return true;
  }

  const index = openRoutes.findIndex((entry: string) => entry === path);
  if (index > -1) {
    return true;
  }

  return false;
};

const processAuthenticationHeader = (req: Request): boolean => {
  if (!req.headers.authorization) {
    Log.log(`detect unauthorized request`, LogLevel.warning);
    Log.log(req, LogLevel.warning);
    return false;
  }

  if (req.headers.authorization.split(" ")[0] !== "Bearer" || req.headers.authorization.split(" ")[1] === undefined) {
    Log.log(`detect unauthorized request`, LogLevel.warning);
    Log.log(req, LogLevel.warning);
    return false;
  }

  return true;
};

const processAuthenticationByToken = async (req: ITokenRequest, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    next(
      new CustomRestError(
        {
          code: 401,
          message: "access denied",
        },
        401,
      ),
    );
    return;
  }
  const protectionController: ProtectionController = ProtectionController.getInstance();
  protectionController
    .validateToken(req.headers.authorization.split(" ")[1])
    .then((extractedToken) => {
      req.decriptedToken = extractedToken;
      next();
      return;
    })
    .catch((err) => {
      next(
        new CustomRestError(
          {
            code: 401,
            message: "access denied",
          },
          401,
        ),
      );
      return;
    });
};

const protectionMiddelware = async (req: ITokenRequest, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, Accept-Language, X-Captcha-Token, X-Captcha-Result, X-Req-Checksum, X-Language-Delimiter, X-Federation-Key, X-Federation-Checksum, X-Api-Key",
  );

  if ("OPTIONS" === req.method) {
    next();
    return;
  }

  if (await processRequestingPath(req.path)) {
    next();
    return;
  }

  if (!processAuthenticationHeader(req)) {
    next(
      new CustomRestError(
        {
          code: 401,
          message: "access denied",
        },
        401,
      ),
    );
    return;
  }

  processAuthenticationByToken(req, res, next);
};

export { protectionMiddelware };
