const fs = require('fs');
const path = require('path');
const skills = require('../temp/skills.json');

exports.getSkills = () => new Promise((resolve) => {
    resolve(skills);
});

exports.setNewSkill = (req) => new Promise((resolve, reject) => {
    const { number, text } = req.body;

    if (!number || !text ) {
        reject({
            code: 400,
            message: 'All fields are required'
        })
    }

    // let skills = [];
    const skillsFilePath = path.join(__dirname, '../temp/skills.json');

    // try {
    //     if (fs.existsSync(skillsFilePath)) {
    //         skills = fs.readFileSync(skillsFilePath, 'utf-8');
    //         if (skills) {
    //             skills = JSON.parse(skills);
    //         }
    //     }
    // }
    // catch (err) {
    //     reject({
    //         code: 500,
    //         message: err
    //     });
    // }

    let newSkills = skills.slice();

    newSkills.push({
        number,
        text
    });


    fs.writeFile(skillsFilePath, JSON.stringify(newSkills), (err) => {
        console.log("err", err);
        if (err) {
            reject({
                code: 500,
                message: err
            });
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
