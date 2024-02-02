import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

let dir = path.resolve(import.meta.dirname, "../dist/wasm");
let files = fs.readdirSync(dir).filter((file) => file.endsWith(".wasm"));

for (let file of files) {
    let { name } = path.parse(file);

    let data = fs.readFileSync(path.join(dir, file));

    let hash = crypto
        .createHash("sha1")
        .update(data)
        .digest("hex")
        .substring(0, 8);

    let json = JSON.stringify({
        name,
        hash,
    });

    fs.writeFileSync(path.join(dir, `${file}.txt`), data.toString("base64"));
    fs.writeFileSync(path.join(dir, `${file}.json`), json);
}
