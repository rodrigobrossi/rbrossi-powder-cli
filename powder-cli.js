#!/usr/bin/env node

var program = require('commander'),
    inquander = require('.'),
    inquirer = require('inquirer')
_ = require('lodash');

function list(val) {
    if (typeof val === "string") {
        return val.split(',');
    } else {
        return val;
    }
}

program
    .version('1.0.0')
    .command('create <tpae> <fileName>') //Adding file name to the equation
    .description('Create yaml file')
    .option('-c, --tpae [type]', 'Type the TPAE version? [7609]', '7609')
    .option('-a, --addons <addons>', 'What addons you want to add to your file?', list)
    .option('-s, --inds <inds>', 'Industry Solution?')
    .action(function (type, fileName, options) {

        // Print Order
        console.log('Your ' + type.trim() + ' file name is  for ' + fileName);

        // TPAE Version
        console.log(' Maximo version: ' + options.tpae);

        // Addons to add to your file 
        console.log(' Addons:');
        if (options.addons.length == 0) {
            console.log('   None.')
        } else {
            _.each(options.addons, function (addon) {
                console.log('  - ' + addon);
            })
        }

        // Industry solutions to ad to your file 
        console.log(' Inds:');
        if (options.inds.length == 0) {
            console.log('   None.')
        } else {
            _.each(options.inds, function (ind) {
                console.log('  - ' + ind);
            })
        }

        // // Prompt for file generation
        // if (program.usingInquirer) {
        //     inquirer.prompt([{
        //         type: 'confirm',
        //         name: 'generate',
        //         message: 'Are you ready to generate your file?',
        //         default: true
        //     }]).then(function (answers) {
        //         if (answers.tip) {
        //             inquander.runCommand('generate');
        //         }
        //     })
        // }

        // Prompt for file generation
        if (program.usingInquirer) {
            inquirer.prompt([{
                type: 'confirm',
                name: 'correct',
                message: 'Is the setup information correct?',
                default: true
            }]).then(function (answers) {
                if (answers.tip) {
                    inquander.runCommand('generate');
                }
            })
        }
    });

program
    .command('Update <filename> [notininquirer]')
    .description('Update an existent file')
    .action(function (filename, notininquirer) {
        console.log("Your file name is #: " + filename);
    });
program
    .command('generate <filename> [notininquirer]')
    .description('update a yaml compose file ')
    .action(function (filename, notininquirer) {
        console.log("Your file name will be #: " + filename);
        console.log('From now on you are able to create your file');
    });


inquander.parse(program, process.argv, {
    message: 'Welcome to docker yaml tools.  What do you want to do?',
    defaultCommand: 'create',
    hidden: ['notininquirer'],
    overrides: {
        'fileName':{
                type: 'editor',
                name:'fileName',
                message: 'What is the yaml\'s file name?',
                default: 'maximodev-cli.yaml'
        },
        'tpae': {
            type: 'editor',
            name: 'tpae',
            message: 'What is the TPAE version?',
            default: '7609'
        },
        'tpae-hf': {
            type: 'confirm',
            name: 'tpae-hf',
            message: 'What is the TPAE version?',
            default: true
        },
        '--inds': {
            type: 'checkbox',
            name: '--inds',
            message: 'For what Industry Solution??',
            // Note that one can use promises here:
            choices: ['Nuclear', 'Transportation', 'Aviation', 'Oil & Gas', 'Utilization', 'Aviation']
        },
        'inds-hf': {
            type: 'confirm',
            name: 'is-hf',
            message: 'Do you want to apply the IS Hot Fixes?',
            default: true
        },
        '--addons': {
            type: 'checkbox',
            name: '--addons',
            message: 'Select the addons you need to include?',
            choices: ['Spacial', 'Scheduler', 'Scheduler Plus', 'Calibration', 'Linear', 'ACM', 'HSE', 'ST']
        }
        // '--special_requests': {
        //     type: 'editor',
        //     name: '--special_requests',
        //     message: 'Any special requests?'
        // },
        // 'creditcard': {
        //     type: 'password',
        //     message: 'Credit Card #:'
        // },
    }
});
