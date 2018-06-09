const setPadResolution = require('./setPadResolution');
const DPP = 10;

setPadResolution(DPP)
    .run().catch(console.error);