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




import { Request, Response, NextFunction } from "express";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";
import { PkCore } from "@symlinkde/eco-os-pk-models";

// tslint:disable-next-line:cyclomatic-complexity
const federationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.path === "/api/v1/federation/user" ||
    req.path === "/api/v1/federation/content" ||
    req.path === "/api/v1/federation/deliver"
  ) {
    if (
      req.header("X-Federation-Checksum") === undefined ||
      req.header("X-Federation-Checksum") === null ||
      req.header("X-Federation-Checksum") === ""
    ) {
      next(
        // add 858 error message
        new CustomRestError(
          {
            code: 403,
            message: "federation rejected due missing federation checksum",
          },
          403,
        ),
      );
      return;
    }

    const federationClient = serviceContainer.get<PkCore.IEcoFederationClient>(
      ECO_OS_PK_CORE_TYPES.IEcoFederationClient,
    );
    try {
      await federationClient.validateIncomingFederationRequest(String(req.header("X-Federation-Checksum")), req.body);
    } catch (err) {
      if (!err.response) {
        next(new CustomRestError(err, 500));
        return;
      }
      next(new CustomRestError(err.response.data.error, err.response.status));
      return;
    }
  }

  next();
  return;
};

export { federationMiddleware };
