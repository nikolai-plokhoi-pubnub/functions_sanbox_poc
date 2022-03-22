'use strict';

const fs = require('fs');
const vm = require('vm');
const { docopt } = require('docopt');

const doc = `
---

Usage:
  index.js <function-file> <request-body> <kvstore-file> <vault-file> <pubnub-pubkey> <pubnub-subkey> <uuid>
  index.js -h | --help
`;
const args = docopt(doc);

const requestBody = fs.readFileSync(args['<request-body>'], 'utf-8');
const parsedRequest = JSON.parse(requestBody);

let functionBody = fs.readFileSync(args['<function-file>'], 'utf-8');
functionBody = functionBody.replace('export default', 'const handler =');
functionBody += '\nhandler(request);';

const require_wrapper = (libraryName) => {
    switch (libraryName) {
        case 'console': return console;
        case 'utils': return require('./lib/utils_public');
        case 'crypto': return require('./lib/crypto');
        case 'xhr': return require('./lib/xhr');
        case 'codec/auth': return require('./lib/codec/auth');
        case 'codec/base64': return require('./lib/codec/base64');
        case 'codec/query_string': return require('./lib/codec/query_string');

        case 'kvstore': {
            const KVStore = require('./lib/kvstore');
            const kvStoreFile = args['<kvstore-file>'];
            return new KVStore(kvStoreFile);
        }

        case 'vault': {
            const Vault = require('./lib/vault');
            const vaultFile = args['<vault-file>'];
            return new Vault(vaultFile);
        }

        case 'pubnub': {
            const PubNub = require('./lib/pubnub_lib_wrapper');
            const publishKey = args['<pubnub-pubkey>'];
            const subscribeKey = args['<pubnub-subkey>'];
            const uuid = args['<uuid>'];
            return new PubNub(publishKey, subscribeKey, uuid);
        }

        default:
            throw new Error('Required unknown library: ' + libraryName);
    }
}


const sandBox1 = vm.createContext({request: parsedRequest, require: require_wrapper});
vm.runInNewContext(functionBody, sandBox1);
