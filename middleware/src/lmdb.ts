import {open} from "lmdb";
export const myDB = open({
    path: 'my-db',
    compression: true
});