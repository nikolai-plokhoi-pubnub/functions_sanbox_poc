'use strict';

const fs = require('fs');
const vm = require('vm');
const { docopt } = require('docopt');

const doc = `
---
Example execution:
    $ node index.js -h | --help
    $ node index.js ../functions/request_message_example.js --request='{ "shouldAbort": true }'
    $ node index.js ../functions/request_message_example.js --request='{ "shouldAbort": false }'    
    $ node index.js ../functions/kvstore_example.js --request-file=../requests/request_kvstore.json
    $ node index.js ../functions/vault_example.js
    $ node index.js ../functions/codec_example.js
    $ node index.js ../functions/crypto_example.js
    $ node index.js ../functions/xhr_example.js
    $ node index.js ../functions/pubnub_example.js --request='{ "message": "test_message" }'

Usage:
  index.js <function-file> [(--request=<request-message> | --request-file=<request-file>)] 
      [--kvstore-file=<kvstore-file>]
      [--vault-file=<vault-file>]
      [--pubnub-pubkey=<pubnub-pubkey>]
      [--pubnub-subkey=<pubnub-subkey>]
      [--uuid=<uuid>]
      
Options:
  --request=<request-message>       Incoming message that would be passed to a function for processing [default: {}]
  --request-file=<request-file>     Path to the file that would be used as incoming message payload
  --kvstore-file=<kvstore-file>     Path to the file that would be used as KV-store                    [default: ../persist/kv_store.json]
  --vault-file=<vault-file>         Path to the file that would be used as vault                       [default: ../persist/vault.json]
  --pubnub-pubkey=<pubnub-pubkey>   Publish key configured for PubNub account
  --subnub-pubkey=<pubnub-subkey>   Subscribe key configured for PubNub account
  --uuid=<uuid>                     Path to the file that would be used as vault                       [default: deadcode-cafe-babe-4242-deadbeef0000]
  -h --help                         Show this screen
`;

(function() {
    const args = docopt(doc);
    console.log(`Arguments used to run: ${JSON.stringify(args)}\n`);

    const requestMessage = prepareRequestMessage(args);
    const functionBody = prepareFunctionBody(args);
    const requireWrapper = createRequireWrapper(args);

    const sandboxContext = vm.createContext({
        console: console,
        require: requireWrapper,
        request: {
            message: requestMessage,
            ok: () => Promise.resolve(),
            abort: () => Promise.reject()
        }
    });

    vm.runInNewContext(functionBody, sandboxContext);
})()

function prepareRequestMessage(args) {
    if (args['--request'] != null) {
        return JSON.parse(args['--request']);
    } else {
        const requestBody = fs.readFileSync(args['--request-file'], 'utf-8');
        return JSON.parse(requestBody);
    }
}

function prepareFunctionBody(args) {
    let functionBody = fs.readFileSync(args['<function-file>'], 'utf-8');
    functionBody = functionBody.replace('export default', 'const handler =');

    return `
    console.log('Starting to execute the function');
    console.log('--------------------------------------------------');
    
    ${functionBody}
    
    handler(request).then(_ => {
        return 'ok';
    }).catch(_ => {
        return 'abort';
    }).then(status => {
        console.log('--------------------------------------------------');
        console.log('Execution of function completed with ' + status + '() function');
        console.log();
    });
    `;
}

function createRequireWrapper(args) {
    return (libraryName) => {
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
                const kvStoreFile = args['--kvstore-file'];
                return new KVStore(kvStoreFile);
            }

            case 'vault': {
                const Vault = require('./lib/vault');
                const vaultFile = args['--vault-file'];
                return new Vault(vaultFile);
            }

            case 'pubnub': {
                const PubNub = require('./lib/pubnub_lib_wrapper');
                const publishKey = args['--pubnub-pubkey'];
                const subscribeKey = args['--pubnub-subkey'];
                const uuid = args['--uuid'];
                return new PubNub(publishKey, subscribeKey, uuid);
            }

            default:
                throw new Error('Required unknown library: ' + libraryName);
        }
    }
}
