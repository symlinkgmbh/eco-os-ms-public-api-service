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

import { aclContainer, ACL_TYPES } from "@symlinkde/eco-os-pk-acl";
import { ITokenRequest } from "./ITokenRequest";
import { RestError, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";
import { PkAcl, PkCore } from "@symlinkde/eco-os-pk-models";

export class ProtectionTargetController {
  public static instance: ProtectionTargetController;
  public static getInstance(): ProtectionTargetController {
    if (!ProtectionTargetController.instance) {
      ProtectionTargetController.instance = new ProtectionTargetController();
    }

    return ProtectionTargetController.instance;
  }

  protected aclTargetProcessor: PkAcl.IAclTargetProcessor;
  protected userClient: PkCore.IEcoUserClient;

  private constructor() {
    this.aclTargetProcessor = aclContainer.get<PkAcl.IAclTargetProcessor>(ACL_TYPES.IAclTargetProcessor);
    this.userClient = serviceContainer.get<PkCore.IEcoUserClient>(ECO_OS_PK_CORE_TYPES.IEcoUserClient);
  }

  public async checkTargetAccess(req: ITokenRequest): Promise<void | RestError> {
    if (req.decriptedToken) {
      const result = await this.userClient.loadUserByEmail(req.decriptedToken.email);

      if (!result) {
        throw new CustomRestError(
          {
            code: 401,
            message: "operation denied",
          },
          401,
        );
      }

      const targetAccess = await this.aclTargetProcessor.processTargetPermisson<ITokenRequest>(
        result.data.acl.role,
        req,
      );
      if (!targetAccess) {
        throw new CustomRestError(
          {
            code: 401,
            message: "permisson denied",
          },
          401,
        );
      }
    }

    return;
  }
}
