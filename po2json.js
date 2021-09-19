#!/usr/bin/env node

const process = require('process');
const PO = require('pofile');

if (process.argv.length === 3) {
    PO.load(process.argv[2], (err, po) => {
        if (!err) {
            const messages = {
                "": {
                    domain: po.headers['X-Domain'] || 'messages',
                    lang: po.headers.Language,
                    'plural-forms': po.headers['Plural-Forms'],
                },
            };

            po.items.forEach((item) => {
                const key = item.msgctxt !== null ? `${item.msgctxt}\u0004${item.msgid}` : item.msgid;
                messages[key] = item.msgstr;
            });

            const result = {
                domain: po.headers['X-Domain'] || 'messages',
                locale_data: {
                    messages,
                }
            }

            process.stdout.write(JSON.stringify(result));
            process.exit(0);
        }

        process.stderr.write(err.toString());
        process.exit(1);
    });
} else {
    process.stderr.write('Usage: po2json input.po\n');
}
