/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.conf = {
        comments: {
            lineComment: '--',
            blockComment: ['--[[', ']]'],
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['do', 'end'],
            ['then', 'end']
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: '\'', close: '\'' },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: '\'', close: '\'' },
        ],
        folding: {
            markers: {
                start: new RegExp("^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))"),
                end: new RegExp("^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))")
            }
        }
    };
    exports.language = {
        defaultToken: '',
        tokenPostfix: '.lua',
        keywords: [
           'print', 'collectgarbage', 'type', 'tostring', 'tonumber', 'pairs', 'ipairs', 'next', 'assert', 'pcall', 'xpcall', 'error', 'select', 'require', 'loadstring', 'wait', 'rawset', 'rawget', '_G', 'gcinfo', 'getfenv', 'getmetable', 'setmetable', 'newproxy', 'os', 'time', 'difftime', 'debug', 'traceback', 'profilebegin', 'profileend', 'rawequal', 'setfenv', 'unpack', '_VERSION', 'coroutine', 'create', 'resume', 'running', 'status', 'wrap', 'yield', 'string', 'byte', 'char', 'dump', 'find', 'format', 'len', 'lower', 'rep', 'reverse', 'sub', 'upper', 'gmatch', 'gsub', 'table', 'concat', 'insert', 'remove', 'sort', 'math', 'abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'cosh', 'deg', 'exp', 'floor', 'fmod', 'frexp', 'huge', 'ldexp', 'log', 'log10', 'max', 'min', 'modf', 'noise', 'pi', 'pow', 'rad', 'random', 'randomseed', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'game', 'Enum', 'script', 'shared', 'workspace', 'Axes', 'BrickColor', 'CFrame', 'Color3', 'ColorSequence', 'ColorSequenceKeypoint', 'Faces', 'Instance', 'NumberRange', 'NumberSequence', 'NumberSequenceKeypoint', 'PhysicalProperties', 'Rat', 'Rect', 'Region3', 'Region3int16', 'UDim', 'UDim2', 'Vector2', 'Vector3', 'Vector3int16', 'Vector2int16', 'delay', 'elapsedTime', 'LoadLibrary', 'spawn', 'tick', 'time', 'time', 'typeof', 'UserSettings', 'ypcall', 'Synapse', 'Decompile'
        ],
        brackets: [
            { token: 'delimiter.bracket', open: '{', close: '}' },
            { token: 'delimiter.array', open: '[', close: ']' },
            { token: 'delimiter.parenthesis', open: '(', close: ')' }
        ],
        globals: [
            'math', 'debug', 'coroutine', 'print', 'ipairs', 'pairs', 'tostring',
			'tonumber',
        ],
        operators: [
            '+', '-', '*', '/', '%', '^', '#', '==', '~=', '<=', '>=', '<', '>', '=',
            ';', ':', ',', '.', '..', '...'
        ],
        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        // The main tokenizer for our languages
        tokenizer: {
            root: [
                // identifiers and keywords
                [/[a-zA-Z_]\w*/, {
                        cases: {
                            '@keywords': { token: 'keyword.$0' },
                            '@globals': { token: 'global' },
                            '@default': 'identifier'
                        }
                    }],
                // whitespace
                { include: '@whitespace' },
                // keys
                [/(,)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/, ['delimiter', '', 'key', '', 'delimiter']],
                [/({)(\s*)([a-zA-Z_]\w*)(\s*)(:)(?!:)/, ['@brackets', '', 'key', '', 'delimiter']],
                // delimiters and operators
                [/[{}()\[\]]/, '@brackets'],
                [/@symbols/, {
                        cases: {
                            '@operators': 'delimiter',
                            '@default': ''
                        }
                    }],
                // numbers
                [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, 'number.hex'],
                [/\d+?/, 'number'],
                // delimiter: after number because of .\d floats
                [/[;,.]/, 'delimiter'],
                // strings: recover on non-terminated strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/"/, 'string', '@string."'],
                [/'/, 'string', '@string.\''],
            ],
            whitespace: [
                [/[ \t\r\n]+/, ''],
                [/--\[([=]*)\[/, 'comment', '@comment.$1'],
                [/--.*$/, 'comment'],
            ],
            comment: [
                [/[^\]]+/, 'comment'],
                [/\]([=]*)\]/, {
                        cases: {
                            '$1==$S2': { token: 'comment', next: '@pop' },
                            '@default': 'comment'
                        }
                    }],
                [/./, 'comment']
            ],
            string: [
                [/[^\\"']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/["']/, {
                        cases: {
                            '$#==$S2': { token: 'string', next: '@pop' },
                            '@default': 'string'
                        }
                    }]
            ],
        },
    };
});