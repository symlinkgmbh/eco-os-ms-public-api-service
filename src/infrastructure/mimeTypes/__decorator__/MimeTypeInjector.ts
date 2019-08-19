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

import { IMimeTypesUtils } from "../IMimeTypesUtils";
import { mimeTypeContainer } from "../MimeTypeContainer";
import { MIMETYPETYPES } from "../MimeTypeTypes";

// tslint:disable-next-line:typedef
function injectMimeType<T extends new (...args: any[]) => {}>(constructor: T) {
  return class extends constructor {
    // tslint:disable-next-line:member-access
    mimetype: IMimeTypesUtils = mimeTypeContainer.get<IMimeTypesUtils>(MIMETYPETYPES.IMimeTypesUtils);
  };
}

export { injectMimeType };
