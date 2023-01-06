// Copyright 2017 David Holmes.  All Rights Reserved.
// Copyright 2016 Erik Neumann.  All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Ensures the given text consists of only uppercase letters, numbers and underscore
 * and first character is a letter or underscore.
 * @hidden
 */
export function validName(text: string): string {
    if (!isValidName(text)) {
        throw new Error(`The string '${text}' is not a valid name. The name must consist of only uppercase letters, numbers, and underscore. The first character must be a letter or an underscore.`);
    }
    return text;
}

/**
 * @hidden
 * @param text 
 * @returns 
 */
export function isValidName(text: string): boolean {
    if (text.match(/^[A-Z_][A-Z_0-9]*$/)) {
        return true;
    }
    else {
        return false;
    }
}
