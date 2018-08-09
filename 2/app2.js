const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const base = './webinar-async';
const resultBase = './result';

let files = [];

const readDir = (base) => {
    const dirFiles = fs.readdirSync(base);

    dirFiles.forEach((item, index) => {
        let localBase = path.join(base, item);
        let state = fs.statSync(localBase);

        if (state.isDirectory()) {
            readDir(localBase);
        }
        else {
            files.push({name: item, base: localBase});
        }
    })
}

readDir(base);

if (!fs.existsSync(resultBase)) {
    fs.mkdirSync(resultBase);
}

const doCopy = async (index) => {
    try {
        if (index > files.length - 1) {
            // тут удаляем исходную папку, НО я этого делать не буду :)
            return;
        }

        const file = files[index];
        const nameFolder = file.name.charAt(0).toLowerCase();
        const localBase = path.join(resultBase, nameFolder);

        if (!fs.existsSync(localBase)) {
            fs.mkdirSync(localBase);
        }

        const data = await readFile(file.base);

        let name = file.name;

        if (fs.existsSync(path.join(localBase, name))) {
            name = `${file.name}-${Math.random()}`;
        }

        await writeFile(path.join(localBase, name), data);

        doCopy(++index);
    }
    catch (err) {
        console.error("err", err);
        process.exit(1);
    }

}
doCopy(0);

