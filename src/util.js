module.exports = {
    cmdTriggerSymbol: "!",
    rand: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    extendExpect: () => {
        expect.extend({
            toBeInArray(received, argument) {
                const pass = argument.indexOf(received) > -1;
                if (pass) {
                    return {
                        pass: true,
                        message: () => `expected ${received} not to be in array: ${argument}`,
                    }
                } else {
                    return {
                        pass: false,
                        message: () => `expected ${received} to be in array: ${argument}`,
                    }
                }
            }
        });
    }
};
