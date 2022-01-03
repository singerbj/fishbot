module.exports = {
    gooseUserId: process.env.GOOSE_USER || "220342752326451201",
    // gooseUserId: "324721672986951691", //DJK0SH3R's id for development, keep commented out for prod
    cmdTriggerSymbol: "!",
    apexAPIkey: "YIvaaJDwbOEjVsdNz4zt",
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
