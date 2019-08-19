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

import dns from "dns";

export class StaticSecondLockResolver {
  public static async hasDnsEntry(domain: string): Promise<boolean> {
    return new Promise((resolve) => {
      dns.resolveSrv(`_2ndlock._tcp.${domain}`, (err, res) => {
        if (err) {
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
