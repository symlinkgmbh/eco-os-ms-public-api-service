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




import { UserController } from "./UserController";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { CustomRestError } from "@symlinkde/eco-os-pk-api";
import { injectUserHooks } from "@symlinkde/eco-os-pk-hooks";
import { PkApi, PkHooks } from "@symlinkde/eco-os-pk-models";

@injectUserHooks
export class MeController extends UserController {
  public userHooks!: PkHooks.IUserHooks;
  constructor() {
    super();
  }

  public async loadMe(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    return await this.loadUserByEmailFromToken(req);
  }

  public async updateMe(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    const result = await this.loadUserByEmailFromToken(req);
    if (result.data._id === null || result.data._id === undefined) {
      throw new CustomRestError(
        {
          code: 404,
          message: "Not found",
        },
        404,
      );
    }

    return await this.updateUserByIdFromToken(result.data._id, req);
  }
}
