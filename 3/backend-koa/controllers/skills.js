const fs = require('fs');
const path = require('path');

const HttpError = require('../errorHandler');

exports.getSkills = () => new Promise((resolve) => {
    let skills = [];
    const skillsFilePath = path.join(__dirname, '../temp/skills.json');

    if (fs.existsSync(skillsFilePath)) {
        skills = JSON.parse(fs.readFileSync(skillsFilePath, 'utf-8'));
    }
    resolve(skills);
});

exports.setNewSkill = ({number, text}) => new Promise((resolve, reject) => {

    if (!number || !text ) {
        throw new HttpError('All fields are required', 400);
    }

    let skills = [];
    const skillsFilePath = path.join(__dirname, '../temp/skills.json');

    if (fs.existsSync(skillsFilePath)) {
        skills = JSON.parse(fs.readFileSync(skillsFilePath, 'utf-8'));
    }

    let newSkills = skills.slice();

    newSkills.push({
        number,
        text
    });

    fs.writeFile(skillsFilePath, JSON.stringify(newSkills), (err) => {
        if (err) {
            throw new HttpError(err, 500);
        }

        resolve({result: true});
    });
});

// [
//     {
//         "number": 10,
//         "text": "лет практики"
//     }
// ]
