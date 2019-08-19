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

import { ICertService } from "./ICertService";
import { PkRedis } from "@symlinkde/eco-os-pk-models";
import { injectable } from "inversify";
import { redisContainer, REDIS_TYPES } from "@symlinkde/eco-os-pk-redis";
import { IRedisClient } from "@symlinkde/eco-os-pk-models/lib/models/packages/pk_redis/Namespace";
import * as forge from "node-forge";

const STORAGE_KEY = "certs.public.service";

interface IStorageKeySetObject {
  privateKey: string;
  publicKey: string;
}

@injectable()
class Cert implements ICertService {
  private redisClient: PkRedis.IRedisClient;
  private keys: forge.pki.KeyPair;

  constructor() {
    this.keys = forge.pki.rsa.generateKeyPair(4096);
    this.redisClient = redisContainer.get<IRedisClient>(REDIS_TYPES.IRedisClient);
    this.initKeys();
  }

  public parseBase64(data: any): string {
    return forge.util.decode64(data);
  }

  public async getPublicKeyPem(): Promise<string> {
    return await this.getStoredPublicKey();
  }

  public async decrypt(data: any): Promise<any> {
    const privateKeyPem = await this.getStoredPrivateKey();
    const privateKey: any = forge.pki.privateKeyFromPem(privateKeyPem);

    return privateKey.decrypt(data, "RSA-OAEP", {
      md: forge.md.sha512.create(),
    });
  }

  private async getStoredPublicKey(): Promise<string> {
    let loadedKeyObject: IStorageKeySetObject = await this.redisClient.get(STORAGE_KEY);
    if (loadedKeyObject === null) {
      await this.initKeys();
      loadedKeyObject = await this.redisClient.get(STORAGE_KEY);
    }

    return forge.util.decode64(loadedKeyObject.publicKey);
  }

  private async getStoredPrivateKey(): Promise<string> {
    let loadedKeyObject: IStorageKeySetObject = await this.redisClient.get(STORAGE_KEY);
    if (loadedKeyObject === null) {
      await this.initKeys();
      loadedKeyObject = await this.redisClient.get(STORAGE_KEY);
    }

    return forge.util.decode64(loadedKeyObject.privateKey);
  }

  private async initKeys(): Promise<void> {
    if ((await this.redisClient.get(STORAGE_KEY)) === null) {
      await this.redisClient.set(
        STORAGE_KEY,
        {
          privateKey: forge.util.encode64(forge.pki.privateKeyToPem(this.keys.privateKey)),
          publicKey: forge.util.encode64(forge.pki.publicKeyToPem(this.keys.publicKey)),
        },
        300,
      );
    }
    return;
  }
}

export { Cert };
