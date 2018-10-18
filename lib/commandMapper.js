var _ = require('lodash'), CommandMapper;

CommandMapper = function(program, config) {
    config = config || {};
    this.program = program;
    this.commands = program.commands || [];
    this.commandFilter = config.commandFilter;
};

CommandMapper.prototype.hasNoArguments = function(argv) {
    return argv.length <= 2;
};

CommandMapper.prototype.mapCommands = function() {
    var commands = _(this.commands).map(this.mapCommand, this).value(),
        me = this;
    if (this.commandFilter) {
        commands = _.filter(commands, function(command) {
            return me.commandFilter(command.name);
        });
    }
    return commands;
};

CommandMapper.prototype.mapArguments = function(commandName) {
    var command = this.getCommand(commandName);
    return _.map(command._args, this.mapArgument) || [];
};

CommandMapper.prototype.mapArgument = function(argument) {
    return {
        name: argument.name,
        required: argument.required
    };
};

CommandMapper.prototype.mapOptions = function(commandName) {
    var command = this.getCommand(commandName);
    return _.map(command.options, this.mapOption.bind(this)) || [];
};

CommandMapper.prototype.mapOption = function(option) {

    return {
        name: option.long,
        bool: this.isBool(option),
        description: option.description,
        required: !! option.required,
        default: this.getDefault(option)
    };
};

CommandMapper.prototype.isBool = function(option) {
    return (option.bool && !option.required && !option.optional) || option.long.indexOf('-no-') >= 0;
};

CommandMapper.prototype.getDefault = function(option) {
    if (option.long.indexOf('-no-') >= 0) {
        return false;
    }
    return undefined;
};

CommandMapper.prototype.mapCommand = function(command) {
    return {
        name: command._name,
        description: command._description
    };
};

CommandMapper.prototype.getCommand = function(commandName) {
    return _.find(this.commands, {
        _name: commandName
    }) || {};
};

module.exports = CommandMapper;
