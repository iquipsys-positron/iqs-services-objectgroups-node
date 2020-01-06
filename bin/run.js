let ObjectGroupsProcess = require('../obj/src/container/ObjectGroupsProcess').ObjectGroupsProcess;

try {
    new ObjectGroupsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
