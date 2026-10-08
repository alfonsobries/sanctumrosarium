const { withGradleProperties } = require('expo/config-plugins');

/**
 * Gives the Gradle daemon room for the release build: the lint pass that runs on release
 * builds runs out of memory with the template's default heap.
 */
module.exports = function withGradleMemory(config, { heap = '4096m', metaspace = '1024m' } = {}) {
  return withGradleProperties(config, (mod) => {
    const value = `-Xmx${heap} -XX:MaxMetaspaceSize=${metaspace} -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8`;
    mod.modResults = mod.modResults.filter((item) => !(item.type === 'property' && item.key === 'org.gradle.jvmargs'));
    mod.modResults.push({ type: 'property', key: 'org.gradle.jvmargs', value });
    return mod;
  });
};
