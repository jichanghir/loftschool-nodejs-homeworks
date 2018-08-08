const fs = require('fs');
const path = require('path');

const base = './01-module';
const resultBase = './result';

let files = [];

const readDir = (base) => {
    const dirFiles = fs.readdirSync(base);

    dirFiles.forEach((item) => {
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

const doCopy = (index) => {
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

    fs.readFile(file.base, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let name = file.name;

        if (fs.existsSync(path.join(localBase, name))) {
            name = `${file.name}-${Math.random()}`;
        }

        fs.writeFile(path.join(localBase, name), data, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            else {
                doCopy(++index);
            }
        })
    })

}
doCopy(0);

